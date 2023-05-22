import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import { useAuth } from "../../context/auth";
import background from "../../assets/backdrop.jpg";
import { useQuery } from "@tanstack/react-query";
import { Circles } from "react-loader-spinner";
import { IconContext } from "react-icons";
import axios from "axios";

import { RiLock2Fill } from "react-icons/ri";
import { ImUnlocked } from "react-icons/im";
import { AiFillDownCircle } from "react-icons/ai";


import StoreItemView from "./StoreItemViewModal";
import LoginPromptModal from "./LoginPromptModal";
import { Localization } from "../../utils/language";

const Store = () => {
  const navigate = useNavigate();
  const { token, lang } = useAuth();

  const [storeItems, setStoreItems] = useState({});
  const [itemIsLoading, setItemIsLoading] = useState(true);
  const [itemsError, setitemsError] = useState(false);

  const [isOn, setIsOn] = useState(false);
  const [ShowLoginModal, setShowLoginModal] = useState(false);

  const [isShowModalOpen, set_isShowModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [myAvatarsId, setMyAvatarsId] = useState([]);
  const [myBoardsId, setMyBoardsId] = useState([]);
  const [myCrownsId, setMyCrownsId] = useState([]);

  const [viewAll, setViewAll] = useState(false);


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
        for (const [, value] of Object.entries(res.data.data.avatars)) {
          setMyAvatarsId((prev) => [...prev, value.id]);
        }
        for (const [, value] of Object.entries(res.data.data.boards)) {
          setMyBoardsId((prev) => [...prev, value.id]);
        }
        for (const [, value] of Object.entries(res.data.data.crowns)) {
          setMyCrownsId((prev) => [...prev, value.id]);
        }
      },
      onError: (err) => { },
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

    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundPosition: "center",
        minWidth: "100vw",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100%",
      }}
      className={viewAll ? "relative w-full overflow-y-scroll" : "relative w-full h-[100vh] overflow-y-scroll"}>
      <button
        className="z-10 bg-orange-color rounded-full w-8 h-8 flex justify-center items-center mr-2 mt-2 fixed left-2 md:right-4"
        onClick={() => { viewAll ? setViewAll(false) : navigate("/create-game") }}
      >
        <svg
          width="18"
          height="14"
          viewBox="0 0 18 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0.396166 0.973833C0.500244 0.722555 0.676505 0.507786 0.902656 0.356693C1.12881 0.205599 1.39469 0.124969 1.66667 0.125H10.8333C12.6567 0.125 14.4054 0.849328 15.6947 2.13864C16.984 3.42795 17.7083 5.17664 17.7083 7C17.7083 8.82336 16.984 10.572 15.6947 11.8614C14.4054 13.1507 12.6567 13.875 10.8333 13.875H2.58333C2.21866 13.875 1.86892 13.7301 1.61106 13.4723C1.3532 13.2144 1.20833 12.8647 1.20833 12.5C1.20833 12.1353 1.3532 11.7856 1.61106 11.5277C1.86892 11.2699 2.21866 11.125 2.58333 11.125H10.8333C11.9274 11.125 12.9766 10.6904 13.7501 9.91682C14.5237 9.14323 14.9583 8.09402 14.9583 7C14.9583 5.90598 14.5237 4.85677 13.7501 4.08318C12.9766 3.3096 11.9274 2.875 10.8333 2.875H4.98592L5.84758 3.73667C6.09793 3.99611 6.23636 4.34351 6.23306 4.70403C6.22976 5.06455 6.08499 5.40935 5.82993 5.66417C5.57487 5.91898 5.22994 6.06343 4.86941 6.06639C4.50889 6.06935 4.16163 5.93059 3.90242 5.68L0.694083 2.47167C0.501936 2.27941 0.371084 2.03451 0.318058 1.76791C0.265033 1.50132 0.292214 1.22499 0.396166 0.973833Z"
            fill="#191921"
          />
        </svg>
      </button>

      {itemsError && <div className="text-white flex items-center justify-center min-h-screen">
        <p className="text-sm text-orange-600">
          {Localization["Fetch store items failed."][lang]}
        </p>
      </div>}
      {itemIsLoading && <div className="text-white flex items-center justify-center min-h-screen">
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
      </div>}

      {!viewAll && !itemIsLoading && !itemsError && <> <article className="h-[52vh] w-full  overflow-y-hidden px-2">
        <h2 className={viewAll ? "md:text-center md:mt-16 mr-2 text-white font-bold text-right " : "md:text-center md:mt-16 mr-2 text-white font-bold mt-4 text-right "}>
          {Localization["Avatars"][lang]}
        </h2>
        <section>
          {storeItems.avatars?.map((avatar) => (
            <Avatar
              id={avatar.id}
              avatar={avatar}
              set_isShowModalOpen={set_isShowModalOpen}
              setSelectedItem={setSelectedItem}
              setShowLoginModal={setShowLoginModal}
              myAvatarsId={myAvatarsId}
            />
          ))}
        </section>

      </article>
        <div className="w-full my-2 flex justify-center items-center gap-2 md:w-1/5 md:ml-[40%] ">
          <p className="text-orange-color text-left md:text-center  ml-4 font-bold"
            onClick={() => setViewAll(true)}>
            {Localization["view all"][lang]}
          </p>


          <IconContext.Provider value={{ color: "#FF4C01", className: "global-class-name" }}>
            <div onClick={() => setViewAll(true)}>
              <AiFillDownCircle />
            </div>
          </IconContext.Provider>;
        </div>
        <article className="h-[30vh] w-full  mb-[2vh] px-2">
          <h2 className="md:text-center md:mt-16 mr-2 text-white font-bold mb-2 text-right ">
            {Localization["Boards"][lang]}
          </h2>
          <section className="md:w-1/2 md:ml-[25%]  flex overflow-x-scroll pt-2 border-2 rounded-3xl" style={{
            background: `linear-gradient(120deg, rgb(39, 138, 134) 1%, rgba(11, 42, 43, 0.32) 10%, rgb(22, 85, 82) 98%) repeat scroll 0% 0%`,
          }}>
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
        </article>

        <article className="my-6 w-full px-2">
          <h2 className="md:text-center md:mt-16 mr-2 text-white font-bold mb-2 text-right ">
            {Localization["Crowns"][lang]}
          </h2>
          <section className="md:w-1/2 md:ml-[25%]  flex overflow-x-scroll  pt-4 border-2 rounded-3xl" style={{
            background: `linear-gradient(120deg, rgb(39, 138, 134) 1%, rgba(11, 42, 43, 0.32) 10%, rgb(22, 85, 82) 98%) repeat scroll 0% 0%`,
          }}>
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
        </article> </>}

      {viewAll && <div className="sticky top-0 w-full max-w-2xl mx-auto flex flex-col items-center justify-center px-2 py-10 sm:px-0 h-full">
        <Tab.Group>
          <Tab.Panels className="mt-2  ">
            <Tab.Panel>

              {storeItems.avatars?.map((avatar) => (
                <Avatar
                  id={avatar.id}
                  avatar={avatar}
                  set_isShowModalOpen={set_isShowModalOpen}
                  setSelectedItem={setSelectedItem}
                  setShowLoginModal={setShowLoginModal}
                  myAvatarsId={myAvatarsId}
                />
              ))}

            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>}

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
  const { user, token, lang } = useAuth();

  return (
    <article
      className="md:w-1/2 md:ml-[25%] flex relative  items-center  w-full  border-2  p-2 rounded-md mb-4 hover:opacity-80 focus:opacity-80 h-full "
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

        set_isShowModalOpen(true);
        setSelectedItem(avatar);
      }}
    >
      <section className="w-[20%] border rounded-lg mr-2">
        <img src={avatar.item} alt="" />
      </section>
      <section className="w-[60%] text-sm md:text-lg text-left mr-4 py-2 text-white border-r-2 border-orange-color">
        <p className="">{avatar.name}</p>

      </section>
      {user && token && myAvatarsId.includes(avatar.id) ?
        <p className="w-[25%] flex text-black text-xs bg-orange-50 font-extrabold px-1 ">
          {Localization["Purchased"][lang]}
        </p> :
        <section className="w-[20%] flex  justify-center items-center text-sm ">
          <p>
            <svg width="28" height="30" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M15.6213 0C11.5107 0 7.76502 1.45809 5.54911 2.64939C5.34891 2.75689 5.16235 2.86243 4.98853 2.96407C4.64455 3.16539 4.35152 3.35302 4.11855 3.51818L6.63932 7.5035L7.826 8.0107C12.4635 10.5233 18.6826 10.5233 23.321 8.0107L24.6678 7.26016L27.0521 3.51818C26.5582 3.17222 26.0445 2.85986 25.5142 2.58293C23.3101 1.40434 19.6545 0 15.6213 0ZM9.75798 4.51109C8.86535 4.33171 7.98373 4.09412 7.118 3.79964C9.19376 2.80966 12.2879 1.75909 15.6204 1.75909C17.9291 1.75909 20.1123 2.26336 21.9177 2.9025C19.8019 3.22207 17.5442 3.76445 15.3929 4.43193C13.7002 4.9577 11.7218 4.90102 9.75798 4.51109ZM24.282 9.46L24.059 9.58118C18.9565 12.3449 12.1896 12.3449 7.08705 9.58118L6.87593 9.46586C-0.788309 18.4968 -6.63977 35.1789 15.6213 35.1789C37.8805 35.1789 31.8862 18.1851 24.282 9.46ZM14.6748 17.5909C14.1921 17.5909 13.7292 17.7968 13.3879 18.1634C13.0466 18.5299 12.8548 19.0271 12.8548 19.5455C12.8548 20.0638 13.0466 20.561 13.3879 20.9275C13.7292 21.2941 14.1921 21.5 14.6748 21.5V17.5909ZM16.4949 15.6364V14.6591H14.6748V15.6364C13.7094 15.6364 12.7836 16.0482 12.1009 16.7813C11.4183 17.5144 11.0347 18.5087 11.0347 19.5455C11.0347 20.5822 11.4183 21.5765 12.1009 22.3096C12.7836 23.0427 13.7094 23.4545 14.6748 23.4545V27.3636C14.2985 27.3637 13.9313 27.2385 13.6239 27.0052C13.3165 26.7719 13.0841 26.442 12.9585 26.0609C12.8782 25.8165 12.7107 25.6164 12.4929 25.5046C12.2751 25.3928 12.0249 25.3785 11.7973 25.4648C11.5698 25.5511 11.3834 25.731 11.2793 25.9648C11.1752 26.1987 11.1619 26.4674 11.2422 26.7118C11.4933 27.474 11.9581 28.134 12.5729 28.6008C13.1876 29.0675 13.922 29.3182 14.6748 29.3182V30.2955H16.4949V29.3182C17.4603 29.3182 18.3862 28.9063 19.0688 28.1732C19.7515 27.4401 20.135 26.4458 20.135 25.4091C20.135 24.3723 19.7515 23.378 19.0688 22.6449C18.3862 21.9118 17.4603 21.5 16.4949 21.5V17.5909C17.2866 17.5909 17.961 18.1333 18.2121 18.8936C18.2494 19.018 18.3095 19.1331 18.3889 19.2321C18.4683 19.3311 18.5654 19.412 18.6744 19.47C18.7835 19.528 18.9022 19.562 19.0237 19.5698C19.1452 19.5777 19.2669 19.5593 19.3816 19.5158C19.4963 19.4722 19.6017 19.4044 19.6916 19.3164C19.7816 19.2283 19.8541 19.1218 19.905 19.0031C19.9559 18.8844 19.9841 18.756 19.988 18.6254C19.9919 18.4948 19.9713 18.3647 19.9275 18.2427C19.6765 17.4805 19.2116 16.8206 18.5969 16.3538C17.9821 15.887 17.2478 15.6364 16.4949 15.6364ZM16.4949 23.4545V27.3636C16.9776 27.3636 17.4405 27.1577 17.7819 26.7912C18.1232 26.4246 18.315 25.9275 18.315 25.4091C18.315 24.8907 18.1232 24.3936 17.7819 24.027C17.4405 23.6605 16.9776 23.4545 16.4949 23.4545Z" fill="white" />
            </svg>
          </p>
          <p className="text-xs text-white pl-1">{avatar.price}</p>
        </section>
      }


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
  const { user, token, lang } = useAuth();

  return (
    <article
      className="flex-shrink-0 flex flex-col justify-around p-4 pt-1 relative hover:opacity-80 focus:opacity-80 w-1/2"
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
      <h4 className="text-sm text-white">{board.name}</h4>
      <section className="max-h-[17vh]">
        <img className="w-4/5 max-w-[12rem] ml-[10%] h-full" src={board.item} alt="" />
      </section>


      {user && token && myBoardsId.includes(board.id) ?
        <p className="w-4/5 ml-[10%] text-black text-xs bg-orange-50 font-extrabold px-2 ">
          {Localization["Purchased"][lang]}

        </p> :

        <div className="mt-1 flex items-center justify-center gap-1">
          <svg width="22" height="24" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.6213 0C11.5107 0 7.76502 1.45809 5.54911 2.64939C5.34891 2.75689 5.16235 2.86243 4.98853 2.96407C4.64455 3.16539 4.35152 3.35302 4.11855 3.51818L6.63932 7.5035L7.826 8.0107C12.4635 10.5233 18.6826 10.5233 23.321 8.0107L24.6678 7.26016L27.0521 3.51818C26.5582 3.17222 26.0445 2.85986 25.5142 2.58293C23.3101 1.40434 19.6545 0 15.6213 0ZM9.75798 4.51109C8.86535 4.33171 7.98373 4.09412 7.118 3.79964C9.19376 2.80966 12.2879 1.75909 15.6204 1.75909C17.9291 1.75909 20.1123 2.26336 21.9177 2.9025C19.8019 3.22207 17.5442 3.76445 15.3929 4.43193C13.7002 4.9577 11.7218 4.90102 9.75798 4.51109ZM24.282 9.46L24.059 9.58118C18.9565 12.3449 12.1896 12.3449 7.08705 9.58118L6.87593 9.46586C-0.788309 18.4968 -6.63977 35.1789 15.6213 35.1789C37.8805 35.1789 31.8862 18.1851 24.282 9.46ZM14.6748 17.5909C14.1921 17.5909 13.7292 17.7968 13.3879 18.1634C13.0466 18.5299 12.8548 19.0271 12.8548 19.5455C12.8548 20.0638 13.0466 20.561 13.3879 20.9275C13.7292 21.2941 14.1921 21.5 14.6748 21.5V17.5909ZM16.4949 15.6364V14.6591H14.6748V15.6364C13.7094 15.6364 12.7836 16.0482 12.1009 16.7813C11.4183 17.5144 11.0347 18.5087 11.0347 19.5455C11.0347 20.5822 11.4183 21.5765 12.1009 22.3096C12.7836 23.0427 13.7094 23.4545 14.6748 23.4545V27.3636C14.2985 27.3637 13.9313 27.2385 13.6239 27.0052C13.3165 26.7719 13.0841 26.442 12.9585 26.0609C12.8782 25.8165 12.7107 25.6164 12.4929 25.5046C12.2751 25.3928 12.0249 25.3785 11.7973 25.4648C11.5698 25.5511 11.3834 25.731 11.2793 25.9648C11.1752 26.1987 11.1619 26.4674 11.2422 26.7118C11.4933 27.474 11.9581 28.134 12.5729 28.6008C13.1876 29.0675 13.922 29.3182 14.6748 29.3182V30.2955H16.4949V29.3182C17.4603 29.3182 18.3862 28.9063 19.0688 28.1732C19.7515 27.4401 20.135 26.4458 20.135 25.4091C20.135 24.3723 19.7515 23.378 19.0688 22.6449C18.3862 21.9118 17.4603 21.5 16.4949 21.5V17.5909C17.2866 17.5909 17.961 18.1333 18.2121 18.8936C18.2494 19.018 18.3095 19.1331 18.3889 19.2321C18.4683 19.3311 18.5654 19.412 18.6744 19.47C18.7835 19.528 18.9022 19.562 19.0237 19.5698C19.1452 19.5777 19.2669 19.5593 19.3816 19.5158C19.4963 19.4722 19.6017 19.4044 19.6916 19.3164C19.7816 19.2283 19.8541 19.1218 19.905 19.0031C19.9559 18.8844 19.9841 18.756 19.988 18.6254C19.9919 18.4948 19.9713 18.3647 19.9275 18.2427C19.6765 17.4805 19.2116 16.8206 18.5969 16.3538C17.9821 15.887 17.2478 15.6364 16.4949 15.6364ZM16.4949 23.4545V27.3636C16.9776 27.3636 17.4405 27.1577 17.7819 26.7912C18.1232 26.4246 18.315 25.9275 18.315 25.4091C18.315 24.8907 18.1232 24.3936 17.7819 24.027C17.4405 23.6605 16.9776 23.4545 16.4949 23.4545Z" fill="white" />
          </svg>
          <p className="text-sm text-white pr-1">{board.price} {Localization["coins"][lang]}</p>

        </div>
      }

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
  const { user, token, lang } = useAuth();

  return (
    <article
      className="flex-shrink-0 w-1/2 hover:opacity-80 focus:opacity-80 mb-6 relative"
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
      <h4 className="text-sm text-white">{crown.name}</h4>
      <section
        className={
          isOn ? "w-4/5 ml-[10%] relative" : "w-4/5 ml-[10%] relative py-2"
        }
      >
        <img className="w-4/5 ml-[10%] h-28" src={crown.item} alt="" />



        {user && token && myCrownsId.includes(crown.id) ?
          <p
            className="w-4/5 ml-[10%] text-black text-xs bg-orange-50 font-extrabold px-2 "
          >{Localization["Purchased"][lang]}

          </p> :
          <div className="mt-1 flex items-center justify-center gap-1">
            <svg width="22" height="24" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M15.6213 0C11.5107 0 7.76502 1.45809 5.54911 2.64939C5.34891 2.75689 5.16235 2.86243 4.98853 2.96407C4.64455 3.16539 4.35152 3.35302 4.11855 3.51818L6.63932 7.5035L7.826 8.0107C12.4635 10.5233 18.6826 10.5233 23.321 8.0107L24.6678 7.26016L27.0521 3.51818C26.5582 3.17222 26.0445 2.85986 25.5142 2.58293C23.3101 1.40434 19.6545 0 15.6213 0ZM9.75798 4.51109C8.86535 4.33171 7.98373 4.09412 7.118 3.79964C9.19376 2.80966 12.2879 1.75909 15.6204 1.75909C17.9291 1.75909 20.1123 2.26336 21.9177 2.9025C19.8019 3.22207 17.5442 3.76445 15.3929 4.43193C13.7002 4.9577 11.7218 4.90102 9.75798 4.51109ZM24.282 9.46L24.059 9.58118C18.9565 12.3449 12.1896 12.3449 7.08705 9.58118L6.87593 9.46586C-0.788309 18.4968 -6.63977 35.1789 15.6213 35.1789C37.8805 35.1789 31.8862 18.1851 24.282 9.46ZM14.6748 17.5909C14.1921 17.5909 13.7292 17.7968 13.3879 18.1634C13.0466 18.5299 12.8548 19.0271 12.8548 19.5455C12.8548 20.0638 13.0466 20.561 13.3879 20.9275C13.7292 21.2941 14.1921 21.5 14.6748 21.5V17.5909ZM16.4949 15.6364V14.6591H14.6748V15.6364C13.7094 15.6364 12.7836 16.0482 12.1009 16.7813C11.4183 17.5144 11.0347 18.5087 11.0347 19.5455C11.0347 20.5822 11.4183 21.5765 12.1009 22.3096C12.7836 23.0427 13.7094 23.4545 14.6748 23.4545V27.3636C14.2985 27.3637 13.9313 27.2385 13.6239 27.0052C13.3165 26.7719 13.0841 26.442 12.9585 26.0609C12.8782 25.8165 12.7107 25.6164 12.4929 25.5046C12.2751 25.3928 12.0249 25.3785 11.7973 25.4648C11.5698 25.5511 11.3834 25.731 11.2793 25.9648C11.1752 26.1987 11.1619 26.4674 11.2422 26.7118C11.4933 27.474 11.9581 28.134 12.5729 28.6008C13.1876 29.0675 13.922 29.3182 14.6748 29.3182V30.2955H16.4949V29.3182C17.4603 29.3182 18.3862 28.9063 19.0688 28.1732C19.7515 27.4401 20.135 26.4458 20.135 25.4091C20.135 24.3723 19.7515 23.378 19.0688 22.6449C18.3862 21.9118 17.4603 21.5 16.4949 21.5V17.5909C17.2866 17.5909 17.961 18.1333 18.2121 18.8936C18.2494 19.018 18.3095 19.1331 18.3889 19.2321C18.4683 19.3311 18.5654 19.412 18.6744 19.47C18.7835 19.528 18.9022 19.562 19.0237 19.5698C19.1452 19.5777 19.2669 19.5593 19.3816 19.5158C19.4963 19.4722 19.6017 19.4044 19.6916 19.3164C19.7816 19.2283 19.8541 19.1218 19.905 19.0031C19.9559 18.8844 19.9841 18.756 19.988 18.6254C19.9919 18.4948 19.9713 18.3647 19.9275 18.2427C19.6765 17.4805 19.2116 16.8206 18.5969 16.3538C17.9821 15.887 17.2478 15.6364 16.4949 15.6364ZM16.4949 23.4545V27.3636C16.9776 27.3636 17.4405 27.1577 17.7819 26.7912C18.1232 26.4246 18.315 25.9275 18.315 25.4091C18.315 24.8907 18.1232 24.3936 17.7819 24.027C17.4405 23.6605 16.9776 23.4545 16.4949 23.4545Z" fill="white" />
            </svg>
            <p className="text-sm text-white pr-1">{crown.price} {Localization["coins"][lang]}</p>

          </div>
        }

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


    </article>
  );
};

export default Store;








