import React, { useEffect, useRef, useContext } from "react";
import { signOut } from "supertokens-auth-react/recipe/session";
import { redirectToAuth } from "supertokens-auth-react";
import emptyAvatar from "../assets/empty_avatar.jpg";
import FeatureVote from "./FeaturesVote";
import { FaLightbulb } from "react-icons/fa"; // 导入灯泡图标
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { accessToken, userInfo, loading } = useContext(AuthContext);

  const menuRef = useRef(null); // 头像部分的菜单
  const mobileMenuRef = useRef(null); // 小屏幕下的菜单

  // supertoken 提供的 logout 方法（signOut)
  const onLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  const onLogin = () => {
    redirectToAuth();
  };

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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 若页面正在加载（还没获取到 token），则返回 null（空页面）
  if (loading) {
    return null;
  }

  return (
    <>
      {!loading && (
        <div className="bg-base-100 w-full flex justify-center">
          <div className="navbar max-w-6xl w-full px-4 sm:px-6 lg:px-8">
            {/* 左侧部分 - PhotoBuddy Logo 和 菜单项 */}
            <div className="flex items-center">
              <a className="btn btn-ghost text-xl" href="/">
                PhotoBuddy
              </a>

              {/* 中间部分 - 菜单项 */}
              <div className="hidden lg:flex md:flex ml-4 items-center">
                <ul className="menu menu-horizontal px-1 flex items-center">
                  <li>
                    <a href="/about" className="btn btn-primary text-md mx-2">
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="/findmatches"
                      className="btn btn-secondary text-md mx-2"
                    >
                      Find Matches!
                    </a>
                  </li>
                  <li className="flex items-center">
                    {/* Suggest Feature 按钮 */}
                    <FeatureVote
                      userInfo={userInfo}
                      className="btn btn-sm btn-outline btn-accent rounded-full h-full flex items-center justify-center ml-4"
                      title="Suggest a feature!"
                    >
                      <FaLightbulb className="mr-2" />
                      Suggest Anything!
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
                        className="btn btn-sm btn-primary rounded-full w-full flex items-center justify-center"
                      >
                        About
                      </a>
                    </li>
                    <li className="mb-2">
                      <a
                        href="/findmatches"
                        className="btn btn-sm btn-secondary rounded-full w-full flex items-center justify-center"
                      >
                        Find Matches!
                      </a>
                    </li>
                    <li>
                      <FeatureVote
                        userInfo={userInfo}
                        className="btn btn-sm btn-outline btn-accent rounded-full w-full"
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
                {accessToken && userInfo ? (
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
                            src={userInfo.imgUrl || emptyAvatar}
                            alt="Avatar"
                          />
                        </button>
                      </summary>
                      <ul className="bg-base-100 rounded-t-none p-2 absolute right-0 top-12 z-50">
                        <li>
                          <a href="/profile">Profile</a>
                        </li>
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
                  <li>
                    <button onClick={onLogin}>Log in/Sign up</button>
                  </li>
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
