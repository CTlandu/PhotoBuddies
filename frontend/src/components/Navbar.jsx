import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { signOut } from "supertokens-auth-react/recipe/session";
import { redirectToAuth } from "supertokens-auth-react";
import Session from "supertokens-auth-react/recipe/session";
import emptyAvatar from "../assets/empty_avatar.jpg";

const Navbar = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const menuRef = useRef(null); // 头像部分的菜单
  const mobileMenuRef = useRef(null); // 小屏幕下的菜单

  // 页面刷新时，获取当前的token
  useEffect(() => {
    fetchToken();
  }, []);

  async function fetchToken() {
    const token = await getToken();
    setAccessToken(token);
    setLoading(false);
  }

  // 获取Token，若没有则返回null
  async function getToken() {
    try {
      // 并行获取 token 和 userId
      const [token, userId] = await Promise.all([
        Session.getAccessToken(),
        Session.getUserId()
      ]);

      // 通过 userId 获取用户资料
      const response = await axios.get(
        `${import.meta.env.VITE_API_DOMAIN}/api/profile`,
        {
          params: { id: userId },
        }
      );

      // 设置头像
      setAvatar(response.data.avatar);

      return token;
    } catch (error) {
      console.log(error);
    }
}

  // supertoken提供的logout方法（signOut)
  async function onLogout() {
    await signOut();
    window.location.href = "/";
  }

  // 点击登录按钮后，跳转到supertoken提供的login页面
  async function onLogin() {
    redirectToAuth();
  }

  /**
   * 点击菜单外时处理函数
   *
   * @param event 鼠标点击事件对象
   * @returns 无返回值
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        menuRef.current.removeAttribute("open");
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        mobileMenuRef.current.removeAttribute("open");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 若页面正在加载（还没获取到token），则返回null（空页面）
  if (loading) {
    return null;
  }

  return (
    <>
      <div className="navbar bg-base-100 mt-2 flex justify-between items-center">
        {/* 左侧部分 - PhotoBuddy Logo 和 菜单项 */}
        <div className="flex items-center ml-4 lg:ml-24">
          <a className="btn btn-ghost text-xl" href="/">
            PhotoBuddy
          </a>
  
          {/* 中间部分 - 菜单项 */}
          <div className="hidden lg:flex ml-4">
            <ul className="menu menu-horizontal px-1">
              <li>
                <a href="/about" className="btn btn-primary text-md mx-2">
                  About
                </a>
              </li>
              <li>
                <a href="/findmatches" className="btn btn-secondary text-md mx-2">
                  Find Matches!
                </a>
              </li>
            </ul>
          </div>
  
          {/* 小屏幕下的下拉菜单 */}
          <div className="lg:hidden ml-2 relative">
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
              <ul className="dropdown-content bg-dark-gray text-gray-800 rounded-lg w-44 p-3 mt-2 shadow-lg absolute z-50 left-0">
                <li className="hover:bg-green rounded-md">
                  <a href="/about" className="block px-4 py-2">
                    About
                  </a>
                </li>
                <li className="hover:bg-purple rounded-md">
                  <a href="/findmatches" className="block px-4 py-2">
                    Find Matches!
                  </a>
                </li>
              </ul>
            </details>
          </div>


        </div>
  
        {/* 右侧部分 - 登录/头像 */}
        <div className="flex-none mr-4 lg:mr-24">
          <ul className="menu menu-horizontal px-1">
            {accessToken ? (
              <li className="flex items-center">
                <details className="relative" ref={menuRef}>
                  <summary
                    className="flex items-center justify-center h-9 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="flex items-center justify-center h-7 overflow-hidden"
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
                  <ul className="bg-base-100 rounded-t-none p-2 absolute right-0 top-12">
                    <li>
                      <a href="/profile">Profile</a>
                    </li>
                    <li>
                      <button onClick={onLogout}>Logout</button>
                    </li>
                  </ul>
                </details>
              </li>
            ) : (
              <li>
                <button onClick={onLogin}>Login</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
  
  
};

export default Navbar;
