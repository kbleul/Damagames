import React, { useState, useEffect } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { useHome } from "../context/HomeContext";
import { RiErrorWarningFill } from "react-icons/ri";
const ToastContainer = () => {
    const [show, setShow] = useState(false);
    const { messageType, setMessageType } = useHome();
    useEffect(() => {
        if (messageType) {
            setShow(true);
        }

        setTimeout(() => {
            setShow(false);
            setMessageType(null);
        }, 8000);
    }, [messageType]);

    return (
        <>
            {show && (
                <div
                    className="transition duration-300 ease-in-out fixed border h-20 bottom-11 py-3 px-6  drop-shadow-2xl z-[1056]   h max-w-xs w-full right-10 bg-dark-bg rounded   text-sm  inline-flex items-center  "
                    role="alert"
                >
                    {messageType?.type === "SUCCESS" ? (
                        <>
                            <span className="text-green-500 text-bold text-3xl ">
                                <AiFillCheckCircle />
                            </span>
                            <div className="h-5/6 w-1 rounded-sm bg-green-500 mx-4"></div>
                            <div className="flex flex-col items-start text-left">
                                <h1 className="text-sm  text-green-500">{messageType?.type}</h1>
                                <p className="text-xs text-white">{messageType?.message}</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <span className="text-red-500 text-bold text-3xl ">
                                <RiErrorWarningFill />
                            </span>
                            <div className="h-5/6 w-1 rounded-sm bg-red-500 mx-4"></div>
                            <div className="flex flex-col items-start text-left">
                                <h1 className="text-sm  text-white">{messageType?.type}</h1>
                                <p className="text-xs text-white">{messageType?.message}</p>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default ToastContainer;