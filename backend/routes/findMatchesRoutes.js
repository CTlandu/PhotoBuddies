const express = require("express");
const { db } = require("../firebaseInit");
const router = express.Router();

// 获取热门城市
router.get("/popularCities", async (req, res) => {
  console.log("Entering popularCities route");
  try {
    console.log("Fetching cities snapshot");
    const citiesSnapshot = await db
      .collection("users")
      .select("addresses")
      .get();

    console.log("Cities snapshot size:", citiesSnapshot.size);

    console.log("Processing cities data");
    const cityCounts = {};
    citiesSnapshot.forEach((doc) => {
      const userData = doc.data();
      console.log("User data:", JSON.stringify(userData));
      const addresses = userData.addresses;
      console.log("Addresses:", JSON.stringify(addresses));
      if (addresses && typeof addresses === "object") {
        Object.values(addresses).forEach((address) => {
          if (address && typeof address.formattedCity === "string") {
            cityCounts[address.formattedCity] =
              (cityCounts[address.formattedCity] || 0) + 1;
          }
        });
      }
    });

    console.log("City counts:", JSON.stringify(cityCounts));

    console.log("Sorting and slicing popular cities");
    const popularCities = Object.entries(cityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([city]) => city);

    console.log("Popular cities:", popularCities);
    res.status(200).json(popularCities);
  } catch (error) {
    console.error("Error fetching popular cities:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 修改 fetchAll 路由以支持分页
router.get("/fetchAll", async (req, res) => {
  const { role, city, page = 1, limit = 6 } = req.query;
  try {
    let query = db.collection("users");

    if (role === "model") {
      query = query.where("model_info.model_images", "!=", []);
    } else if (role === "photographer") {
      query = query.where("photographer_info.photographer_images", "!=", []);
    } else {
      return res.status(400).json({
        message: "Invalid role parameter. Must be 'model' or 'photographer'.",
      });
    }

    if (city && city.trim() !== "") {
      query = query.where("addresses", "array-contains", {
        formattedCity: city.trim(),
      });
    }

    const startAfter = (parseInt(page) - 1) * parseInt(limit);
    const snapshot = await query
      .limit(parseInt(limit))
      .offset(startAfter)
      .get();

    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const totalCount = (await query.count().get()).data().count;

    res.status(200).json({
      users,
      totalCount,
      hasMore: startAfter + users.length < totalCount,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
