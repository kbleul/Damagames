import React, { useState, useEffect } from "react";
import { Sidebar, NavBar } from "../components";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { GiGamepadCross } from "react-icons/gi";
import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Users, Avatars, CoinSetting } from "../pages";
import Boards from "../pages/store/Boards";
import CreateBoard from "../pages/store/CreateBoard";
interface Props {}
const AuthRoutes: React.FC<Props> = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  useEffect(() => {
    const hideMenu = () => {
      if (window.innerWidth > 900 && isSideBarOpen) {
        setIsSideBarOpen(false);
      }
      if (window.innerWidth < 900 && !isOpen) {
        setIsSmallScreen(true);
        setIsSideBarOpen(false);
        setIsOpen(true);
      }
      if (window.innerWidth > 900 && isOpen) {
        setIsOpen(false);
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", hideMenu);
    return () => {
      window.removeEventListener("resize", hideMenu);
    };
  });
  return (
    <div className="flex relative min-h-screen">
      <div
        className={`bg-stone-900  h-screen pt-5 duration-300
      ${isOpen ? "w-0 hidden" : isSideBarOpen ? "w-64" : "w-20"} p-5 fixed `}
      >
        <BsFillArrowLeftCircleFill
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          className={`text-main-color absolute duration-500 -right-3 top-9 text-3xl ${
            !isSideBarOpen && "rotate-180"
          }`}
        />
        <div className=" flex items-center space-x-2">
          <GiGamepadCross className="text-main-color text-4xl" />
          {isSideBarOpen && (
            <h1 className="origin-left text-white duration-500 font-bold text-xl">
              DamaGames
            </h1>
          )}
        </div>
        <Sidebar isOpen={isOpen} isSideBarOpen={isSideBarOpen} />
      </div>
      <div
        className={` duration-300  ${
          isOpen ? "ml-0" : isSideBarOpen ? "ml-64" : " ml-20"
        }  w-full  p-3  `}
      >
        <div className=" ">
          <NavBar
            setIsOpen={setIsOpen}
            isOpen={isOpen}
            isSmallScreen={isSmallScreen}
            isSideBarOpen={isSideBarOpen}
          />
          <Routes>
            <Route path="*" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/coins" element={<CoinSetting />} />
            {/* <Route path="/boards" element={<Boards />} /> */}
            <Route path="/board/create" element={<CreateBoard />} />
            <Route path="/board/create/:id" element={<CreateBoard />} />
            
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AuthRoutes;
