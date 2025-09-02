import { useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [credits, setCredits] = useState();

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  const loadCreditsData = async () => {
    try {
      const { data } = await axios.get(backendURL + "/api/users/credits", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCredits(Number(data.credits) || 0);
        setUser(data.user);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load credits data");
    }
  };

const generateImage = async (prompt) => {
  try {
    const { data } = await axios.post(
      backendURL + "/api/images/generate",
      { prompt },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (data.success) {
      loadCreditsData();
      return data.resultImage;
    } else {
      toast.error(data.message || "Failed to generate image");
      loadCreditsData();

      // redirect if credit issue
      if (data.message === "Insufficient Credits. Please recharge" || data.creditBalance <= 0) {
        navigate("/buy");
      }

      return null; // safe return
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to generate image");
    return null;
  }
};


  const logout = () => {
    setUser(null);
    setToken(null);
    setCredits(0);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    if (token) {
      loadCreditsData();
    }
  }, [token]);

  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    backendURL,
    token,
    setToken,
    credits,
    setCredits,
    loadCreditsData,
    logout,
    generateImage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
