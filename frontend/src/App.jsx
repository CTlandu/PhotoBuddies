import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./index.css";
// importing SuperTokens packages
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import ThirdParty, {
  Github,
  Google,
  Facebook,
  Apple,
} from "supertokens-auth-react/recipe/thirdparty";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import EmailVerification from "supertokens-auth-react/recipe/emailverification";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui";
import { ThirdPartyPreBuiltUI } from "supertokens-auth-react/recipe/thirdparty/prebuiltui";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import { EmailVerificationPreBuiltUI } from "supertokens-auth-react/recipe/emailverification/prebuiltui";
import Session from "supertokens-auth-react/recipe/session";
import * as reactRouterDom from "react-router-dom";
// import createStore from 'react-auth-kit/createStore'
// import AuthProvider from 'react-auth-kit/AuthProvider'
import Home from "./pages/Home/Home";
import NoPage from "./pages/NoPage";
import Profile from "./pages/Profile/Profile";
import { useEffect, useState, createContext } from "react";
import Portfolio from "./pages/Portfolio/Portfolio";
import FindMatches from "./pages/FindMatches/FindMatches";
import About from "./pages/About/About";
import CookieConsent from "./components/CookieConsent";
import Test from "./pages/Test";
import User_Settings from "./pages/User_Settings/User_Settings";

console.log("appName:", import.meta.env.VITE_APP_NAME);
console.log("apiDomain:", import.meta.env.VITE_API_DOMAIN);
console.log("websiteDomain:", import.meta.env.VITE_WEBSITE_DOMAIN);
console.log("apiBasePath:", import.meta.env.VITE_APP_API_BASE_PATH);
console.log("websiteBasePath:", import.meta.env.VITE_WEBSITE_BASE_PATH);

SuperTokens.init({
  appInfo: {
    // learn more about this on https://supertokens.com/docs/thirdpartyemailpassword/appinfo
    appName: import.meta.env.VITE_APP_NAME,
    apiDomain: import.meta.env.VITE_API_DOMAIN,
    websiteDomain: import.meta.env.VITE_WEBSITE_DOMAIN,
    apiBasePath: import.meta.env.VITE_APP_API_BASE_PATH,
    websiteBasePath: import.meta.env.VITE_WEBSITE_BASE_PATH,
  },
  recipeList: [
    ThirdParty.init({
      signInAndUpFeature: {
        providers: [Google.init()],
        onHandleEvent: async (context) => {
          console.log("登录onHandleEvent called", context);
          if (context.action === "SUCCESS") {
            console.log("第三方登录成功，尝试保存用户信息");
            let { id, email } = context.user;
            if (!email) {
              console.error("Email is missing for user:", id);
              return;
            }
            const userInfo = { id, email };
            try {
              console.log("发送请求到 /api/thirdPartyLogin");
              const response = await fetch(
                `${import.meta.env.VITE_API_DOMAIN}/api/thirdPartyLogin`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(userInfo),
                  credentials: "include", // 添加这行以确保跨域请求包含凭证
                }
              );
              console.log("响应状态:", response.status);
              // 重新加载主页面，以重新尝试获取token
              window.location.reload();
              if (response.ok) {
                const responseData = await response.json();
                console.log("响应数据:", responseData);
                console.log("第三方用户信息保存成功");

                // 等待 token 设置完成
                const newToken = await getToken();
                setAccessToken(newToken);
              } else {
                console.error("保存第三方用户信息失败");
              }
            } catch (error) {
              console.error("保存第三方用户信息时出错:", error);
            }
          }
          // 重新加载主页面，以重新尝试获取token
          window.location.reload();
        },
      },
    }),
    EmailVerification.init({
      mode: "REQUIRED",
    }),
    EmailPassword.init({
      contactMethod: "EMAIL_OR_PHONE",
      onHandleEvent: async (context) => {
        console.log("EmailPassword onHandleEvent called", context);
        if (context.action === "SUCCESS") {
          if (
            context.isNewRecipeUser &&
            context.user.loginMethods.length === 1
          ) {
            console.log("检测到新用户注册，调用 emailUserSignUp");
            // TODO: Sign up
            try {
              console.log("发送请求到 /api/emailUserSignUp");
              console.log("获取到的user_id", context.user.id);
              console.log("获取到的email", context.user.emails[0]);

              const signUpResponse = await fetch(
                `${import.meta.env.VITE_API_DOMAIN}/api/emailUserSignUp`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    id: context.user.id,
                    email: context.user.emails[0],
                  }),
                  credentials: "include", // 这相当于 axios 的 withCredentials: true
                }
              );

              console.log("响应状态:", signUpResponse.status);
              if (signUpResponse.status === 200) {
                console.log("新用户信息保存成功");
              } else {
                console.error("保存新用户信息失败");
              }
            } catch (error) {
              console.error("保存新用户信息时出错:", error);
              if (error.response) {
                console.error("响应数据:", error.response.data);
                console.error("响应状态:", error.response.status);
              } else if (error.request) {
                console.error("没有收到响应");
              } else {
                console.error("错误信息:", error.message);
              }
            }
          } else {
            // TODO: Sign in
            window.location.href = "/findmatches";
          }
        }
        // 重新加载主页面，以重新尝试获取token
        // window.location.reload();
      },
    }),
    Session.init({
      tokenTransferMethod: "header",
      maxRetryAttemptsForSessionRefresh: 10,
      exposeAccessTokenToFrontendInCookieBasedAuth: true,
    }),
  ],
});

