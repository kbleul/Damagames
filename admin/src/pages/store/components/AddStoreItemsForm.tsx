import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState, useRef } from "react";
import { useAuth } from "../../../context/Auth";
import { PulseLoader } from "react-spinners";
interface Props {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  editId: string | null;
  setEditId: React.Dispatch<React.SetStateAction<string | null>>;
}
const AddStoreItemsForm = ({
  setIsModalOpen,
  isModalOpen,
  setIsUpdated,
  editId,
  setEditId,
}: Props) => {
  const { token } = useAuth();
  const [error, setError] = useState<string>("");
  const nameRef = useRef<HTMLInputElement>(null);
  const nickNameRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);
  const headers = {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      editStoreItemMutationHandler();
    } else {
      createStoreItemMutationHandler();
    }
  };
  const createStoreItemMutation = useMutation(
    async (newData: any) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}admin/create-store-items`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );
  const createStoreItemMutationHandler = async () => {
    try {
      let formData = new FormData();
      nameRef.current?.value && formData.append("name", nameRef.current?.value);
      nickNameRef.current?.value &&
        formData.append("nickname", nickNameRef.current?.value);
      priceRef.current?.value &&
        formData.append("price", priceRef.current?.value);
      typeRef.current?.value && formData.append("type", typeRef.current?.value);
      fileRef?.current?.files &&
        formData.append("item", fileRef?.current?.files[0]);
      createStoreItemMutation.mutate(formData, {
        onSuccess: (responseData: any) => {
          setIsUpdated((prev) => !prev);
          setIsModalOpen(false);
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

  //edit
  const editStoreItemMutation = useMutation(
    async (newData: any) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}admin/update-store-item/${editId}`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );
  const editStoreItemMutationHandler = async () => {
    try {
      let formData = new FormData();
      nameRef.current?.value && formData.append("name", nameRef.current?.value);
      nickNameRef.current?.value &&
        formData.append("nickname", nickNameRef.current?.value);
      priceRef.current?.value &&
        formData.append("price", priceRef.current?.value);
      typeRef.current?.value && formData.append("type", typeRef.current?.value);
      fileRef?.current?.files &&
        formData.append("item", storeData?.data?.data?.data?.item ? storeData?.data?.data?.data?.item : fileRef?.current?.files[0]);
      editStoreItemMutation.mutate(formData, {
        onSuccess: (responseData: any) => {
          setIsUpdated((prev) => !prev);
          setEditId(null)
          setIsModalOpen(false);
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


  //fetch if id is there
  const storeData = useQuery(
    ["singlestoreDataApi", editId],
    async () =>
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}admin/store-item-show/${editId}`, {
        headers,
      }),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!token,
      onSuccess: (res) => {
        
      }}
      );
      console.log(storeData?.data?.data?.data);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <h1 className="font-medium">
        {editId ? "Edit Avatar" : "Add New Category"}
      </h1>
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
            ref={nameRef}
            type="text"
            name=""
            id=""
            placeholder="Name"
            className="w-full p-2 rounded-sm border border-gray-300 focus:outline-none ring-0"
            defaultValue={editId ? storeData?.data?.data?.data?.name : ""}
            required
          />
          <input
            ref={nickNameRef}
            type="text"
            name=""
            id=""
            placeholder="Nick Name"
            className="w-full p-2 rounded-sm border border-gray-300 focus:outline-none ring-0"
            required
            defaultValue={editId ? storeData?.data?.data?.data?.nickname : ""}
          />
          <input
            ref={priceRef}
            type="number"
            name=""
            id=""
            placeholder="Price"
            className="w-full p-2 rounded-sm border border-gray-300 focus:outline-none ring-0"
            required
            defaultValue={editId ? storeData?.data?.data?.data?.price : ""}
          />
          <select
            name=""
            id=""
            className="w-full p-2 rounded-sm border border-gray-300 focus:outline-none ring-0"
            ref={typeRef}
            required
            defaultValue={editId ? storeData?.data?.data?.data?.type : ""}
          >
            <option value="Avatar">Avatar</option>
            <option value="Crown">Crown</option>
            <option value="Board">Board</option>
          </select>
          <input
            ref={fileRef}
            type="file"
            name=""
            accept="image/*"
            className="w-full p-2 rounded-sm border border-gray-300 focus:outline-none ring-0"
            required={editId ? false : true}
    
          />

          <button
            disabled={
              createStoreItemMutation.isLoading ||
              editStoreItemMutation.isLoading
            }
            type="submit"
            className=" rounded-sm  bg-main-bg p-3 text-[15px] font-normal text-white
                     hover:bg-main-bg/70 disabled:hover:bg-main-bg  w-full flex items-center justify-center"
          >
            {createStoreItemMutation.isLoading ||
            editStoreItemMutation.isLoading ? (
              <PulseLoader color="#fff" />
            ) : editId ? (
              "Edit"
            ) : (
              "Create"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStoreItemsForm;