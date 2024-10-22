const { db } = require("../firebaseInit");

const usersCollection = db.collection("users");

// 创建新用户
const createUser = async (userData) => {
  const docRef = await usersCollection.add(userData);
  return { id: docRef.id, ...userData };
};

// 通过 ID 获取用户
const getUserById = async (userId) => {
  console.log("Getting user by ID:", userId); // 添加这行日志
  const doc = await usersCollection.doc(userId).get();
  console.log("Document exists:", doc.exists); // 添加这行日志
  if (!doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() };
};

// 更新用户信息
const updateUser = async (userId, userData) => {
  await usersCollection.doc(userId).update(userData);
  return getUserById(userId);
};

// 删除用户
const deleteUser = async (userId) => {
  await usersCollection.doc(userId).delete();
};

// 获取所有用户
const getAllUsers = async () => {
  const snapshot = await usersCollection.get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

module.exports = {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
};
