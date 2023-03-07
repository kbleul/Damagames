import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import { useAuth } from "../../context/auth";

import { useQuery } from "@tanstack/react-query";
import { Circles } from "react-loader-spinner";

import axios from "axios";

import { FaChevronCircleUp } from "react-icons/fa";
import { FaChevronCircleDown } from "react-icons/fa";
import { RiLock2Fill } from "react-icons/ri";
import { ImUnlocked } from "react-icons/im";

import StoreItemView from "./StoreItemViewModal";
import LoginPromptModal from "./LoginPromptModal";

const Store = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [storeItems, setStoreItems] = useState({});
  const [itemIsLoading, setItemIsLoading] = useState(true);
  const [itemsError, setitemsError] = useState(false);

  const [isOn, setIsOn] = useState(false);
  const [ShowLoginModal, setShowLoginModal] = useState(false);

  const [showAvatars, setShowAvatars] = useState(false);
  const [showBoard, setShowBoard] = useState(false);
  const [showCrown, setShowCrown] = useState(false);
  const [isShowModalOpen, set_isShowModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [myAvatarsId, setMyAvatarsId] = useState([]);
  const [myBoardsId, setMyBoardsId] = useState([]);
  const [myCrownsId, setMyCrownsId] = useState([]);

  let [categories] = useState(["Avatar", "Boards", "Crowns"]);
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const header = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const myItemsFetch = useQuery(
    ["myItemsFetch"],
    async () =>
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}my-items`, {
        headers: header,
      }),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: token ? !itemIsLoading : false,
      onSuccess: (res) => {
        //  console.log(res.data.data.avatars[0])
        for (const [, value] of Object.entries(res.data.data.avatars)) {
          setMyAvatarsId((prev) => [...prev, value.id]);
        }
        for (const [, value] of Object.entries(res.data.data.boards)) {
          setMyBoardsId((prev) => [...prev, value.id]);
        }
        for (const [, value] of Object.entries(res.data.data.crowns)) {
          setMyCrownsId((prev) => [...prev, value.id]);
        }
        // setStoreItems(res.data.data)
        // setItemIsLoading(false)
        // myItemsMutationSubmitHandler()
      },
      onError: (err) => {
        console.log(err);

        // setItemIsLoading(false)
        // setitemsError(true)
      },
    }
  );

  const storeItemsFetch = useQuery(
    ["storeItemsFetch"],
    async () =>
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}store-items`, {
        headers,
      }),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      retry: false,
      //   enabled: !!token,
      onSuccess: (res) => {
        setStoreItems(res.data.data);
        setItemIsLoading(false);
      },
      onError: (err) => {
        setItemIsLoading(false);
        setitemsError(true);
      },
    }
  );

  return (
    // <main className={itemIsLoading ? "md:h-[100vh] flex justify-center items-center" : " text-white flex flex-col md:grid md:grid-cols-3  md:h-[100vh] "}>
    //     <button
    //         className={isOn || itemIsLoading ? "hidden" : "z-10 bg-orange-color rounded-full w-8 h-8 flex justify-center items-center mr-2 mt-2 fixed left-2 md:left-4"}
    //         onClick={() => navigate("/create-game")}
    //     >
    //         <svg
    //             width="18"
    //             height="14"
    //             viewBox="0 0 18 14"
    //             fill="none"
    //             xmlns="http://www.w3.org/2000/svg"
    //         >
    //             <path
    //                 fill-rule="evenodd"
    //                 clip-rule="evenodd"
    //                 d="M0.396166 0.973833C0.500244 0.722555 0.676505 0.507786 0.902656 0.356693C1.12881 0.205599 1.39469 0.124969 1.66667 0.125H10.8333C12.6567
    //                 0.125 14.4054 0.849328 15.6947 2.13864C16.984 3.42795 17.7083 5.17664 17.7083 7C17.7083 8.82336 16.984 10.572 15.6947 11.8614C14.4054 13.1507
    //                  12.6567 13.875 10.8333 13.875H2.58333C2.21866 13.875 1.86892 13.7301 1.61106 13.4723C1.3532 13.2144 1.20833 12.8647 1.20833 12.5C1.20833 12.1353
    //                   1.3532 11.7856 1.61106 11.5277C1.86892 11.2699 2.21866 11.125 2.58333 11.125H10.8333C11.9274 11.125 12.9766 10.6904 13.7501 9.91682C14.5237 9.14323
    //                   14.9583 8.09402 14.9583 7C14.9583 5.90598 14.5237 4.85677 13.7501 4.08318C12.9766 3.3096 11.9274 2.875 10.8333 2.875H4.98592L5.84758 3.73667C6.09793
    //                   3.99611 6.23636 4.34351 6.23306 4.70403C6.22976 5.06455 6.08499 5.40935 5.82993 5.66417C5.57487 5.91898 5.22994 6.06343 4.86941 6.06639C4.50889 6.06935
    //                   4.16163 5.93059 3.90242 5.68L0.694083 2.47167C0.501936 2.27941 0.371084 2.03451 0.318058 1.76791C0.265033 1.50132 0.292214 1.22499 0.396166 0.973833Z"
    //                 fill="#191921"
    //             />
    //         </svg>
    //     </button>

    //     {
    //         !itemIsLoading && <>
    //             <div>
    //                 <article className={(isOn && showAvatars) ? "h-[89vh] overflow-y-scroll scrollbar-hide  md:mt-[5vh] mb-2" : isOn ? "hidden" : "h-[45vh] md:h-[93vh] pt-1 overflow-y-hidden md:overflow-y-scroll scrollbar-hide md:mt-[3vh]"}>
    //                     <h2 className="md:text-xl py-1  text-white font-bold text-sm w-[90%] ml-[5%] text-center pb-1">Avatar</h2>
    //                     <section>
    //                         {storeItems.avatars?.map(avatar => <Avatar id={avatar.id} avatar={avatar} set_isShowModalOpen={set_isShowModalOpen} setSelectedItem={setSelectedItem} setShowLoginModal={setShowLoginModal} myAvatarsId={myAvatarsId} />)}
    //                     </section>
    //                 </article>
    //                 {!isOn && <FaChevronCircleDown className={(isOn && !showAvatars) ? "hidden" : "md:hidden w-1/5 ml-[40%] h-[3vh]  text-orange-color"} onClick={() => { setIsOn(prev => !prev); setShowAvatars(prev => !prev) }} />}
    //                 {showAvatars && <FaChevronCircleUp className="w-1/5 ml-[40%] h-[5vh] text-orange-color" onClick={() => { setIsOn(false); setShowCrown(false); setShowAvatars(false); setShowBoard(false) }} />}
    //             </div>
    //             <div>
    //                 <article className={(isOn && showBoard) ? "h-[89vh]  overflow-y-scroll scrollbar-hide  md:mt-[3vh]" : isOn ? "hidden" : "h-[20vh] md:h-[91vh] overflow-y-hidden md:overflow-y-scroll scrollbar-hide md:mt-[5vh]"}>
    //                     <h2 className="md:text-xl py-1 font-bold text-sm  w-[90%] ml-[5%] text-center pb-1">Boards</h2>
    //                     <section style={{
    //                         background: `linear-gradient(120deg, rgb(39, 138, 134) 1%, rgba(11, 42, 43, 0.32) 10%, rgb(22, 85, 82) 98%) repeat scroll 0% 0%`,
    //                     }} className={(isOn && showBoard) ? "grid grid-cols-2 w-[90%] ml-[5%] border rounded-lg" : "grid grid-cols-2 w-[90%] ml-[5%] border rounded-lg max-h-[15vh] md:max-h-fit overflow-hidden"}>
    //                         {storeItems.boards?.map(board => <Board id={board.id} board={board} isOn={isOn} set_isShowModalOpen={set_isShowModalOpen} setSelectedItem={setSelectedItem} setShowLoginModal={setShowLoginModal} myBoardsId={myBoardsId} />)}

    //                     </section>
    //                 </article>
    //                 {!isOn && <FaChevronCircleDown className={(isOn && !showBoard) ? "hidden" : "md:hidden w-1/5 ml-[40%] h-[3vh]  text-orange-color"} onClick={() => { setIsOn(prev => !prev); setShowBoard(prev => !prev) }} />}
    //                 {showBoard && <FaChevronCircleUp className="w-1/5 ml-[40%] h-[5vh] text-orange-color mt-2" onClick={() => { setIsOn(false); setShowCrown(false); setShowAvatars(false); setShowBoard(false) }} />}
    //             </div>

    //             <div>
    //                 <article className={(isOn && showCrown) ? "h-[89vh]  overflow-y-scroll scrollbar-hide  md:mt-[5vh]" : isOn ? "hidden" : "h-[25vh] md:h-[91vh] overflow-y-hidden scrollbar-hide md:mt-[5vh]"}>
    //                     <h2 className="md:text-xl pt-1 font-bold text-sm  w-[90%] ml-[5%] text-center pb-1">Crowns</h2>
    //                     <section style={{
    //                         background: `linear-gradient(120deg, rgb(39, 138, 134) 1%, rgba(11, 42, 43, 0.32) 10%, rgb(22, 85, 82) 98%) repeat scroll 0% 0%`,
    //                     }} className={(isOn && showCrown) ? "grid grid-cols-3 w-[90%] ml-[4%] border rounded-lg  overflow-scroll scrollbar-hide" : "grid grid-cols-3 w-[90%] ml-[5%] border rounded-lg max-h-[20vh] md:max-h-fit overflow-scroll scrollbar-hide"}>
    //                         {storeItems?.crowns?.map(crown => (<Crown id={crown.id} crown={crown} set_isShowModalOpen={set_isShowModalOpen} setSelectedItem={setSelectedItem} setShowLoginModal={setShowLoginModal} isOn={isOn} myCrownsId={myCrownsId} />))}

    //                     </section>
    //                 </article>
    //                 {!isOn && <FaChevronCircleDown className={(isOn && !showCrown) ? "hidden" : "md:hidden w-1/5 ml-[40%] h-[3vh] text-orange-color"} onClick={() => { setIsOn(prev => !prev); setShowCrown(prev => !prev) }} />}
    //                 {showCrown && <FaChevronCircleUp className="w-1/5 ml-[40%] h-[5vh] text-orange-color mt-4" onClick={() => { setIsOn(false); setShowCrown(false); setShowAvatars(false); setShowBoard(false) }} />}
    //             </div>
    //         </>

    //     }

    //     <StoreItemView isShowModalOpen={isShowModalOpen} set_isShowModalOpen={set_isShowModalOpen}
    //         item={selectedItem} myAvatarsId={myAvatarsId} myBoardsId={myBoardsId} myCrownsId={myCrownsId} />
    //     <LoginPromptModal isShowModalOpen={ShowLoginModal} set_isShowModalOpen={setShowLoginModal} />

    //     {itemIsLoading && <div className="text-white flex items-center justify-center min-h-screen">
    //         <Circles
    //             height="60"
    //             width="90"
    //             radius="9"
    //             color="#FF4C01"
    //             ariaLabel="three-dots-loading"
    //             wrapperStyle={{}}
    //             wrapperClassName=""
    //             visible={true}
    //         />
    //     </div>}

    // </main>
    <div className="relative flex w-full  min-h-screen">
      <div className="sticky top-0 w-full max-w-2xl mx-auto flex flex-col items-center justify-center px-2 py-16 sm:px-0 h-full">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-orange-bg/20 p-1 w-full">
            {categories.map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  classNames(
                    "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-white",
                    "ring-white ring-opacity-60 ring-offset-2 ring-offset-orange-bg focus:outline-none focus:ring-2",
                    selected
                      ? "bg-orange-bg shadow"
                      : "text-blue-100 hover:bg-orange-bg/[0.12] hover:text-white"
                  )
                }
              >
                {category}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-2  ">
            <Tab.Panel>
              {!itemIsLoading ? (
                storeItems.avatars?.map((avatar) => (
                  <Avatar
                    id={avatar.id}
                    avatar={avatar}
                    set_isShowModalOpen={set_isShowModalOpen}
                    setSelectedItem={setSelectedItem}
                    setShowLoginModal={setShowLoginModal}
                    myAvatarsId={myAvatarsId}
                  />
                ))
              ) : (
                <div className="text-white flex items-center justify-center min-h-screen">
                  <Circles
                    height="60"
                    width="90"
                    radius="9"
                    color="#FF4C01"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClassName=""
                    visible={true}
                  />
                </div>
              )}
            </Tab.Panel>
            {/* bord */}
            <Tab.Panel>
              {!itemIsLoading ? (
                <section
                  style={{
                    background: `linear-gradient(120deg, rgb(39, 138, 134) 1%, rgba(11, 42, 43, 0.32) 10%, rgb(22, 85, 82) 98%) repeat scroll 0% 0%`,
                  }}
                  className={
                    isOn && showBoard
                      ? "grid grid-cols-2 w-[90%] ml-[5%] border rounded-lg"
                      : "grid grid-cols-2 w-[90%] ml-[5%] border rounded-lg max-h-[15vh] md:max-h-fit"
                  }
                >
                  {storeItems.boards?.map((board) => (
                    <Board
                      id={board.id}
                      board={board}
                      isOn={isOn}
                      set_isShowModalOpen={set_isShowModalOpen}
                      setSelectedItem={setSelectedItem}
                      setShowLoginModal={setShowLoginModal}
                      myBoardsId={myBoardsId}
                    />
                  ))}
                </section>
              ) : (
                <div className="text-white flex items-center justify-center min-h-screen">
                  <Circles
                    height="60"
                    width="90"
                    radius="9"
                    color="#FF4C01"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClassName=""
                    visible={true}
                  />
                </div>
              )}
            </Tab.Panel>
            {/* crowns */}
            <Tab.Panel>
              {!itemIsLoading ? (
                <section
                  style={{
                    background: `linear-gradient(120deg, rgb(39, 138, 134) 1%, rgba(11, 42, 43, 0.32) 10%, rgb(22, 85, 82) 98%) repeat scroll 0% 0%`,
                  }}
                  className={
                    isOn && showCrown
                      ? "grid grid-cols-3 w-[90%] ml-[4%] border rounded-lg  overflow-scroll scrollbar-hide"
                      : "grid grid-cols-3 w-[90%] ml-[5%] border rounded-lg max-h-[20vh] md:max-h-fit overflow-scroll scrollbar-hide"
                  }
                >
                  {storeItems?.crowns?.map((crown) => (
                    <Crown
                      id={crown.id}
                      crown={crown}
                      set_isShowModalOpen={set_isShowModalOpen}
                      setSelectedItem={setSelectedItem}
                      setShowLoginModal={setShowLoginModal}
                      isOn={isOn}
                      myCrownsId={myCrownsId}
                    />
                  ))}
                </section>
              ) : (
                <div className="text-white flex items-center justify-center min-h-screen">
                  <Circles
                    height="60"
                    width="90"
                    radius="9"
                    color="#FF4C01"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClassName=""
                    visible={true}
                  />
                </div>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
      <StoreItemView
        isShowModalOpen={isShowModalOpen}
        set_isShowModalOpen={set_isShowModalOpen}
        item={selectedItem}
        myAvatarsId={myAvatarsId}
        myBoardsId={myBoardsId}
        myCrownsId={myCrownsId}
      />
      <LoginPromptModal
        isShowModalOpen={ShowLoginModal}
        set_isShowModalOpen={setShowLoginModal}
      />
    </div>
  );
};

const Avatar = ({
  avatar,
  set_isShowModalOpen,
  setSelectedItem,
  setShowLoginModal,
  myAvatarsId,
}) => {
  const { user, token } = useAuth();

  return (
    <article
      className="flex relative  items-center  w-full  border  p-2 rounded-md mb-4 hover:opacity-80 focus:opacity-80 h-full "
      style={{
        background: `linear-gradient(120deg, rgb(39, 138, 134) 1%, rgba(11, 42, 43, 0.32) 10%, rgb(22, 85, 82) 98%) repeat scroll 0% 0%`,
      }}
      onClick={() => {
        if (!user && !token) {
          setShowLoginModal(true);
          return;
        }

        if (myAvatarsId.includes(avatar.id)) {
          return;
        }

        setSelectedItem(avatar);
        set_isShowModalOpen(true);
      }}
    >
      <section className="w-[20%] border rounded-lg mr-2">
        <img src={avatar.item} alt="" />
      </section>
      <section className="w-[60%] text-sm md:text-lg text-left text-white">
        <p className="">{avatar.name}</p>
        <p className="font-bold text-xs md:text-base">{avatar.nickname}</p>
      </section>
      <section className="w-[20%] flex  justify-center items-center text-sm ">
        <p>
          <svg
            width="28"
            height="28"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_176_1143)">
              <path
                d="M21.6 29C21.6 28.7348 21.4946 28.4804 21.3071 28.2929C21.1196 28.1054 20.8652 28 20.6 28H14.6C14.3348 28 14.0804 28.1054 13.8929 28.2929C13.7054 28.4804 13.6 28.7348 13.6 29C13.6 29.2652 13.7054 29.5196 13.8929 29.7071C14.0804 29.8946 14.3348 30 14.6 30H20.6C20.8652 30 21.1196 29.8946 21.3071 29.7071C21.4946 29.5196 21.6 29.2652 21.6 29Z"
                fill="white"
              />
              <path
                d="M22.54 24H16.54C16.2748 24 16.0204 24.1054 15.8329 24.2929C15.6454 24.4804 15.54 24.7348 15.54 25C15.54 25.2652 15.6454 25.5196 15.8329 25.7071C16.0204 25.8946 16.2748 26 16.54 26H22.54C22.8052 26 23.0596 25.8946 23.2471 25.7071C23.4347 25.5196 23.54 25.2652 23.54 25C23.54 24.7348 23.4347 24.4804 23.2471 24.2929C23.0596 24.1054 22.8052 24 22.54 24Z"
                fill="white"
              />
              <path
                d="M22 32H16C15.7348 32 15.4804 32.1054 15.2929 32.2929C15.1054 32.4804 15 32.7348 15 33C15 33.2652 15.1054 33.5196 15.2929 33.7071C15.4804 33.8946 15.7348 34 16 34H22C22.2652 34 22.5196 33.8946 22.7071 33.7071C22.8946 33.5196 23 33.2652 23 33C23 32.7348 22.8946 32.4804 22.7071 32.2929C22.5196 32.1054 22.2652 32 22 32Z"
                fill="white"
              />
              <path
                d="M32.7 32H25.7C25.4348 32 25.1804 32.1054 24.9929 32.2929C24.8054 32.4804 24.7 32.7348 24.7 33C24.7 33.2652 24.8054 33.5196 24.9929 33.7071C25.1804 33.8946 25.4348 34 25.7 34H32.7C32.9652 34 33.2196 33.8946 33.4071 33.7071C33.5947 33.5196 33.7 33.2652 33.7 33C33.7 32.7348 33.5947 32.4804 33.4071 32.2929C33.2196 32.1054 32.9652 32 32.7 32Z"
                fill="white"
              />
              <path
                d="M33.7 28H26.7C26.4348 28 26.1804 28.1054 25.9929 28.2929C25.8054 28.4804 25.7 28.7348 25.7 29C25.7 29.2652 25.8054 29.5196 25.9929 29.7071C26.1804 29.8946 26.4348 30 26.7 30H33.7C33.9652 30 34.2196 29.8946 34.4071 29.7071C34.5947 29.5196 34.7 29.2652 34.7 29C34.7 28.7348 34.5947 28.4804 34.4071 28.2929C34.2196 28.1054 33.9652 28 33.7 28Z"
                fill="white"
              />
              <path
                d="M33.74 26C33.4469 22.479 32.4901 19.0452 30.92 15.88C29.416 13.0197 27.2489 10.5612 24.6 8.71L27 3.42C27.0774 3.2619 27.1117 3.08618 27.0994 2.9106C27.0871 2.73501 27.0287 2.56578 26.93 2.42C26.839 2.29212 26.7191 2.18746 26.5802 2.1145C26.4412 2.04153 26.287 2.00231 26.13 2H9.80001C9.6319 1.99959 9.4664 2.04156 9.31881 2.12204C9.17122 2.20251 9.04629 2.3189 8.95559 2.46044C8.86488 2.60198 8.81132 2.7641 8.79986 2.93182C8.7884 3.09954 8.81941 3.26744 8.89001 3.42L11.34 8.73C8.71049 10.5829 6.5582 13.0334 5.06001 15.88C2.91001 19.88 2.24001 24.77 2.06001 28.16C2.03054 28.6563 2.10418 29.1533 2.27628 29.6197C2.44839 30.0861 2.71524 30.5118 3.06001 30.87C3.42237 31.222 3.85143 31.4979 4.32197 31.6817C4.79251 31.8654 5.29504 31.9533 5.80001 31.94H12V30H5.72001C5.4937 29.9993 5.26986 29.9529 5.06193 29.8635C4.85401 29.7742 4.66628 29.6437 4.51001 29.48C4.35352 29.3176 4.23266 29.1243 4.15517 28.9125C4.07768 28.7007 4.04527 28.4751 4.06001 28.25C4.20001 25.64 4.75001 20.67 6.82001 16.8C8.27924 14.0271 10.437 11.6832 13.08 10H14.08C13.4024 10.9375 12.778 11.9123 12.21 12.92C11.6315 13.9922 11.1399 15.1092 10.74 16.26L12.11 17.18C12.5148 15.986 13.013 14.8257 13.6 13.71C14.3209 12.4127 15.1399 11.1724 16.05 10H17.05C17.7208 11.6034 18.1943 13.2824 18.46 15C18.6772 16.2751 18.7843 17.5665 18.78 18.86L20.36 17.75C20.316 16.7443 20.2091 15.7424 20.04 14.75C19.7717 13.1282 19.3429 11.537 18.76 10H19.54L20.45 8H13.21L11.36 4H24.57L22.07 9.47C22.4986 9.69954 22.9097 9.96024 23.3 10.25C25.7502 11.9404 27.7596 14.1933 29.16 16.82C30.5627 19.7002 31.4333 22.8102 31.73 26H33.74Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_176_1143">
                <rect width="36" height="36" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </p>
        <p className="text-xs pl-1">{avatar.price}</p>
      </section>

      {user && token && !myAvatarsId.includes(avatar.id) && (
        <>
          {" "}
          {parseInt(user.coin) < avatar.price && (
            <RiLock2Fill className="absolute top-2 right-2 text-orange-color" />
          )}
          {(parseInt(user.coin) > avatar.price ||
            parseInt(user.coin) === avatar.price) && (
              <ImUnlocked className="absolute top-2 right-2 text-white" />
            )}
        </>
      )}

      {user && token && myAvatarsId.includes(avatar.id) && (
        <p className="absolute bottom-0 right-0 text-black text-xs bg-orange-50 font-extrabold px-2 ">
          Purchased
        </p>
      )}
    </article>
  );
};

