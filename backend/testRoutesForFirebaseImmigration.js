const axios = require("axios");

const BASE_URL = "http://localhost:4000/api";

async function testRoutes() {
  try {
    // 测试获取热门城市
    console.log("Testing popularCities route...");
    const popularCitiesResponse = await axios.get(`${BASE_URL}/popularCities`);
    console.log("Popular cities:", popularCitiesResponse.data);

    // 测试获取用户列表
    console.log("\nTesting fetchAll route...");
    const fetchAllResponse = await axios.get(
      `${BASE_URL}/fetchAll?role=model&page=1&limit=6`
    );
    console.log("Fetched users:", fetchAllResponse.data.users.length);
    console.log("Total count:", fetchAllResponse.data.totalCount);

    // 测试创建用户
    console.log("\nTesting saveUserInfo route...");
    const newUser = {
      id: "testuser" + Date.now(),
      email: "testuser@example.com",
      preferredName: "Test User",
    };
    const createUserResponse = await axios.post(
      `${BASE_URL}/saveUserInfo`,
      newUser
    );
    console.log("Created user:", createUserResponse.data.user);

    // 添加一个短暂的延迟
    await new Promise((resolve) => setTimeout(resolve, 10000));

    // 测试获取用户资料
    console.log("\nTesting get profile route...");
    const getProfileResponse = await axios.get(
      `${BASE_URL}/profile?id=${createUserResponse.data.user.id}`
    );
    console.log("Retrieved user profile:", getProfileResponse.data);

    // 测试更新用户资料
    console.log("\nTesting update profile route...");
    const updateData = {
      id: createUserResponse.data.user.id,
      lastName: "Updated",
      pronouns: "they/them",
    };
    const updateProfileResponse = await axios.put(
      `${BASE_URL}/profile`,
      updateData
    );
    console.log("Updated user profile:", updateProfileResponse.data.user);

    // 测试更新作品集
    console.log("\nTesting updatePortfolio route...");
    const portfolioData = {
      id: createUserResponse.data.user.id,
      model_info: {
        model_lookingfor: ["Fashion", "Portrait"],
      },
    };
    const updatePortfolioResponse = await axios.put(
      `${BASE_URL}/updatePortfolio`,
      portfolioData
    );
    console.log("Updated portfolio:", updatePortfolioResponse.data.user);

    // 测试上传模特图片
    console.log("\nTesting modelImageUpload route...");
    const modelImageData = {
      id: createUserResponse.data.user.id,
      model_image: "https://example.com/model_image.jpg",
    };
    const modelImageUploadResponse = await axios.put(
      `${BASE_URL}/modelImageUpload`,
      modelImageData
    );
    console.log(
      "Uploaded model image:",
      modelImageUploadResponse.data.user.model_info.model_images
    );

    // 测试删除模特图片
    console.log("\nTesting modelImageDelete route...");
    const modelImageDeleteResponse = await axios.delete(
      `${BASE_URL}/modelImageDelete`,
      { data: modelImageData }
    );
    console.log(
      "Deleted model image:",
      modelImageDeleteResponse.data.user.model_info.model_images
    );

    console.log("\nAll tests completed successfully!");
  } catch (error) {
    console.error(
      "Error during testing:",
      error.response ? error.response.data : error.message
    );
  }
}

testRoutes();
