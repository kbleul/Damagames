import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/Auth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PulseLoader } from "react-spinners";
import SMSBox from "./components/SMSBox";

type USER = {
  id: string;
  username: string;
  phone: string;
  profile_image: "http://" | "https://";
};

const SeasonUsers = () => {
  const id = useParams().id;
  const { token, logout } = useAuth();

  const [showMsgBox, setShowMsgBox] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<USER[] | null>(null);

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const seasonUsersData = useQuery(
    [],
    async () =>
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}standings/${id}`, {
        headers,
      }),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!token,
      onSuccess: (res) => {
        const users = res?.data?.data?.users;
        const parsedUsers: USER[] = [];
        console.log(users);
        if (users && users.length > 0) {
          users.forEach((tempUser: any) => {
            const { id, username, phone, profile_image } = tempUser?.userData;
            parsedUsers.push({ id, username, phone, profile_image });
          });
          console.log(parsedUsers);
          parsedUsers.length > 0 && setUsers([...parsedUsers]);
        } else {
          setError("No users found");
        }
      },
      onError: (err: any) => {
        console.log(err, id);
        if (err?.response?.status === 401) {
          logout();
        } else {
          setError(err.message);
          setUsers(null);
        }
      },
    }
  );

  return (
    <main>
      {seasonUsersData.isLoading ? (
        <div className="flex items-center justify-center h-[40vh]">
          <PulseLoader color="#FF4C01" />
        </div>
      ) : (
        <article>
          {error ? (
            <div className="w-full h-[40vh] flex items-center justify-center text-red-400">
              <p>{error}</p>
            </div>
          ) : (
            <section>
              <h2 className="my-2 w-full text-center py-4 text-3xl font-semibold">
                Season Users
              </h2>

              <section className="w-full flex items-start justify-center grow">
                <div
                  className={
                    showMsgBox
                      ? "w-[70%] flex flex-col items-center justify-center"
                      : "w-[90%] flex flex-col items-center justify-center"
                  }
                >
                  {users?.map((user: USER) => (
                    <div
                      key={user.id}
                      className={
                        showMsgBox
                          ? "w-[90%] flex items-center justify-between border-b  py-2 text-lg"
                          : "w-[70%] flex items-center justify-between border-b  py-2 text-lg"
                      }
                    >
                      {user.profile_image ? (
                        <img
                          className="w-14 h-14 rounded-full"
                          src={user.profile_image}
                          alt=""
                        />
                      ) : (
                        <p className="w-14 h-14 rounded-full bg-gray-100"></p>
                      )}
                      <p>{user.username}</p>
                      <p>{user.phone}</p>
                    </div>
                  ))}
                  {users?.map((user: USER) => (
                    <div
                      key={user.id}
                      className={
                        showMsgBox
                          ? "w-[90%] flex items-center justify-between border-b  py-2 text-lg"
                          : "w-[70%] flex items-center justify-between border-b  py-2 text-lg"
                      }
                    >
                      {user.profile_image ? (
                        <img
                          className="w-14 h-14 rounded-full"
                          src={user.profile_image}
                          alt=""
                        />
                      ) : (
                        <p className="w-14 h-14 rounded-full bg-gray-100"></p>
                      )}
                      <p>{user.username}</p>
                      <p>{user.phone}</p>
                    </div>
                  ))}
                  {users?.map((user: USER) => (
                    <div
                      key={user.id}
                      className={
                        showMsgBox
                          ? "w-[90%] flex items-center justify-between border-b  py-2 text-lg"
                          : "w-[70%] flex items-center justify-between border-b  py-2 text-lg"
                      }
                    >
                      {user.profile_image ? (
                        <img
                          className="w-14 h-14 rounded-full"
                          src={user.profile_image}
                          alt=""
                        />
                      ) : (
                        <p className="w-14 h-14 rounded-full bg-gray-100"></p>
                      )}
                      <p>{user.username}</p>
                      <p>{user.phone}</p>
                    </div>
                  ))}
                  {users?.map((user: USER) => (
                    <div
                      key={user.id}
                      className={
                        showMsgBox
                          ? "w-[90%] flex items-center justify-between border-b  py-2 text-lg"
                          : "w-[70%] flex items-center justify-between border-b  py-2 text-lg"
                      }
                    >
                      {user.profile_image ? (
                        <img
                          className="w-14 h-14 rounded-full"
                          src={user.profile_image}
                          alt=""
                        />
                      ) : (
                        <p className="w-14 h-14 rounded-full bg-gray-100"></p>
                      )}
                      <p>{user.username}</p>
                      <p>{user.phone}</p>
                    </div>
                  ))}
                </div>

                <SMSBox showMsgBox={showMsgBox} setShowMsgBox={setShowMsgBox} />
              </section>
            </section>
          )}
        </article>
      )}
    </main>
  );
};

export default SeasonUsers;
