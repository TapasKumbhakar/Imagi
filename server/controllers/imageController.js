import axios from "axios";
import userModel from "../models/userModel.js";
import FormData from "form-data";
import {useNavigate} from "react-router-dom";

export const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;
    const user = req.user; // from middleware

    if (!prompt) {
      return res.json({ success: false, message: "Prompt is required" });
    }

    if (!user || user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "Insufficient Credits. Please recharge",
        creditBalance: user ? user.creditBalance : 0,
      });
    }

    // Send to ClipDrop
    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    // Deduct credit
    await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1,
    });

    res.json({
      success: true,
      message: "Image Generated Successfully",
      creditBalance: user.creditBalance - 1,
      resultImage, // 👈 match frontend
    });
  } catch (error) {
    console.error("Error in generateImage:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

