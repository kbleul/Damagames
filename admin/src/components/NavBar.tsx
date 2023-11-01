import React from "react";
import { FaBars } from "react-icons/fa";
import { useAuth } from "../context/Auth";
interface ChildProps {
  setIsOpen: (isOpen: boolean) => void;
  isOpen?: boolean;
  isSideBarOpen?: boolean;
  isSmallScreen: boolean;
}

const NavBar: React.FC<ChildProps> = ({
  setIsOpen,
  isOpen,
  isSideBarOpen,
  isSmallScreen,
}) => {
  const { user } = useAuth();
  return (
    <div className=" w-full shadow-lg">
      <div className="flex items-center justify-between space-x-2 px-5 bg-white  w-full py-2 mb-6">
        <div>
          {!isSideBarOpen && isSmallScreen && (
            <FaBars onClick={() => setIsOpen(!isOpen)} />
          )}
        </div>

        <div className="flex items-start space-x-2 pr-10">
          <img
            src={
              user?.profileImageUrl
                ? user?.profileImageUrl
                : "https://t3.ftcdn.net/jpg/03/46/83/96/240_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
            }
            alt=""
            className="h-14 w-102 rounded-full object-cover"
          />
          {!isSmallScreen && (
            <div className="flex flex-col items-start justify-center  space-x-0 pt-2 ">
              <h1 className="font-bold text-dark-gray dark:text-white text-sm">
                {user?.username}
              </h1>
              <p className="font-bold text-[13px] text-gray-400 letter dark:text-white tracking-wider">
                {user?.phone}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
