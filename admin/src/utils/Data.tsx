/* eslint-disable @typescript-eslint/no-unused-vars */
import { MdOutlineDashboardCustomize, MdDashboard } from "react-icons/md";
import { FaUserAlt, FaUserCog, FaBuysellads } from "react-icons/fa";
import { AiFillFilePdf, AiFillSetting } from "react-icons/ai";
import { GiDwarfFace } from "react-icons/gi";
import { BiCategory } from "react-icons/bi";
import { FaChessBoard } from "react-icons/fa";
import { SlBadge } from "react-icons/sl";

export const sideBarLinks = [
  {
    title: "Dashboard",
    links: [
      {
        name: "dashboard",
        link: "dashboard",
        icon: <MdDashboard size={22} className=" text-[#bdcadf]" />,
      },
    ],
  },
  {
    title: "Lists",
    links: [
      {
        name: "avatars",
        link: "avatars",
        icon: <GiDwarfFace size={16} className=" text-[#bdcadf]" />,
      },
      // {
      //   name: "boards",
      //   link: "boards",
      //   icon: <GiDwarfFace size={16} className=" text-[#bdcadf]" />,
      // },
      {
        name: "Coin setting",
        link: "coins",
        icon: <FaChessBoard size={16} className=" text-[#bdcadf]" />,
      },
      {
        name: "Badges",
        link: "badges",
        icon: <SlBadge size={16} className=" text-[#bdcadf]" />,
      },
      {
        name: "users",
        link: "users",
        icon: <FaUserAlt size={16} className=" text-[#bdcadf]" />,
      },
    ],
  },
  {
    title: "User",
    links: [
      {
        name: "profile",
        link: "profile",
        icon: <FaUserCog size={20} className=" text-[#bdcadf]" />,
      },
    ],
  },
];

export const categoryButtons = [
  {
    name: "",
  },
];
