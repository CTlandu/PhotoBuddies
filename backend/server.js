const dotenv = require("dotenv");
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });
const bodyParser = require("body-parser");
const express = require("express");
// bcrypt 将用户的明文密码转换为一个加密的哈希值。这个哈希值是不可逆的，即无法从哈希值直接还原出原始密码。
//当用户尝试登录时，bcrypt 可以将用户输入的明文密码与存储在数据库中的哈希值进行比较，判断密码是否正确。
// const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

// 引入Firebase
const { db } = require("./firebaseInit");
// 老的auth模块
// const auth = require('./auth');
// const { auth } = require("express-oauth2-jwt-bearer");

const cors = require("cors");
const { middleware } = require("supertokens-node/framework/express");

// // import supertoken packages
const supertokens = require("supertokens-node");
// const Session = require("supertokens-node/recipe/session");
// const EmailPassword = require("supertokens-node/recipe/emailpassword");
// const EmailVerification = require("supertokens-node/recipe/emailverification");
// const ThirdParty = require("supertokens-node/recipe/thirdparty");
const { errorHandler } = require("supertokens-node/framework/express");

const supertokensInit = require("./supertokensInit");

supertokensInit();

// express app
const app = express();

app.use(bodyParser.json({ limit: "2mb" }));
app.use(bodyParser.urlencoded({ limit: "2mb", extended: true }));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: [
      "content-type",
      "Authorization",
      ...supertokens.getAllCORSHeaders(),
    ],
    credentials: true,
    optionsSuccessStatus: 204,
  })
);
console.log("CORS_ORIGIN", process.env.CORS_ORIGIN);

// IMPORTANT: CORS should be before the below line.
app.use(middleware());

/**
 * CORS 是一种机制，允许来自一个域的网页能够请求另一个域的资源。它通过添加一些特定的 HTTP 头来告诉浏览器允许来自不同源的请求。
 * CORS 主要用于解决浏览器的同源策略（Same-Origin Policy）限制的问题，这一策略是为了保护用户免受某些类型的攻击（例如 CSRF）。
 * 
同源策略（Same-Origin Policy）
同源策略规定，浏览器只能在同一个源（协议、域名和端口号均相同）下访问资源。具体来说，同源策略限制了一些类型的跨域 HTTP 请求，例如 AJAX 请求。
如果网页试图请求不同源的资源，浏览器将默认阻止这些请求。

CORS 通过设置服务器响应中的 HTTP 头来告诉浏览器允许特定源的请求。这些头包括：
Access-Control-Allow-Origin
Access-Control-Allow-Headers
Access-Control-Allow-Methods
 * 
这段代码是为了在Express应用中设置CORS头部，从而允许来自不同源的请求访问你的服务器资源。这样可以绕过同源策略，实现跨域访问。
 */
app.use((req, res, next) => {
  // 允许来自所有域的请求
  // res.setHeader("Access-Control-Allow-Origin", "*");

  // 允许客户端使用这些头部字段
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  // 允许客户端使用这些HTTP方法
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// listen for requests
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`服务器启动在${port}端口`);
});

const apiRoutes = require("./routes/routes");
app.use("", apiRoutes);

// Add this AFTER all your routes
app.use(errorHandler());