async function getToken() {
  const isSessionValid = await Session.doesSessionExist();
  if (isSessionValid) {
    const accessToken = await Session.getAccessToken();
    console.log("Access Token: 有");
    return accessToken;
  } else {
    console.log("User is not logged in");
    return null;
  }
}

function App() {
  const [accessToken, setAccessToken] = useState(null);
  useEffect(() => {
    async function fetchToken() {
      const token = await getToken();
      setAccessToken(token);
    }

    fetchToken();
  }, []);

  return (
    <>
      {/** 页面打开时，询问用户关于cookie协议设置 */}
      <CookieConsent />

      <SuperTokensWrapper>
        <BrowserRouter>
          <Routes>
            {/*This renders the login UI on the /auth route*/}
            {/* {getSuperTokensRoutesForReactRouterDom(reactRouterDom, [ThirdPartyPreBuiltUI, EmailPasswordPreBuiltUI, EmailVerificationPreBuiltUI])} */}
            {getSuperTokensRoutesForReactRouterDom(reactRouterDom, [
              ThirdPartyPreBuiltUI,
              EmailPasswordPreBuiltUI,
              EmailVerificationPreBuiltUI,
            ])}

            {/*Your app routes*/}

            {/* free routes */}
            <Route index element={<Home token={accessToken} />}></Route>
            <Route exact path="/home" element={<Home token={accessToken} />} />
            <Route
              exact
              path="/findmatches"
              element={<FindMatches token={accessToken} />}
            ></Route>
            <Route
              exact
              path="/about"
              element={<About token={accessToken} />}
            ></Route>
            <Route
              exact
              path="/test"
              element={<Test token={accessToken} />}
            ></Route>
            {/* <Route exact path="/login" element={<Login />}></Route>
          <Route exact path="/register" element={<Register />}></Route> */}
            <Route path="*" element={<NoPage token={accessToken} />}></Route>

            {/* protected routes */}
            <Route
              path="/profile"
              element={
                <SessionAuth>
                  <Profile token={accessToken} />
                </SessionAuth>
              }
            ></Route>
            <Route
              path="/portfolio"
              element={
                <SessionAuth>
                  <Portfolio token={accessToken} />
                </SessionAuth>
              }
            ></Route>
            <Route
              path="/usersettings"
              element={
                <SessionAuth>
                  <User_Settings token={accessToken} />
                </SessionAuth>
              }
            ></Route>
          </Routes>
        </BrowserRouter>
      </SuperTokensWrapper>
    </>
  );
}

export default App;
