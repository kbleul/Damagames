import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../../context/Auth";
import { Tab } from "@headlessui/react";
import AvatarTable from "./components/AvaterTable";
import { PulseLoader } from "react-spinners";
import AddStoreItemsModal from "./components/AddStoreItemsModal";
import CrownTable from "./components/CrownTable";
import BoardTable from "./components/BoardTable";
import { useNavigate } from "react-router-dom";
interface AvatarProps {
  name: string;
  nickname: string;
  price: number;
  status: number;
  discount: number;
}
const Avatars = () => {
  let [categories] = useState(["Avatar", "Boards", "Crowns"]);
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [avatars, setAvatars] = useState<Array<AvatarProps>>([]);
  const [boards, setBoards] = useState<Array<AvatarProps>>([]);
  const [crowns, setCrowns] = useState<Array<AvatarProps>>([]);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  const storeData = useQuery(
    ["storeDataApi", isUpdated],
    async () =>
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}admin/store-items`, {
        headers,
      }),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!token,
      onSuccess: (res) => {
        setAvatars(
          res?.data?.data?.avatars?.map((data: any, index: number) => ({
            ...data,
            index: index + 1,
          }))
        );
        setBoards(
          res?.data?.data?.boards?.map((data: any, index: number) => ({
            ...data,
            index: index + 1,
          }))
        );
        setCrowns(
          res?.data?.data?.crowns?.map((data: any, index: number) => ({
            ...data,
            index: index + 1,
          }))
        );
      },
    }
  );
  function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
  }
  return (
    <div className="py-3 ">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {categories.map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel>
            <div className="flex flex-col items-start space-y-2 w-full">
              <div className="flex items-center justify-between pb-3 w-full">
                <h3 className="font-semibold text-lg">Avatars</h3>
                <button
                  onClick={() => navigate('/avater/create')}
                  className="bg-main-bg p-2 rounded-sm font-medium hover:opacity-80 text-white"
                >
                  Add Item
                </button>
              </div>

              {/*  */}
              {storeData.isFetched ? (
                <AvatarTable
                  avatars={avatars}
                  setIsUpdated={setIsUpdated}
                  setIsModalOpen={setIsModalOpen}
                  setEditId={setEditId}
                />
              ) : (
                <div className="flex items-center justify-center">
                  <PulseLoader color="#06b6d4" />
                </div>
              )}
            </div>
          </Tab.Panel>
          {/* boards */}
          <Tab.Panel>
            <div className="flex flex-col items-start space-y-2 w-full">
              <div className="flex items-center justify-between pb-3 w-full">
                <h3 className="font-semibold text-lg">Boards</h3>
                <button
                  onClick={() => navigate("/board/create")}
                  className="bg-main-bg p-2 rounded-sm font-medium hover:opacity-80 text-white"
                >
                  Add Board
                </button>
              </div>

              {/*  */}
              {storeData.isFetched ? (
                <BoardTable
                  avatars={boards}
                  setIsUpdated={setIsUpdated}
                  setIsModalOpen={setIsModalOpen}
                  setEditId={setEditId}
                />
              ) : (
                <div className="flex items-center justify-center">
                  <PulseLoader color="#06b6d4" />
                </div>
              )}
            </div>
          </Tab.Panel>
          {/* crouns */}
          <Tab.Panel>
            <div className="flex flex-col items-center space-y-2 w-full">
              <div className="flex items-center justify-between pb-3 w-full">
                <h3 className="font-semibold text-lg">Crowns</h3>
                <button
                  onClick={() => navigate('/pawn/create')}
                  className="bg-main-bg p-2 rounded-sm font-medium hover:opacity-80 text-white"
                >
                  Add Item
                </button>
              </div>

              {/*  */}
              {storeData.isFetched ? (
                <CrownTable
                  avatars={crowns}
                  setIsUpdated={setIsUpdated}
                  setIsModalOpen={setIsModalOpen}
                  setEditId={setEditId}
                />
              ) : (
                <div className="flex items-center justify-center">
                  <PulseLoader color="#FF4C01" />
                </div>
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      <AddStoreItemsModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setIsUpdated={setIsUpdated}
        editId={editId}
        setEditId={setEditId}
      />
    </div>
  );
};

export default Avatars;
