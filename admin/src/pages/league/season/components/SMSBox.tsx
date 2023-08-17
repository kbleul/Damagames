import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { MdCancel } from "react-icons/md";
import { PulseLoader } from "react-spinners";
import { useAuth } from "../../../../context/Auth";

type SMSBoxProps = {
  showMsgBox: boolean;
  setShowMsgBox: React.Dispatch<React.SetStateAction<boolean>>;
  seasonId?: string;
};
const SMSBox = ({ showMsgBox, setShowMsgBox, seasonId }: SMSBoxProps) => {
  const { token } = useAuth();

  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const sendNotificationMutation = useMutation(
    async (newData: any) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}admin/send-season-notification-sms`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );
  const sendNotificationHandler = async () => {
    setIsLoading(true);
    try {
      sendNotificationMutation.mutate(
        {
          season_id: seasonId,
          message: msg,
        },
        {
          onSuccess: (responseData: any) => {
            setIsLoading(false);
            setMsg("");
            setShowMsgBox(false);
<<<<<<< HEAD
            alert("Message sent successfully");
=======
            alert("Messages sent successfully");
>>>>>>> d08f5c65a1c755b5fc938da81e044563514e7351
          },
          onError: (err: any) => {
            console.log(err?.message);
            alert(err?.message);
            setIsLoading(false);
          },
        }
      );
    } catch (err: any) {
      console.log(err);
      alert(err?.message);
      setIsLoading(false);
    }
  };

  return (
    <article className={showMsgBox ? "w-[30%]" : "w-[12.5%]"}>
      {!showMsgBox ? (
        <section className="flex justify-center w-full">
          <button
            className="bg-orange-600 rounded-md hover:opacity-80 text-center px-8 p-3 mt-6  font-medium text-white"
            onClick={() => setShowMsgBox(true)}
          >
            Send SMS
          </button>
        </section>
      ) : (
        <section className=" flex flex-col items-center justify-center py-8 relative">
          <MdCancel
            onClick={() => {
              setIsLoading(false);
              setMsg("");
              setShowMsgBox(false);
            }}
            className="w-8 h-8 absolute top-0 right-0 mb-2 text-gray-300 hover:text-black"
          />
          <textarea
            rows={7}
            value={msg}
            placeholder="Message"
            onChange={(e) => {
              if (e.target.value.length < 161) setMsg(e.target.value);
              else {
                if (e.target.value.length > 160) {
                  let text = e.target.value;
                  text = text.slice(0, 160);
                  setMsg(text);
                }
              }
            }}
            className="w-full border border-gray-300 px-4 py-2 mt-4 text-lg leading-8"
          />
          <section className="flex justify-between w-full">
            <p className="px-2 text-gray-400">
              <span className="text-black">{msg.length}</span>/160
            </p>
            {msg.length > 159 && (
              <p className="text-red-400 px-2 text-sm font-semibold">
                Maximum length reached !
              </p>
            )}
          </section>
          <button
            disabled={msg.length === 0 || msg.length > 160}
            className={
              msg.length === 0 || msg.length > 160
                ? "bg-orange-600 opacity-80 rounded-full  text-center px-5 p-3 mt-5  font-medium text-white"
                : "bg-orange-600 rounded-full hover:opacity-80 text-center px-5 p-3 mt-5  font-medium text-white"
            }
            onClick={sendNotificationHandler}
          >
            {isLoading ? (
              <span className="px-20">
                <PulseLoader size={10} color="#FFF" />
              </span>
            ) : (
              "Send SMS Notification"
            )}
          </button>
        </section>
      )}
    </article>
  );
};

export default SMSBox;
