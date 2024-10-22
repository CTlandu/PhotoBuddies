// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import Session from "supertokens-auth-react/recipe/session";
import axios from "axios";
import emptyAvatar from "../assets/empty_avatar.jpg";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const getToken = async () => {
    const isSessionValid = await Session.doesSessionExist();
    if (isSessionValid) {
      const token = await Session.getAccessToken();
      return token;
    } else {
      return null;
    }
  };

  const fetchUserInfo = async () => {
    try {
      const isSessionValid = await Session.doesSessionExist();
      if (isSessionValid) {
        const userId = await Session.getUserId();
        const response = await axios.get(
          `${import.meta.env.VITE_API_DOMAIN}/api/profile`,
          {
            params: { id: userId },
          }
        );
        setUserInfo({
          userId: userId,
          email: response.data.email,
          name: `${response.data.preferredName || ""} ${
            response.data.lastName || ""
          }`.trim(),
          imgUrl: response.data.avatar || emptyAvatar,
        });
      } else {
        setUserInfo(null);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = await getToken();
      setAccessToken(token);
      await fetchUserInfo();
    };
    initializeAuth();

    // 定期检查会话状态
    const interval = setInterval(async () => {
      const isSessionValid = await Session.doesSessionExist();
      if (isSessionValid && !accessToken) {
        const token = await Session.getAccessToken();
        setAccessToken(token);
        await fetchUserInfo();
      } else if (!isSessionValid && accessToken) {
        setAccessToken(null);
        setUserInfo(null);
        setLoading(false);
      }
    }, 5000); // 每5秒检查一次

    return () => clearInterval(interval);
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{ accessToken, userInfo, loading, setAccessToken, fetchUserInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
};
