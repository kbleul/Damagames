import React from "react";
import { BsFillArrowRightSquareFill } from "react-icons/bs";
import { useAuth } from "../../context/Auth";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BiCategoryAlt } from "react-icons/bi";
import { BsFillPatchQuestionFill } from "react-icons/bs";
import axios from "axios";
import { PulseLoader } from "react-spinners";
import { AiFillFilePdf } from "react-icons/ai";
import { RiGamepadFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
const Dashboard = () => {
  const { token, user } = useAuth();
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  const dashboardData = useQuery(
    ["dashboardDataApi"],
    async () =>
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}admin/dashboard`, {
        headers,
      }),
    {
      keepPreviousData: false,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!token,
      onSuccess: (res) => {},
    }
  );
  console.log(dashboardData?.data?.data?.data);

  return (
    <>
      <div className="p-3 md:p-5">
        {dashboardData.isFetched ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="flex items-center justify-between p-5 bg-white  rounded-md shadow-md">
              <FaUser size={70} className="text-main-color" />
              <div className="flex flex-col items-center space-y-2">
                <p className="font-bold text-dark-color dark:text-white text-2xl">
                  {dashboardData?.data?.data?.data?.users}
                </p>
                <h1 className=" font-normal px-3 capitalize text-white bg-main-bg p-[2px] rounded-md text-sm">
                  Users
                </h1>
              </div>
            </div>
            {/* verified users */}
            <div className="flex items-center justify-between p-5 bg-white  rounded-md shadow-md">
              <FaUser size={70} className="text-main-color" />
              <div className="flex flex-col items-center space-y-2">
                <p className="font-bold text-dark-color dark:text-white text-2xl">
                  {dashboardData?.data?.data?.data?.users_subscribed}
                </p>
                <h1 className=" font-normal px-3 capitalize text-white bg-main-bg p-[2px] rounded-md text-sm">
                verified users
                </h1>
              </div>
            </div>
            {/* dayly played */}
            <div className="flex items-center justify-between p-5 bg-white  rounded-md shadow-md">
              <RiGamepadFill size={70} className="text-[#0891b2] " />
              <div className="flex flex-col items-center space-y-2">
                <p className="font-bold text-dark-color dark:text-white text-2xl">
                  {dashboardData?.data?.data?.data?.total_games}
                </p>
                <h1 className=" font-normal px-3 capitalize text-white bg-[#0891b2] p-[2px] rounded-md text-sm">
                  Total Games
                </h1>
              </div>
            </div>
            {/* weekly played */}
            <div className="flex items-center justify-between p-5 bg-white  rounded-md shadow-md">
              <RiGamepadFill size={70} className="text-[#10b981]" />
              <div className="flex flex-col items-center space-y-2">
                <p className="font-bold text-dark-color dark:text-white text-2xl">
                  {dashboardData?.data?.data?.data?.weekly_played}
                </p>
                <h1 className=" font-normal px-3 capitalize text-white bg-[#10b981] p-[2px] rounded-md text-sm">
                  weekly played
                </h1>
              </div>
            </div>
            {/* montly played */}
            <div className="flex items-center justify-between p-5 bg-white  rounded-md shadow-md">
              <RiGamepadFill size={70} className="text-[#333e4b]" />
              <div className="flex flex-col items-center space-y-2">
                <p className="font-bold text-dark-color dark:text-white text-2xl">
                  {dashboardData?.data?.data?.data?.monthly_played}
                </p>
                <h1 className=" font-normal px-3 capitalize text-white bg-[#333e4b] p-[2px] rounded-md text-sm">
                  Monthly Played
                </h1>
              </div>
            </div>
            {/* yearly played */}
            <div className="flex items-center justify-between p-5 bg-white  rounded-md shadow-md">
              <RiGamepadFill size={70} className="text-[#ffbc35]" />
              <div className="flex flex-col items-center space-y-2">
                <p className="font-bold text-dark-color dark:text-white text-2xl">
                  {dashboardData?.data?.data?.data?.yearly_played}
                </p>
                <h1 className=" font-normal px-3 capitalize text-white bg-[#ffbc35] p-[2px] rounded-md text-sm">
                  Yearly Played
                </h1>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <PulseLoader color="#FF4C01" />
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;