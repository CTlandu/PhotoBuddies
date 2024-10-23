const express = require("express");
const User = require("../db/userModel");
const router = express.Router();
const {
  verifySession,
} = require("supertokens-node/recipe/session/framework/express");
const { getUser } = require("supertokens-node/recipe/emailverification");

// 获取用户资料
router.get("/profile", async (req, res) => {
  try {
    const userId = req.query.id;
    const user = await User.findOne({ id: userId });
    if (!user) {
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
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.preferredName =
      preferredName !== undefined ? preferredName : user.preferredName;
    user.lastName = lastName !== undefined ? lastName : user.lastName;
    user.pronouns = pronouns !== undefined ? pronouns : user.pronouns;
    user.birthday = birthday !== undefined ? birthday : user.birthday;
    user.showEmailOnCard =
      showEmailOnCard !== undefined ? showEmailOnCard : user.showEmailOnCard;
    user.showAgeOnCard =
      showAgeOnCard !== undefined ? showAgeOnCard : user.showAgeOnCard;
    user.zipcode = zipcode !== undefined ? zipcode : user.zipcode;
    user.avatar = avatar !== undefined ? avatar : user.avatar;
    user.addresses = addresses || user.addresses;
    user.contact = { ...user.contact, ...contact };
    await user.save();
    res
      .status(200)
      .json({ message: "User profile updated successfully", user });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 检查用户是否存在
router.get("/checkUser", async (req, res) => {
  console.log("checkUser api被调用");
  try {
    const { id } = req.query;
    const user = await User.findOne({ id });
    res.json({ exists: !!user });
  } catch (error) {
    console.error("Error checking user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 用户注册
router.post("/emailUserSignUp", async (req, res) => {
  console.log("emailUserSignUp route called");

  try {
    const { id, email } = req.body;

    if (!id || !email) {
      return res.status(400).json({ message: "Missing id or email" });
    }

    // 创建新用户
    const newUser = new User({
      id: id,
      email: email,
    });

    // 保存新用户到数据库
    await newUser.save();

    console.log("New user information saved:", newUser);
    res
      .status(200)
      .json({ message: "User information saved successfully", user: newUser });
  } catch (error) {
    console.error("Error saving user information:", error);
    // 如果错误是由于重复的唯一键（例如 id 或 email）引起的，返回适当的错误消息
    if (error.code === 11000) {
      return res.status(409).json({ message: "User already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// 添加一个新的路由来处理第三方登录后的用户信息保存
router.post("/thirdPartyLogin", async (req, res) => {
  console.log("thirdPartyLogin route called without verifySession");
  const session = req.session;
  const userId = session.getUserId();

  try {
    const user = await getUser(userId);
    const userInfo = {
      id: userId,
      email: user.email,
      ...req.body, // 其他用户信息
    };

    // 检查用户是否已经存在
    let existingUser = await User.findOne({ id: userId });
    if (!existingUser) {
      const newUser = new User(userInfo);
      await newUser.save();
      console.log("Third-party user information saved:", userInfo);
    } else {
      console.log("User already exists:", existingUser);
    }

    res
      .status(200)
      .json({ message: "User information processed successfully" });
  } catch (error) {
    console.error("Error processing third-party user information:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