const Board = ({
  board,
  isOn,
  set_isShowModalOpen,
  setSelectedItem,
  setShowLoginModal,
  myBoardsId,
}) => {
  const { user, token } = useAuth();

  return (
    <article
      className="flex flex-col justify-around p-4 pt-1 relative hover:opacity-80 focus:opacity-80"
      onClick={() => {
        if (!user && !token) {
          setShowLoginModal(true);
          return;
        }

        if (myBoardsId.includes(board.id)) {
          return;
        }

        setSelectedItem(board);
        set_isShowModalOpen(true);
      }}
    >
      {isOn && <h4 className="text-sm ">{board.name}</h4>}
      <section className="max-h-[13vh]">
        <img className="w-4/5 ml-[10%] h-full" src={board.item} alt="" />
      </section>

      {isOn && (
        <section className=" flex  justify-center items-center text-sm mt-2">
          <p className="text-sm pr-1">{board.price}</p>

          <p>
            <svg
              width="20"
              height="20"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_176_1143)">
                <path
                  d="M21.6 29C21.6 28.7348 21.4946 28.4804 21.3071 28.2929C21.1196 28.1054 20.8652 28 20.6 28H14.6C14.3348 28 14.0804 28.1054 13.8929 28.2929C13.7054 28.4804 13.6 28.7348 13.6 29C13.6 29.2652 13.7054 29.5196 13.8929 29.7071C14.0804 29.8946 14.3348 30 14.6 30H20.6C20.8652 30 21.1196 29.8946 21.3071 29.7071C21.4946 29.5196 21.6 29.2652 21.6 29Z"
                  fill="white"
                />
                <path
                  d="M22.54 24H16.54C16.2748 24 16.0204 24.1054 15.8329 24.2929C15.6454 24.4804 15.54 24.7348 15.54 25C15.54 25.2652 15.6454 25.5196 15.8329 25.7071C16.0204 25.8946 16.2748 26 16.54 26H22.54C22.8052 26 23.0596 25.8946 23.2471 25.7071C23.4347 25.5196 23.54 25.2652 23.54 25C23.54 24.7348 23.4347 24.4804 23.2471 24.2929C23.0596 24.1054 22.8052 24 22.54 24Z"
                  fill="white"
                />
                <path
                  d="M22 32H16C15.7348 32 15.4804 32.1054 15.2929 32.2929C15.1054 32.4804 15 32.7348 15 33C15 33.2652 15.1054 33.5196 15.2929 33.7071C15.4804 33.8946 15.7348 34 16 34H22C22.2652 34 22.5196 33.8946 22.7071 33.7071C22.8946 33.5196 23 33.2652 23 33C23 32.7348 22.8946 32.4804 22.7071 32.2929C22.5196 32.1054 22.2652 32 22 32Z"
                  fill="white"
                />
                <path
                  d="M32.7 32H25.7C25.4348 32 25.1804 32.1054 24.9929 32.2929C24.8054 32.4804 24.7 32.7348 24.7 33C24.7 33.2652 24.8054 33.5196 24.9929 33.7071C25.1804 33.8946 25.4348 34 25.7 34H32.7C32.9652 34 33.2196 33.8946 33.4071 33.7071C33.5947 33.5196 33.7 33.2652 33.7 33C33.7 32.7348 33.5947 32.4804 33.4071 32.2929C33.2196 32.1054 32.9652 32 32.7 32Z"
                  fill="white"
                />
                <path
                  d="M33.7 28H26.7C26.4348 28 26.1804 28.1054 25.9929 28.2929C25.8054 28.4804 25.7 28.7348 25.7 29C25.7 29.2652 25.8054 29.5196 25.9929 29.7071C26.1804 29.8946 26.4348 30 26.7 30H33.7C33.9652 30 34.2196 29.8946 34.4071 29.7071C34.5947 29.5196 34.7 29.2652 34.7 29C34.7 28.7348 34.5947 28.4804 34.4071 28.2929C34.2196 28.1054 33.9652 28 33.7 28Z"
                  fill="white"
                />
                <path
                  d="M33.74 26C33.4469 22.479 32.4901 19.0452 30.92 15.88C29.416 13.0197 27.2489 10.5612 24.6 8.71L27 3.42C27.0774 3.2619 27.1117 3.08618 27.0994 2.9106C27.0871 2.73501 27.0287 2.56578 26.93 2.42C26.839 2.29212 26.7191 2.18746 26.5802 2.1145C26.4412 2.04153 26.287 2.00231 26.13 2H9.80001C9.6319 1.99959 9.4664 2.04156 9.31881 2.12204C9.17122 2.20251 9.04629 2.3189 8.95559 2.46044C8.86488 2.60198 8.81132 2.7641 8.79986 2.93182C8.7884 3.09954 8.81941 3.26744 8.89001 3.42L11.34 8.73C8.71049 10.5829 6.5582 13.0334 5.06001 15.88C2.91001 19.88 2.24001 24.77 2.06001 28.16C2.03054 28.6563 2.10418 29.1533 2.27628 29.6197C2.44839 30.0861 2.71524 30.5118 3.06001 30.87C3.42237 31.222 3.85143 31.4979 4.32197 31.6817C4.79251 31.8654 5.29504 31.9533 5.80001 31.94H12V30H5.72001C5.4937 29.9993 5.26986 29.9529 5.06193 29.8635C4.85401 29.7742 4.66628 29.6437 4.51001 29.48C4.35352 29.3176 4.23266 29.1243 4.15517 28.9125C4.07768 28.7007 4.04527 28.4751 4.06001 28.25C4.20001 25.64 4.75001 20.67 6.82001 16.8C8.27924 14.0271 10.437 11.6832 13.08 10H14.08C13.4024 10.9375 12.778 11.9123 12.21 12.92C11.6315 13.9922 11.1399 15.1092 10.74 16.26L12.11 17.18C12.5148 15.986 13.013 14.8257 13.6 13.71C14.3209 12.4127 15.1399 11.1724 16.05 10H17.05C17.7208 11.6034 18.1943 13.2824 18.46 15C18.6772 16.2751 18.7843 17.5665 18.78 18.86L20.36 17.75C20.316 16.7443 20.2091 15.7424 20.04 14.75C19.7717 13.1282 19.3429 11.537 18.76 10H19.54L20.45 8H13.21L11.36 4H24.57L22.07 9.47C22.4986 9.69954 22.9097 9.96024 23.3 10.25C25.7502 11.9404 27.7596 14.1933 29.16 16.82C30.5627 19.7002 31.4333 22.8102 31.73 26H33.74Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_176_1143">
                  <rect width="36" height="36" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </p>
        </section>
      )}

      {user && token && !myBoardsId.includes(board.id) && (
        <>
          {parseInt(user.coin) < board.price && (
            <RiLock2Fill className="absolute top-2 right-2 text-orange-color" />
          )}

          {(parseInt(user.coin) > board.price ||
            parseInt(user.coin) === board.price) && (
              <ImUnlocked className="absolute top-2 right-2 text-white" />
            )}
        </>
      )}

      {user && token && myBoardsId.includes(board.id) && (
        <p className="absolute top-0 right-0 text-black text-xs bg-orange-50 font-extrabold px-2 ">
          Purchased
        </p>
      )}
    </article>
  );
};

