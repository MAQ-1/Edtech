import React, { useState, useEffect, useRef } from "react";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link, useLocation, matchPath } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useSelector } from "react-redux";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { BsSun, BsMoon } from "react-icons/bs";
import { categories } from "../../services/api";
import { apiConnector } from "../../services/apiconnector";
import { useThemeToggle } from "../../utils/themeToggle";
import ProfileDropdown from "../Core/Auth/ProfileDropDown";

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  const [subLinks, setSubLinks] = useState([]);
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const { getCurrentTheme, toggleTheme, initTheme } = useThemeToggle();
  const catalogRef = useRef(null);

  const fetchSublinks = async () => {
    try {
      const result = await apiConnector("GET", `${categories.CATEGORIES_API}?t=${Date.now()}`);
      console.log("Categories API Response:", result.data);
      setSubLinks(result.data.data || []);
    } catch (error) {
      console.log("Could not fetch the Catalog List", error);
      setSubLinks([]);
    }
  };

  useEffect(() => {
    fetchSublinks();
    initTheme();
    setCurrentTheme(getCurrentTheme());

    // Handle clicks outside the catalog dropdown
    const handleClickOutside = (event) => {
      if (catalogRef.current && !catalogRef.current.contains(event.target)) {
        setIsCatalogOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleThemeToggle = () => {
    const newTheme = toggleTheme();
    setCurrentTheme(newTheme);
  };

  const location = useLocation();
  const matchRoute = (route) => matchPath(route, location.pathname);
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 overflow-visible relative z-50 ${
      isAuthPage ? 'bg-richblack-800' : 'bg-richblack-900'
    }`}>
      <div className="w-11/12 max-w-maxContent flex flex-row items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={logo} width={160} height={60} loading="lazy" alt="Logo" />
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:block relative select-none">
          <ul className="flex gap-x-6 text-richblack-25 select-none">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div 
                    className="relative group" 
                    ref={catalogRef}
                    onMouseEnter={() => setIsCatalogOpen(true)}
                    onMouseLeave={() => setIsCatalogOpen(false)}
                  >
                    <div className="flex items-center gap-1 cursor-pointer select-none">
                      <p className="select-none">{link.title}</p>
                      <IoIosArrowDropdownCircle className="text-white" />
                    </div>

                    {/* Dropdown */}
                    <div 
                      className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 transition-all duration-300 z-[9999] ${
                        isCatalogOpen 
                          ? "opacity-100 visible" 
                          : "opacity-0 invisible"
                      }`}
                    >
                      {/* Triangle Arrow */}
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"></div>
                      
                      {/* Header */}
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-blue-700 mb-1">Browse Categories</h3>
                        <p className="text-sm  text-blue-700">Explore our course categories</p>
                      </div>
                      {/* Categories List */}
                      <div className="space-y-2  text-blue-700">
                        {subLinks && subLinks.length > 0 ? (
                          subLinks.map((subLink, idx) => (
                            <Link
                              key={idx}
                              to={`/catalog/${encodeURIComponent(subLink.name.toLowerCase().replace(/[\s\/]+/g, '-').replace(/[^a-z0-9-]/g, ''))}`}
                              className="flex items-center px-4 py-3 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 border-l-4 border-transparent hover:border-blue-500 group/item select-none"
                              onClick={() => setIsCatalogOpen(false)}
                            >
                              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover/item:bg-blue-600 transition-colors"></span>
                              <span className="font-medium">{subLink.name}</span>
                            </Link>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                              📚
                            </div>
                            <p className="text-sm">Loading categories...</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`select-none ${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link?.title}
                    </p>
                  </Link>
                )}

              </li>
            ))}
          </ul>
        </nav>

        {/* Right Side (Cart / Login / Signup / Profile) */}
        <div className="hidden items-center gap-x-4 md:flex">
          {/* Theme Toggle */}
          <button
            onClick={handleThemeToggle}
            className={`p-2 rounded-lg border transition-all duration-200 ${
              currentTheme === 'dark' 
                ? 'bg-richblack-800 border-richblack-700 text-richblack-100 hover:bg-richblack-700'
                : 'bg-richblack-5 border-richblack-200 text-richblack-800 hover:bg-richblack-25'
            }`}
            title={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {currentTheme === 'dark' ? <BsSun size={18} /> : <BsMoon size={18} />}
          </button>

          {/* Cart */}
          {user && user?.accountType !== "Instructor" && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {/* Login / Signup */}
          {token === null && (
            <>
              <Link to="/login">
                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                  Log in
                </button>
              </Link>
              <Link to="/signup">
                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                  Sign Up
                </button>
              </Link>
            </>
          )}

          {/* Profile Dropdown */}
          {token !== null && <ProfileDropdown />}

          {/* Mobile Menu */}
          <button className="mr-4 md:hidden">
            <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;