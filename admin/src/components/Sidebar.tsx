import React from "react";
import { sideBarLinks } from "../utils/Data";
import { NavLink, useNavigate } from "react-router-dom";
import { ImOffice } from "react-icons/im";
import { useAuth } from "../context/Auth";

interface Props {
  isOpen?: boolean;
  isSideBarOpen?: boolean;
}
const Sidebar: React.FC<Props> = ({ isOpen, isSideBarOpen }) => {
  const { logout } = useAuth();
    const navigate = useNavigate()
  const activeLink = `flex items-center ${
    !isSideBarOpen && "justify-center"
  } bg-main-bg 
   gap-3 text-white font-light p-2 rounded-sm ${isSideBarOpen && "m-2"}`;

  const normalLink = `flex items-center  duration-500 gap-3 ${
    isSideBarOpen ? "pl-2 " : "justify-center my-5"
  } py-2 rounded-lg text-[#96a0af] dark:text-gray-200 
  hover:text-main-color dark:hover:text-main-color   font-light m-2 `;

  return (
    <div className="flex flex-col items-start pt-4 w-full">
      <div className="flex flex-col w-full">
        {sideBarLinks.map((item) => (
          <div key={item.title}>
            <h1
              className={`font-medium duration-300 text-gray-300 ${
                isSideBarOpen ? "flex" : "hidden"
              } dark:text-gray-300 text-sm`}
            >
              {item.title}
            </h1>
            {item.links.map((link) => (
              <NavLink
                key={link.name}
                to={`/${link.link}`}
                // onClick={handleCloseSideBar}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                {link.icon}
                <span
                  className={`${
                    isSideBarOpen ? "flex" : "hidden"
                  } capitalize font-medium text-sm`}
                >
                  {link.name}
                </span>
              </NavLink>
            ))}
          </div>
        ))}
        <div onClick={logout} className={`${normalLink} cursor-pointer`}>
          <ImOffice />
          <span
            className={`${
              isSideBarOpen ? "flex" : "hidden"
            } capitalize font-medium text-sm`}
          >
            Log Out
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
