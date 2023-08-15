import React, { useState } from "react";
import { MdCancel } from "react-icons/md";
import { PulseLoader } from "react-spinners";

type SMSBoxProps = {
  showMsgBox: boolean;
  setShowMsgBox: React.Dispatch<React.SetStateAction<boolean>>;
};
const SMSBox = ({ showMsgBox, setShowMsgBox }: SMSBoxProps) => {
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMsg = () => {
    msg.length > 0 && setIsLoading(true);

    setTimeout(() => {
      if (msg.length > 0) {
        alert("Message sent successfully !");
        setMsg("");
        showMsgBox && setShowMsgBox(false);
        setIsLoading(false);
      }
    }, 3000);
  };
  return (
    <article className={showMsgBox ? "w-[30%]" : "w-[10%]"}>
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
            onClick={() => setShowMsgBox(false)}
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
            onClick={sendMsg}
          >
            {isLoading ? (
              <span className="px-8">
                <PulseLoader color="#FFF" />
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
