import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState, useRef } from "react";
import { useAuth } from "../../../context/Auth";
import { PulseLoader } from "react-spinners";

interface Props {
  isEditCoinModalOpen: boolean;
  setIsEditCoinModalOpen: (isEditCoinModalOpen: boolean) => void;
}
const EditCoinForm = ({ setIsEditCoinModalOpen ,isEditCoinModalOpen}: Props) => {
  const { token } = useAuth();
  const [error, setError] = useState<string>("");
  const newUserCoinRef = useRef<HTMLInputElement>(null);
  const drawCoinRef = useRef<HTMLInputElement>(null);
  const lossCoinRef = useRef<HTMLInputElement>(null);
  const winnerCoinRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const coinsData = useQuery(
    ["editCoinsDataApi",isEditCoinModalOpen],
    async () =>
      await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}admin/coin-settings`,
        {
          headers,
        }
      ),
    {
      keepPreviousData: false,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!token,
      onSuccess: (res) => {},
    }
  );
  console.log(coinsData?.data?.data?.data);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editCoinSettingMutationHandler();
  };
  const editCoinMutation = useMutation(
    async (newData: any) =>
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}admin/coin-setting-update/${coinsData?.data?.data?.data?.id}`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );
  const editCoinSettingMutationHandler = async () => {
    try {
      let formData = new FormData();
      newUserCoinRef?.current?.value &&
        formData.append("newUserCoins", newUserCoinRef.current?.value);
      drawCoinRef?.current?.value &&
        formData.append("drawCoins", drawCoinRef.current?.value);
      lossCoinRef?.current?.value &&
        formData.append("looserCoins", lossCoinRef.current?.value);
      winnerCoinRef?.current?.value &&
        formData.append("winnerCoins", winnerCoinRef.current?.value);
      editCoinMutation.mutate(formData, {
        onSuccess: (responseData: any) => {
          console.log(responseData);
          setIsEditCoinModalOpen(false);
          setError("");
        },
        onError: (err: any) => {
          setError("Oops! Some error occurred.");
          console.log(err);
        },
      });
    } catch (err) {
      console.log(err);
      setError("Oops! Some error occurred.");
    }
  };
  return (
    <div className="w-full flex flex-col items-center justify-center">
      {coinsData.isFetched ? (
        <div className="w-full">
          <h1 className="font-medium">Add New Category</h1>
          <div className="w-full mt-2 flex flex-col items-center space-y-2">
            {error && (
              <div
                className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline font-medium">{error}</span>
                <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                  <svg
                    onClick={() => setError("")}
                    className="fill-current h-6 w-6 text-red-500"
                    role="button"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <title>Close</title>
                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                  </svg>
                </span>
              </div>
            )}
            <form
              action=""
              onSubmit={handleSubmit}
              className="w-full flex flex-col items-center space-y-2"
            >
              <input
                ref={newUserCoinRef}
                type="text"
                name=""
                id=""
                placeholder="new user coin"
                className="w-full p-2 rounded-sm border border-gray-300 focus:outline-none ring-0"
                required
                defaultValue={coinsData?.data?.data?.data?.newUserCoins}
              />
              <input
                ref={drawCoinRef}
                type="text"
                name=""
                id=""
                placeholder="draw game coin"
                className="w-full p-2 rounded-sm border border-gray-300 focus:outline-none ring-0"
                required
                defaultValue={coinsData?.data?.data?.data?.drawCoins}
              />
              <input
                ref={lossCoinRef}
                type="text"
                name=""
                id=""
                placeholder="loss game coin"
                className="w-full p-2 rounded-sm border border-gray-300 focus:outline-none ring-0"
                required
                defaultValue={coinsData?.data?.data?.data?.looserCoins}
              />
              <input
                ref={winnerCoinRef}
                type="text"
                name=""
                id=""
                placeholder="win game coin"
                className="w-full p-2 rounded-sm border border-gray-300 focus:outline-none ring-0"
                required
                defaultValue={coinsData?.data?.data?.data?.winnerCoins}
              />
              <button
                disabled={editCoinMutation.isLoading}
                type="submit"
                className=" rounded-sm  bg-main-bg p-3 text-[15px] font-normal text-white
               hover:bg-main-bg/70 disabled:hover:bg-main-bg  w-full flex items-center justify-center"
              >
                {editCoinMutation.isLoading ? (
                  <PulseLoader color="#fff" />
                ) : (
                  "Edit"
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <PulseLoader color="#FF4C01" />
        </div>
      )}
    </div>
  );
};

export default EditCoinForm;
