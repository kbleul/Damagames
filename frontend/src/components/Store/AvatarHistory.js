

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

import rect from "../../assets/rect.png"
import { Circles } from "react-loader-spinner";

import parse from 'html-react-parser';
import { useAuth } from '../../context/auth';
import background from "../../assets/backdrop.jpg";


const AvatarHistory = () => {

    const { lang } = useAuth();

    const navigate = useNavigate();
    const { id } = useParams();

    const LANG = { "AMH": "amharic", "ENG": "english" }

    const [avatarHistory, setAvatarHistory] = useState([])
    const [avatar, setAvatar] = useState(null)

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
    };

    const fetchHistory = useQuery(
        ["avatarHistoryApi"],
        async () =>
            await axios.get(`${process.env.REACT_APP_BACKEND_URL}store-item-detail/${id}`, {
                headers
            }),
        {
            keepPreviousData: true,
            refetchOnWindowFocus: false,
            retry: false,
            //   enabled: !!token,
            onSuccess: (res) => {
                console.log({ ...res.data.data, img: res.data.data.item })
                setAvatarHistory([...res.data.data.history])
                setAvatar({ ...res.data.data.item_name, img: res.data.data.item })
                setIsLoading(false)
            },
            onError: (err) => {
                setIsLoading(false)
                setError("Fetch history error")
            }
        }

    )

    return (
        <main className='text-white' style={{
            backgroundImage: `url(${background})`,
            backgroundPosition: "center",
            minWidth: "100vw",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            width: "100%",
        }}>

            <button
                className="z-10 bg-orange-color rounded-full w-8 h-8 flex justify-center items-center mr-2 mt-2 fixed left-2 md:right-4"
                onClick={() => navigate("/store")}
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

            {!isLoading && <article className='h-[98vh] overflow-y-scroll'>
                <article className='mt-12'>
                    <section className='uppercase avarage'>
                        <p className='text-gray-500 text-sm'>Ethiopian</p>
                        <h3 className='text-2xl'>Royality</h3>
                    </section>
                    <section className=' py-2 relative flex justify-center items-center'>
                        <div className='mt-12 bg-orange-bg w-60 h-60 rounded-full'></div>
                        <img className='absolute top-0 h-80 w-100' src={avatar?.img} alt="" />
                        <div className='bg-gradient-to-t from-gray-900 absolute mt-[10%] w-full h-[90%]'></div>
                    </section>
                    <section className='pt-2'>
                        <h3 className='text-5xl tracking-widest'>{avatar[LANG[lang]]}</h3>
                        <p className='mt-8 w-[70%] ml-[15%] text-orange-600 text-left'>1990 - 1752</p>
                    </section>
                </article>

                <article className=" relative">
                    {avatarHistory.map(history => (
                        <section key={history.id} className='relative w-[94%] ml-[3%] flex items-center justify-center'>
                            <div className='absolute top-0 left-0 point z-4 bg-[#222222]'>
                                <img className='w-10' src={rect} alt="" />
                            </div>
                            <div className='max-w-[700px] border-l history-sec text-left mb-8 ml-5 px-6 flex flex-col items-center'>
                                {parse(history.history[LANG[lang]])}
                                {history.image &&
                                    <img className="border-4 rounded-xl border-orange-700 w-full max-w-[350px]" src={history.image} alt="" />}
                            </div>
                        </section>

                    ))}
                </article>
            </article>}

            {isLoading && <article className='h-[100vh] flex items-center justify-center'>
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
            </article>}

            {error && <article className='h-[100vh] flex items-center justify-center'>
                <p className='text-orange-color'>{error}</p>
            </article>}

        </main>
    )
}

export default AvatarHistory