const Crown = ({
  crown,
  set_isShowModalOpen,
  setSelectedItem,
  setShowLoginModal,
  isOn,
  myCrownsId,
}) => {
  const { user, token } = useAuth();

  return (
    <article
      className="hover:opacity-80 focus:opacity-80 mb-6 relative"
      onClick={() => {
        if (!user && !token) {
          setShowLoginModal(true);
          return;
        }

        if (myCrownsId.includes(crown.id)) {
          return;
        }

        setSelectedItem(crown);
        set_isShowModalOpen(true);
      }}
    >
      {isOn && <h4 className="text-sm ">{crown.name}</h4>}
      <section
        className={
          isOn ? "w-4/5 ml-[10%] relative" : "w-4/5 ml-[10%] relative py-2"
        }
      >
        <img src={crown.item} alt="" />

        {user && token && !myCrownsId.includes(crown.id) && (
          <>
            {parseInt(user.coin) < crown.price && (
              <RiLock2Fill className="absolute top-2 right-2 text-orange-color" />
            )}

            {(parseInt(user.coin) > crown.price ||
              parseInt(user.coin) === crown.price) && (
                <ImUnlocked className="absolute top-0 right-2 text-white" />
              )}
          </>
        )}
      </section>

      {isOn && (
        <section className=" flex  justify-center items-center text-sm mt-2">
          <p className="text-sm pr-1">{crown.price}</p>

          <p>
            <svg
              width="20"
              height="20"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_176_1143)">
                <path
                  d="M21.6 29C21.6 28.7348 21.4946 28.4804 21.3071 28.2929C21.1196 28.1054 20.8652 28 20.6 28H14.6C14.3348 28 14.0804 28.1054 13.8929 28.2929C13.7054 28.4804 13.6 28.7348 13.6 29C13.6 29.2652 13.7054 29.5196 13.8929 29.7071C14.0804 29.8946 14.3348 30 14.6 30H20.6C20.8652 30 21.1196 29.8946 21.3071 29.7071C21.4946 29.5196 21.6 29.2652 21.6 29Z"
                  fill="white"
                />
                <path
                  d="M22.54 24H16.54C16.2748 24 16.0204 24.1054 15.8329 24.2929C15.6454 24.4804 15.54 24.7348 15.54 25C15.54 25.2652 15.6454 25.5196 15.8329 25.7071C16.0204 25.8946 16.2748 26 16.54 26H22.54C22.8052 26 23.0596 25.8946 23.2471 25.7071C23.4347 25.5196 23.54 25.2652 23.54 25C23.54 24.7348 23.4347 24.4804 23.2471 24.2929C23.0596 24.1054 22.8052 24 22.54 24Z"
                  fill="white"
                />
                <path
                  d="M22 32H16C15.7348 32 15.4804 32.1054 15.2929 32.2929C15.1054 32.4804 15 32.7348 15 33C15 33.2652 15.1054 33.5196 15.2929 33.7071C15.4804 33.8946 15.7348 34 16 34H22C22.2652 34 22.5196 33.8946 22.7071 33.7071C22.8946 33.5196 23 33.2652 23 33C23 32.7348 22.8946 32.4804 22.7071 32.2929C22.5196 32.1054 22.2652 32 22 32Z"
                  fill="white"
                />
                <path
                  d="M32.7 32H25.7C25.4348 32 25.1804 32.1054 24.9929 32.2929C24.8054 32.4804 24.7 32.7348 24.7 33C24.7 33.2652 24.8054 33.5196 24.9929 33.7071C25.1804 33.8946 25.4348 34 25.7 34H32.7C32.9652 34 33.2196 33.8946 33.4071 33.7071C33.5947 33.5196 33.7 33.2652 33.7 33C33.7 32.7348 33.5947 32.4804 33.4071 32.2929C33.2196 32.1054 32.9652 32 32.7 32Z"
                  fill="white"
                />
                <path
                  d="M33.7 28H26.7C26.4348 28 26.1804 28.1054 25.9929 28.2929C25.8054 28.4804 25.7 28.7348 25.7 29C25.7 29.2652 25.8054 29.5196 25.9929 29.7071C26.1804 29.8946 26.4348 30 26.7 30H33.7C33.9652 30 34.2196 29.8946 34.4071 29.7071C34.5947 29.5196 34.7 29.2652 34.7 29C34.7 28.7348 34.5947 28.4804 34.4071 28.2929C34.2196 28.1054 33.9652 28 33.7 28Z"
                  fill="white"
                />
                <path
                  d="M33.74 26C33.4469 22.479 32.4901 19.0452 30.92 15.88C29.416 13.0197 27.2489 10.5612 24.6 8.71L27 3.42C27.0774 3.2619 27.1117 3.08618 27.0994 2.9106C27.0871 2.73501 27.0287 2.56578 26.93 2.42C26.839 2.29212 26.7191 2.18746 26.5802 2.1145C26.4412 2.04153 26.287 2.00231 26.13 2H9.80001C9.6319 1.99959 9.4664 2.04156 9.31881 2.12204C9.17122 2.20251 9.04629 2.3189 8.95559 2.46044C8.86488 2.60198 8.81132 2.7641 8.79986 2.93182C8.7884 3.09954 8.81941 3.26744 8.89001 3.42L11.34 8.73C8.71049 10.5829 6.5582 13.0334 5.06001 15.88C2.91001 19.88 2.24001 24.77 2.06001 28.16C2.03054 28.6563 2.10418 29.1533 2.27628 29.6197C2.44839 30.0861 2.71524 30.5118 3.06001 30.87C3.42237 31.222 3.85143 31.4979 4.32197 31.6817C4.79251 31.8654 5.29504 31.9533 5.80001 31.94H12V30H5.72001C5.4937 29.9993 5.26986 29.9529 5.06193 29.8635C4.85401 29.7742 4.66628 29.6437 4.51001 29.48C4.35352 29.3176 4.23266 29.1243 4.15517 28.9125C4.07768 28.7007 4.04527 28.4751 4.06001 28.25C4.20001 25.64 4.75001 20.67 6.82001 16.8C8.27924 14.0271 10.437 11.6832 13.08 10H14.08C13.4024 10.9375 12.778 11.9123 12.21 12.92C11.6315 13.9922 11.1399 15.1092 10.74 16.26L12.11 17.18C12.5148 15.986 13.013 14.8257 13.6 13.71C14.3209 12.4127 15.1399 11.1724 16.05 10H17.05C17.7208 11.6034 18.1943 13.2824 18.46 15C18.6772 16.2751 18.7843 17.5665 18.78 18.86L20.36 17.75C20.316 16.7443 20.2091 15.7424 20.04 14.75C19.7717 13.1282 19.3429 11.537 18.76 10H19.54L20.45 8H13.21L11.36 4H24.57L22.07 9.47C22.4986 9.69954 22.9097 9.96024 23.3 10.25C25.7502 11.9404 27.7596 14.1933 29.16 16.82C30.5627 19.7002 31.4333 22.8102 31.73 26H33.74Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_176_1143">
                  <rect width="36" height="36" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </p>
        </section>
      )}
      {user && token && myCrownsId.includes(crown.id) && (
        <p
          className={
            isOn
              ? "absolute bottom-6 right-0 text-black text-xs bg-orange-50 font-extrabold px-2 "
              : "absolute top-2 right-0 text-black text-xs bg-orange-50 font-extrabold px-2 "
          }
        >
          Purchased
        </p>
      )}
    </article>
  );
};

export default Store;
