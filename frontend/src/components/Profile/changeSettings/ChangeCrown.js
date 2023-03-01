

import React, { useEffect } from 'react'
import axios from "axios";
import { useMutation, } from "@tanstack/react-query";

import { useAuth } from "../../../context/auth";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { AiFillStar } from "react-icons/ai";

import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';


const ChangeCrown = ({
    myCrowns,
    selected,
    selectedItem,
    setSelected,
    setSelectedItem,
    setErrorMessage,
    setChangeProfileModal }) => {

    useEffect(() => {
        setSelected(null)
        setSelectedItem([])
        setErrorMessage("")
    }, [])

    const navigate = useNavigate()
    const { login, token, user } = useAuth();

    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    //for items that are bought from store
    const crownSelectMutation = useMutation(
        async (newData) =>
            await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}select-crown/${selectedItem.id}`,
                newData,
                {
                    headers,
                }
            ),
        {
            retry: false,
        }
    );

    const crownSelectSubmitHandler = async (values) => {
        try {
            crownSelectMutation.mutate(
                {},
                {
                    onSuccess: (responseData) => {

                        login(token, { ...user, default_crown: selectedItem.img });
                        setChangeProfileModal(false);
                        toast("Default crown changed successfully");
                    },
                    onError: (err) => {
                        setErrorMessage(err?.response?.data?.data);
                    },
                }
            );
        } catch (err) { }
    };

    return (
        <div className="flex flex-col items-center space-y-2 w-full">
            <div className="grid grid-cols-3 gap-y-2 items-center space-x-3 just-fy-center">
                {myCrowns.map((crown, i) => (
                    < div
                        key={i === "0" ? "pl-3 relative" : "relative"}
                        className="relative"
                        onClick={() => {
                            if (!crown.price || parseInt(user.coin) >= crown.price) {
                                setSelected(i);
                                setSelectedItem({ id: crown.id, img: crown.item })
                            }

                        }}
                    >
                        {selected === i && (
                            <BsFillPatchCheckFill className="absolute bottom-2 right-2 text-orange-color" />
                        )}

                        {user.default_crown && !selected && crown.item === user.default_crown &&
                            <AiFillStar className="absolute bottom-2 right-2 text-orange-color" />
                        }

                        <img
                            src={crown.item}
                            alt=""
                            className={crown.price ? "h-20 w-20 object-cover opacity-4 0" : "h-20 w-20 object-cover"}
                        />


                    </div>
                ))}

            </div>

            {selected !== null && (
                <button
                    disabled={crownSelectMutation.isLoading}
                    onClick={crownSelectSubmitHandler}
                    className="rounded-md bg-orange-bg text-white font-medium w-[70%] p-2"
                >
                    {crownSelectMutation.isLoading ? "Loading..." : "Update"}
                </button>
            )
            }

            {myCrowns.length === 0 &&
                <div className='text-sm mt-4 flex flex-col justify-center items-center'>
                    <p className='text-white text-center'>Buy crowns from our store to change your preference !</p>
                    <button onClick={() => navigate("/store")}
                        className="mt-4 rounded-md bg-orange-bg text-black font-bold w-[40%] p-2"
                    > Store</button>
                </div>
            }


        </div >
    )
}

export default ChangeCrown