import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { signOut } from "supertokens-auth-react/recipe/session";
import { redirectToAuth } from "supertokens-auth-react";
import Session from "supertokens-auth-react/recipe/session";
import emptyAvatar from "../assets/empty_avatar.jpg";
import FeatureVote from "./FeaturesVote";
import { FaLightbulb } from "react-icons/fa";

const Navbar = ({ token: initialToken }) => {
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [accessToken, setAccessToken] = useState(initialToken);

  const fetchUserInfo = useCallback(async () => {
    try {
      const userId = await Session.getUserId();
      // console.log("Fetching user info for userId:", userId);

      const response = await axios.get(
        `${import.meta.env.VITE_API_DOMAIN}/api/profile`,
        { params: { id: userId } }
      );
      //console.log("User profile response:", response.data);

      setAvatar(response.data.avatar || emptyAvatar);
      // console.log("Avatar set to:", response.data.avatar || emptyAvatar);

      setUserInfo({
        userId,
        email: response.data.email,
        name: `${response.data.preferredName || ""} ${
          response.data.lastName || ""
        }`.trim(),
        imgUrl: response.data.avatar || emptyAvatar,
      });
      // console.log("User info set:", userInfo);
    } catch (error) {
      console.error("Error fetching user info:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const initializeNavbar = useCallback(async () => {
    try {
      const sessionExists = await Session.doesSessionExist();
      // console.log("Session exists:", sessionExists);

      if (sessionExists) {
        const token = await Session.getAccessToken();
        //console.log("Access Token:", token);
        setAccessToken(token);
        await fetchUserInfo();
      } else {
        console.log("No active session");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error initializing Navbar:", error);
      setLoading(false);
    }
  }, [fetchUserInfo]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        menuRef.current.removeAttribute("open");
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        mobileMenuRef.current.removeAttribute("open");
      }
    };

    // 非常重要！！此处强制初始化navbar，避免了navbar在session存在但token为空时无法显示的问题（第三方用户新注册后）
    // tmd搞了两天，最后还是用最笨的方法解决了
    const attemptInitialization = async () => {
      if (initialToken) {
        await initializeNavbar();
      } else {
        // 如果没有初始 token，尝试获取一次
        await initializeNavbar();
        // 如果还是没有 token，就放弃
        if (!accessToken) {
          setLoading(false);
        }
      }
    };

    attemptInitialization();

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [initialToken, initializeNavbar]);

  async function onLogout() {
    await signOut();
    window.location.href = "/";
  }

  async function onLogin() {
    redirectToAuth();
  }

  async function onSignUp() {
    redirectToAuth({ show: "signup" });
  }

  if (loading) return null;

  return (
    <>
      {!loading && (
        <div className="bg-base-100 w-full flex justify-center">
          <div className="navbar max-w-6xl w-full px-4 sm:px-6 lg:px-8">
            {/* 左侧部分 - PhotoBuddy Logo 和 菜单项 */}
            <div className="flex items-center">
              <a className="btn btn-ghost text-xl" href="/">
                PhotoBuddies
              </a>

              {/* 中间部分 - 菜单项 */}
              <div className="hidden lg:flex md:flex ml-4 items-center">
                <ul className="menu menu-horizontal px-1 flex items-center">
                  <li>
                    <a
                      href="/about"
                      className="btn btn-sm btn-ghost hover:btn-primary text-sm mx-2 rounded-full transition-colors duration-200"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="/findmatches"
                      className="btn btn-sm btn-secondary hover:btn-ghost text-sm mx-2 rounded-full transition-colors duration-200"
                    >
                      Find Matches!
                    </a>
                  </li>
                  <li className="flex items-center">
                    {/* Suggest Feature 按钮 */}
                    <FeatureVote
                      userInfo={userInfo}
                      className="btn btn-sm btn-outline btn-accent rounded-full h-full flex items-center justify-center ml-4 transition-colors duration-200"
                      title="Suggest a feature!"
                    >
                      <FaLightbulb className="mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">
                        Suggest Anything!
                      </span>
                    </FeatureVote>
                  </li>
                </ul>
              </div>

              {/* 小屏幕下的下拉菜单 */}
              <div className="lg:hidden md:hidden ml-2 relative">
                <details className="dropdown" ref={mobileMenuRef}>
                  <summary className="btn btn-ghost p-1 focus:outline-none flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="inline-block w-8 h-8 stroke-current text-gray-700"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      ></path>
                    </svg>
                  </summary>
                  <ul className="dropdown-content bg-base-100 rounded-lg w-52 p-3 mt-2 shadow-lg absolute z-50 left-0">
                    <li className="mb-2">
                      <a
                        href="/about"
                        className="btn btn-xs btn-primary rounded-full w-full flex items-center justify-center"
                      >
                        About
                      </a>
                    </li>
                    <li className="mb-2">
                      <a
                        href="/findmatches"
                        className="btn btn-xs btn-secondary rounded-full w-full flex items-center justify-center"
                      >
                        Find Matches!
                      </a>
                    </li>
                    <li>
                      <FeatureVote
                        userInfo={userInfo}
                        className="btn btn-xs btn-outline btn-accent rounded-full w-full"
                        title="Suggest a feature!"
                      >
                        <FaLightbulb className="" />
                        Suggest a feature
                      </FeatureVote>
                    </li>
                  </ul>
                </details>
              </div>
            </div>

            {/* 右侧部分 - 登录/头像 */}
            <div className="flex-none flex items-center ml-auto">
              <ul className="menu menu-horizontal px-1">
                {accessToken ? (
                  <li className="flex items-center">
                    <details className="relative" ref={menuRef}>
                      <summary
                        className="flex items-center justify-center overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="flex items-center justify-center h-auto overflow-hidden"
                          onClick={() =>
                            (menuRef.current.open = !menuRef.current.open)
                          }
                        >
                          <img
                            className="w-8 h-8 md:w-10 md:h-10 object-cover rounded-full"
                            src={avatar || emptyAvatar}
                            alt="Avatar"
                          />
                        </button>
                      </summary>
                      <ul className="bg-base-100 rounded-t-none p-2 absolute right-0 top-12 z-50">
                        <li>
                          <a href="/profile">Profile</a>
                        </li>
                        {/* <li>
                          <a href="/portfolio">Portfolio</a>
                        </li> */}
                        {/* <li>
                          <a href="/portfolio">Favorites & Likes</a>
                        </li> */}
                        <li>
                          <a href="/usersettings">Settings</a>
                        </li>
                        <li>
                          <button onClick={onLogout}>Logout</button>
                        </li>
                      </ul>
                    </details>
                  </li>
                ) : (
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <button
                      onClick={onLogin}
                      className="btn btn-xs sm:btn-sm btn-outline btn-primary px-2 sm:px-4 rounded-full text-xs sm:text-sm font-medium h-8 sm:h-10 min-h-0 flex items-center justify-center"
                    >
                      Log in
                    </button>
                    <button
                      onClick={onSignUp}
                      className="btn btn-xs sm:btn-sm btn-primary px-2 sm:px-4 rounded-full text-xs sm:text-sm font-medium h-8 sm:h-10 min-h-0 flex items-center justify-center"
                    >
                      Sign up
                    </button>
                  </div>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
