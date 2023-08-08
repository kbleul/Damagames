import React, { useState } from "react";
import { useAuth } from "../../../context/Auth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PulseLoader } from "react-spinners";
import BadgeTable from "../component/BadgeTable";
import { useNavigate } from "react-router-dom";

interface BadgeProps {
  id: string;
  name: object;
  description: object;
  badge_image: string;
  created_at: string;
  point: number;
}

const Badges = () => {
  const [badges, setBadges] = useState<Array<BadgeProps>>([]);
  const [error, setError] = useState<String | null>(null);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);

  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const badgesData = useQuery(
    ["badgesDataApi", true],
    async () =>
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}admin/badges`, {
        headers,
      }),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!token,
      onSuccess: (res) => {
        setBadges(res?.data?.data);
        res?.data?.data?.length === 0
          ? setError("No badges found.")
          : setError(null);
      },
      onError: (err: any) => {
        setBadges([]);
        if (err?.response?.status === 401) {
          logout();
          return;
        }

        setError(err.message);
      },
    }
  );

  return (
    <>
      {badgesData.isFetched ? (
        <main className="">
          <section>
            <h2>Badges</h2>
            <button
              onClick={() => navigate("/badge/create")}
              className="bg-main-bg p-2 rounded-sm font-medium hover:opacity-80 text-white"
            >
              Add Item
            </button>
          </section>

          {badges.length > 0 ? (
            <BadgeTable badges={badges} setIsUpdated={setIsUpdated} />
          ) : (
            <div className="w-full flex justify-center items-center">
              {error ? <p>{error}</p> : <PulseLoader color="#06b6d4" />}
            </div>
          )}
        </main>
      ) : (
        <div className="flex items-center justify-center">
          <PulseLoader color="#06b6d4" />
        </div>
      )}
    </>
  );
};

export default Badges;
