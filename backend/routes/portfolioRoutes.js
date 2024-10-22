const express = require("express");
const { getUserById, updateUser } = require("../models/userModel");
const router = express.Router();

// 更新ModelInfo或PhotographerInfo
router.put("/updatePortfolio", async (req, res) => {
  const { id, model_info, photographer_info } = req.body;

  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let updateData = {};

    if (model_info) {
      if (model_info.model_lookingfor) {
        model_info.model_lookingfor = [...new Set(model_info.model_lookingfor)];
      }
      updateData.model_info = { ...user.model_info, ...model_info };
    }

    if (photographer_info) {
      if (photographer_info.photographer_lookingfor) {
        photographer_info.photographer_lookingfor = [
          ...new Set(photographer_info.photographer_lookingfor),
        ];
      }
      updateData.photographer_info = {
        ...user.photographer_info,
        ...photographer_info,
      };
    }

    const updatedUser = await updateUser(id, updateData);
    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 摄影师图片上传
router.put("/photographerImageUpload", async (req, res) => {
  const { id, photographer_image } = req.body;
  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const photographer_images =
      user.photographer_info?.photographer_images || [];
    photographer_images.push(photographer_image);
    const updatedUser = await updateUser(id, {
      photographer_info: { ...user.photographer_info, photographer_images },
    });
    res
      .status(200)
      .json({
        message: "Photographer images updated successfully",
        user: updatedUser,
      });
  } catch (error) {
    console.error("Error updating photographer images:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 删除摄影师图片
router.delete("/photographerImageDelete", async (req, res) => {
  const { id, photographer_image } = req.body;
  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const photographer_images =
      user.photographer_info?.photographer_images.filter(
        (image) => image !== photographer_image
      ) || [];
    const updatedUser = await updateUser(id, {
      photographer_info: { ...user.photographer_info, photographer_images },
    });
    res
      .status(200)
      .json({
        message: "Photographer image deleted successfully",
        user: updatedUser,
      });
  } catch (error) {
    console.error("Error deleting photographer image:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 模特图片上传
router.put("/modelImageUpload", async (req, res) => {
  const { id, model_image } = req.body;
  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const model_images = user.model_info?.model_images || [];
    model_images.push(model_image);
    const updatedUser = await updateUser(id, {
      model_info: { ...user.model_info, model_images },
    });
    res
      .status(200)
      .json({
        message: "Model images updated successfully",
        user: updatedUser,
      });
  } catch (error) {
    console.error("Error updating model images:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 删除模特图片
router.delete("/modelImageDelete", async (req, res) => {
  const { id, model_image } = req.body;
  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const model_images =
      user.model_info?.model_images.filter((image) => image !== model_image) ||
      [];
    const updatedUser = await updateUser(id, {
      model_info: { ...user.model_info, model_images },
    });
    res
      .status(200)
      .json({ message: "Model image deleted successfully", user: updatedUser });
  } catch (error) {
    console.error("Error deleting model image:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
