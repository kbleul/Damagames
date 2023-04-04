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
    <div className=" w-full">
      <div className="flex items-center justify-between space-x-2 p-5 bg-white  w-full">
        <div>
          {!isSideBarOpen && isSmallScreen && (
            <FaBars onClick={() => setIsOpen(!isOpen)} />
          )}
        </div>

        <div className="flex items-start space-x-2">
          {!isSmallScreen && (
            <div className="flex flex-col items-end space-x-0">
              <h1 className="font-medium text-dark-gray dark:text-white text-sm">
                {user?.username}
              </h1>
              <p className="font-normal text-[13px] text-dark-gray dark:text-white">
                {user?.phone}
              </p>
            </div>
          )}
          <img
            src={user?.profileImageUrl ? user?.profileImageUrl : "https://t3.ftcdn.net/jpg/03/46/83/96/240_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"}
            alt=""
            className="h-10 w-10 rounded-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
