import userModel from "../models/userModel.js";
import transactionModel from "../models/transactionModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Stripe from "stripe";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }
    // Check for duplicate email
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.json({ success: false, message: "Email already registered" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userData = {
      name,
      email,
      password: hashedPassword,
    };
    const newUser = new userModel(userData);
    const user = await newUser.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
        creditBalance: user.creditBalance,
      },
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //  Validate inputs
    if (!email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    //  Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    //  Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Generate token if login is successful
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
        creditBalance: user.creditBalance,
      },
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const userCredits = async (req, res) => {
  try {
    const userId = req.body?.userId || req.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing userId" });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({
      success: true,
      credits: user.creditBalance,
      user: { name: user.name, creditBalance: user.creditBalance },
    });
  } catch (error) {
    console.error("Error in userCredits:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const stripeInstance = new Stripe(process.env.STRIPE_KEY_SECRET); // Fix initialization

const paymentStripe = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.userId;

    if (!userId || !planId) {
      return res.json({ success: false, message: "Missing Details" });
    }

    let credits, plan, amount;
    switch (planId) {
      case 'plan_1':
        credits = 100;
        plan = "Basic";
        amount = 10;
        break;
      case 'plan_2':
        credits = 500;
        plan = "Advanced";
        amount = 50;
        break;
      case 'plan_3':
        credits = 1000;
        plan = "Business";
        amount = 100;
        break;
      default:
        return res.json({ success: false, message: "Invalid Plan" });
    }

    // Create Stripe Checkout Session
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: process.env.CURRENCY || 'usd',
            product_data: {
              name: `${plan} Credits`,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/buycredit`,
      metadata: {
        userId,
        credits,
        plan,
      },
    });

    // Save transaction (optional, you may want to save after payment success)
    await transactionModel.create({
      userId,
      plan,
      credits,
      amount,
      date: Date.now(),
      stripeSessionId: session.id,
    });

    res.json({ success: true, order: { id: session.id }, message: "Order created successfully" });
  } catch (error) {
    console.error("Error in paymentStripe:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export { registerUser, loginUser, userCredits , paymentStripe};
// Exporting the functions to be used in routes
