import { useState } from "react";
import { useAuth } from "../../context/Auth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PulseLoader } from "react-spinners";
import { RiGamepadFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import MonthlyReport from "./component/MonthlyReport";
import IntervalReport from "./component/IntervalReport";
import Users from "./component/Users";
const Dashboard = () => {
  const { token, logout } = useAuth();

  const [showReports, setShowReports] = useState(false);

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
      onError: (err: any) => {
        if (err?.response?.status === 401) {
          logout();
        }
      },
    }
  );

  return (
    <article className="mx-[5%] ">
      <section>
        <h2 className="text-2xl text-[#FF4C02] font-bold">Dashboard</h2>
        <p className="text-[#A0AEC0]">
          Welcome to Dama Admin Dashboard – Your Hub for the Game Insights and
          Management.
        </p>
      </section>

      <Users
        totalUsers={dashboardData?.data?.data?.data?.users}
        subscribedUsers={dashboardData?.data?.data?.data?.users_subscribed}
      />
    </article>
  );
};

export default Dashboard;
