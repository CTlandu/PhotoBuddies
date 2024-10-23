# SuperTokens 初始化注意事项及逻辑说明

## 1. 初始化配置

SuperTokens 的初始化配置在后端的 `supertokensInit.js` 文件中完成。主要包括以下几个部分：

### 注意事项：

- 确保正确设置 `connectionURI` 和 `apiKey`。
- `appInfo` 中的 `apiDomain` 和 `websiteDomain` 应分别指向后端和前端的域名。
- `cookieSecure` 在生产环境中应设置为 `true`。

## 2. 第三方登录（Google）

第三方登录的配置和逻辑主要在 `ThirdParty.init()` 中设置：

### 注意事项：

- 确保在 SuperTokens Dashboard 中正确配置了 Google OAuth 凭证。
- 在生产环境中，替换为自己的 OAuth keys。
- `signInUp` 函数重写了默认实现，用于处理新用户注册和现有用户登录的逻辑。

### 逻辑说明：

1. 用户通过 Google 登录。
2. 如果是新用户，会创建一个新的 User 记录并保存到数据库。
3. 如果是现有用户，直接登录。

## 3. 邮箱密码登录和邮箱验证

邮箱密码登录和邮箱验证的配置在 `EmailPassword.init()` 和 `EmailVerification.init()` 中设置：

### 注意事项：

- 邮箱验证模式设置为 "REQUIRED"，意味着用户必须验证邮箱才能完全访问应用。
- 可以自定义邮件发送逻辑，目前使用默认实现。

### 逻辑说明：

1. 用户注册时，SuperTokens 会自动发送验证邮件。
2. 用户可以登录，但在验证邮箱之前，某些功能可能受限。
3. 邮箱验证成功后，用户获得完全访问权限。

## 4. Session 管理

Session 管理的配置在 `Session.init()` 中设置：

### 注意事项：

- `exposeAccessTokenToFrontendInCookieBasedAuth` 设置为 `true`，允许前端访问访问令牌。
- `cookieSameSite` 设置为 "None"，允许跨站点请求。
- `tokenTransferMethod` 设置为 "header"，表示令牌通过 HTTP 头部传输。

## 5. 后端路由

用户相关的后端路由定义在 `profileRoutes.js` 文件中：

### 注意事项：

- `/profile` 路由用于获取和更新用户资料。
- `/emailUserSignUp` 路由处理邮箱注册的用户信息保存。
- `/thirdPartyLogin` 路由处理第三方登录后的用户信息保存。

## 6. 前端集成

前端需要相应地配置 SuperTokens，确保与后端配置匹配。主要包括：

- 初始化 SuperTokens
- 配置路由
- 处理登录、注册和邮箱验证流程

## 总结

SuperTokens 提供了强大的身份验证和授权功能。正确配置和使用 SuperTokens 可以大大简化用户管理流程，提高应用的安全性。在开发过程中，需要注意保持前后端配置的一致性，并根据实际需求调整各项设置。

## 代码备份(App.jsx)(前端)：

```
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
```
