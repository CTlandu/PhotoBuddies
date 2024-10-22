const mongoose = require("mongoose");
const User = require("./userModel"); // 确保路径正确
require("dotenv").config();

// 连接到数据库
mongoose.connect(
  `mongodb+srv://ctlandu:admin123@mernapp.hj5mpxa.mongodb.net/authDB?retryWrites=true&w=majority&appName=MERNapp`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const updateAddressesField = async () => {
  try {
    // 查找所有用户
    const users = await User.find();

    for (const user of users) {
      if (!user.addresses) {
        user.addresses = [];
      }

      // 更新每个地址对象
      user.addresses = user.addresses.map((address) => ({
        ...address,
        city: address.city || "",
        state: address.state || "",
        country: address.country || "",
        formattedAddress:
          address.formattedAddress || address.formatted_address || "",
        placeId: address.placeId || "",
        lat: address.lat || null,
        lng: address.lng || null,
      }));

      await user.save();
      console.log(`Updated addresses for user ${user.id}`);
    }

    console.log("All users' addresses updated successfully.");
  } catch (error) {
    console.error("Error updating users:", error);
  } finally {
    mongoose.connection.close();
  }
};

updateAddressesField();
