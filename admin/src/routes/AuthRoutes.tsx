import React, { useState, useEffect } from "react";
import { Sidebar, NavBar } from "../components";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { GiGamepadCross } from "react-icons/gi";
import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Users, Avatars, CoinSetting } from "../pages";
import Boards from "../pages/store/Boards";
import CreateBoard from "../pages/store/CreateBoard";
import CreatePawn from "../pages/store/CreatePawn";
import CreateAvater from "../pages/store/CreateAvater";
import EditAvater from "../pages/store/EditAvater";
import Badges from "../pages/badges/Pages/Badges";
import CreateBadge from "../pages/badges/Pages/CreateBadge";
import EditBadge from "../pages/badges/Pages/EditBadge";
import League from "../pages/league/League";
import LeagueCreate from "../pages/league/LeagueCreate";
import EditLeague from "../pages/league/EditLeague";
import Season from "../pages/league/season/season";
import CreateSeason from "../pages/league/season/createSeason";
import EditSeason from "../pages/league/season/EditSeason";
import CreateAwards from "../pages/league/awards/CreateAwards";
import Awards from "../pages/league/awards/Awards";
import EditAward from "../pages/league/awards/EditAward";
import SeasonUsers from "../pages/league/season/seasonUsers";

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
            <Route path="/badges" element={<Badges />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/coins" element={<CoinSetting />} />
            <Route path="/badge/create" element={<CreateBadge />} />
            <Route path="/badge/edit/:id" element={<EditBadge />} />
            <Route path="/avater/create" element={<CreateAvater />} />
            <Route path="/avater/edit/:id" element={<EditAvater />} />
            <Route path="/board/create" element={<CreateBoard />} />
            <Route path="/board/create/:id" element={<CreateBoard />} />
            <Route path="/pawn/create" element={<CreatePawn />} />
            <Route path="/pawn/create/:id" element={<CreatePawn />} />

            <Route path="/league" element={<League />} />
            <Route path="/league/create" element={<LeagueCreate />} />
            <Route path="/league/edit/:id" element={<EditLeague />} />

            <Route path="/season/:id" element={<Season />} />
            <Route path="/season/create" element={<CreateSeason />} />
            <Route path="/season/edit" element={<EditSeason />} />

            <Route path="/awards/:id" element={<Awards />} />
            <Route path="/awards/create/:id" element={<CreateAwards />} />
            <Route path="/awards/edit/:id" element={<EditAward />} />

            <Route path="/season-users/:id" element={<SeasonUsers />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AuthRoutes;
