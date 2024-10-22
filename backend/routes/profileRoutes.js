const express = require("express");
const { getUserById, updateUser, createUser } = require("../models/userModel");
const router = express.Router();

// 获取用户资料
router.get("/profile", async (req, res) => {
  try {
    const userId = req.query.id;
    console.log("Fetching profile for user ID:", userId); // 添加这行日志
    const user = await getUserById(userId);
    if (!user) {
      console.log("User not found for ID:", userId); // 添加这行日志
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 更新用户资料
router.put("/profile", async (req, res) => {
  const {
    id,
    preferredName,
    lastName,
    pronouns,
    birthday,
    zipcode,
    avatar,
    contact,
    addresses,
    showEmailOnCard,
    showAgeOnCard,
  } = req.body;
  try {
    const updatedUser = await updateUser(id, {
      preferredName,
      lastName,
      pronouns,
      birthday,
      zipcode,
      avatar,
      contact,
      addresses,
      showEmailOnCard,
      showAgeOnCard,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 用户注册
router.post("/saveUserInfo", async (req, res) => {
  const userInfo = req.body;
  try {
    const newUser = await createUser(userInfo);
    console.log("User information saved:", newUser);
    res
      .status(200)
      .json({ message: "User information saved successfully", user: newUser });
  } catch (error) {
    console.error("Error saving user information:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
