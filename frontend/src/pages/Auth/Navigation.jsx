import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{ zIndex: 9999 }}
      className={`${
        showSidebar ? "hidden" : "flex"
      } xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-white bg-[#0a0a0b] border-r border-[#1e1e22] w-[4%] hover:w-[15%] h-[100vh] fixed`}
      id="navigation-container"
    >
      <div className="flex flex-col justify-center space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-2 py-3 rounded-lg transition-all duration-200 hover:bg-pink-500/10 hover:text-pink-400 group"
        >
          <AiOutlineHome className="mt-[3rem] shrink-0" size={24} />
          <span className="hidden nav-item-name mt-[3rem] text-sm font-medium tracking-wide">HOME</span>
        </Link>

        <Link
          to="/shop"
          className="flex items-center gap-3 px-2 py-3 rounded-lg transition-all duration-200 hover:bg-pink-500/10 hover:text-pink-400"
        >
          <AiOutlineShopping className="mt-[3rem] shrink-0" size={24} />
          <span className="hidden nav-item-name mt-[3rem] text-sm font-medium tracking-wide">SHOP</span>
        </Link>

        <Link to="/cart" className="flex relative">
          <div className="flex items-center gap-3 px-2 py-3 rounded-lg transition-all duration-200 hover:bg-pink-500/10 hover:text-pink-400 w-full">
            <AiOutlineShoppingCart className="mt-[3rem] shrink-0" size={24} />
            <span className="hidden nav-item-name mt-[3rem] text-sm font-medium tracking-wide">CART</span>
          </div>

          <div className="absolute top-[3.1rem] left-[1.6rem]">
            {cartItems.length > 0 && (
              <span className="flex h-4 w-4 items-center justify-center text-[10px] font-bold text-white bg-pink-500 rounded-full ring-2 ring-[#0a0a0b]">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </div>
        </Link>

        <Link to="/favorite" className="flex relative">
          <div className="flex items-center gap-3 px-2 py-3 rounded-lg transition-all duration-200 hover:bg-pink-500/10 hover:text-pink-400 w-full">
            <FaHeart className="mt-[3rem] shrink-0" size={20} />
            <span className="hidden nav-item-name mt-[3rem] text-sm font-medium tracking-wide">
              FAVORITES
            </span>
            <FavoritesCount />
          </div>
        </Link>
      </div>

      <div className="relative pb-2">
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-2 w-full px-2 py-2 rounded-lg transition-all duration-200 hover:bg-white/5 focus:outline-none"
        >
          {userInfo ? (
            <>
              <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-xs font-bold text-white">
                {userInfo.username?.charAt(0).toUpperCase()}
              </div>
              <span className="hidden nav-item-name text-sm font-medium text-white truncate">
                {userInfo.username}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`hidden nav-item-name h-3 w-3 ml-auto shrink-0 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </>
          ) : (
            <></>
          )}
        </button>

        {dropdownOpen && userInfo && (
          <ul
            className={`absolute left-full ml-2 bottom-0 w-48 bg-[#18181b] border border-[#2a2a2e] rounded-xl shadow-2xl shadow-black/50 overflow-hidden`}
          >
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center px-4 py-2.5 text-sm text-gray-200 hover:bg-pink-500/10 hover:text-pink-400 transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/productlist"
                    className="flex items-center px-4 py-2.5 text-sm text-gray-200 hover:bg-pink-500/10 hover:text-pink-400 transition-colors"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/categorylist"
                    className="flex items-center px-4 py-2.5 text-sm text-gray-200 hover:bg-pink-500/10 hover:text-pink-400 transition-colors"
                  >
                    Category
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/orderlist"
                    className="flex items-center px-4 py-2.5 text-sm text-gray-200 hover:bg-pink-500/10 hover:text-pink-400 transition-colors"
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/userlist"
                    className="flex items-center px-4 py-2.5 text-sm text-gray-200 hover:bg-pink-500/10 hover:text-pink-400 transition-colors"
                  >
                    Users
                  </Link>
                </li>
                <li className="border-t border-[#2a2a2e]" />
              </>
            )}

            <li>
              <Link
                to="/profile"
                className="flex items-center px-4 py-2.5 text-sm text-gray-200 hover:bg-pink-500/10 hover:text-pink-400 transition-colors"
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={logoutHandler}
                className="flex items-center w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                Logout
              </button>
            </li>
          </ul>
        )}

        {!userInfo && (
          <ul className="space-y-1">
            <li>
              <Link
                to="/login"
                className="flex items-center gap-3 px-2 py-3 rounded-lg transition-all duration-200 hover:bg-pink-500/10 hover:text-pink-400"
              >
                <AiOutlineLogin className="shrink-0" size={24} />
                <span className="hidden nav-item-name text-sm font-medium tracking-wide">LOGIN</span>
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="flex items-center gap-3 px-2 py-3 rounded-lg transition-all duration-200 hover:bg-pink-500/10 hover:text-pink-400"
              >
                <AiOutlineUserAdd className="shrink-0" size={24} />
                <span className="hidden nav-item-name text-sm font-medium tracking-wide">REGISTER</span>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navigation;

