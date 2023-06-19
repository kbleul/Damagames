
import React from 'react'
import Avatar from "../../../assets/Avatar.png"

import { AiOutlineCheck } from "react-icons/ai"
import { AiOutlineClose } from "react-icons/ai"


const MATCHES = [
    {
        season: "2012",
        date: "06/07/12",
        matches: [{
            p1: {
                id: "Lu tenet1",
                name: "Lu tenet",
                img: Avatar,
                point: "",
                winner: true
            },
            p2: {
                id: "Arron Wallece1",
                name: "Arron Wallece",
                img: Avatar,
                point: ""
            }
        },
        {
            p1: {
                id: "Lu tenet2",
                name: "Lu tenet",
                img: Avatar,
                point: "",
            },
            p2: {
                id: "Arron Wallece2",
                name: "Arron Wallece",
                img: Avatar,
                point: "",
                winner: true
            }
        },
        {
            p1: {
                id: "Lu tenet3",
                name: "Lu tenet",
                img: Avatar,
                point: "",
                winner: true
            },
            p2: {
                id: "Arron Wallece3",
                name: "Arron Wallece",
                img: Avatar,
                point: ""
            }
        },

        ]
    },
    {
        season: "2012",
        date: "05/06/12",
        matches: [{
            p1: {
                id: "Lu tenet1",
                name: "Lu tenet",
                img: Avatar,
                point: "",
                winner: true
            },
            p2: {
                id: "Arron Wallece1",
                name: "Arron Wallece",
                img: Avatar,
                point: ""
            }
        },
        {
            p1: {
                id: "Lu tenet2",
                name: "Lu tenet",
                img: Avatar,
                point: "",
            },
            p2: {
                id: "Arron Wallece2",
                name: "Arron Wallece",
                img: Avatar,
                point: "",
                winner: true
            }
        },
        {
            p1: {
                id: "Lu tenet3",
                name: "Lu tenet",
                img: Avatar,
                point: "",
                winner: true
            },
            p2: {
                id: "Arron Wallece3",
                name: "Arron Wallece",
                img: Avatar,
                point: ""
            }
        },

        ]
    },
    {
        season: "2012",
        date: "04/05/12",
        matches: [{
            p1: {
                id: "Lu tenet3",
                name: "Lu tenet",
                img: Avatar,
                point: "",
            },
            p2: {
                id: "Arron Wallece3",
                name: "Arron Wallece",
                img: Avatar,
                point: "",
                winner: true
            }
        },
        {
            p1: {
                id: "Lu tenet3",
                name: "Lu tenet",
                img: Avatar,
                point: "",
            },
            p2: {
                id: "Arron Wallece3",
                name: "Arron Wallece",
                img: Avatar,
                point: "",
                winner: true
            }
        },
        {
            p1: {
                id: "Lu tenet4",
                name: "Lu tenet",
                img: Avatar,
                point: "",
                winner: true
            },
            p2: {
                id: "Arron Wallece4",
                name: "Arron Wallece",
                img: Avatar,
                point: ""
            }
        },

        ]
    },
]


const Matches = () => {
    return (
        <article>
            <h2 style={{
                background: `linear-gradient(120deg, rgb(39, 138, 134) 1%, rgba(11, 42, 43, 0.32) 10%, rgb(22, 85, 82) 98%) repeat scroll 0% 0%`,
            }} className='text-left w-[32%] ml-[68%] p-1 my-4 text-white text-sm font-bold '>Season {MATCHES[0].season}</h2>


            {MATCHES.length >= 0 &&
                <section>
                    {MATCHES.map(match => (<section id={match.date} className='mb-8'>
                        <div className='w-[96%] ml-[2%] border-b-2 border-[#ff4c01]'>
                            <h2 className='w-1/4 bg-orange-color text-black text-sm font-bold rounded-md rounded-bl-none rounded-br-none'>{match.date}</h2>
                        </div>

                        {match.matches.length > 0 && match.matches.map(match => (
                            <MatchesCard key={match.id} match={match} />
                        ))}
                    </section>
                    ))}
                </section>}




            {MATCHES.length === 0 &&
                <article className="h-[70vh] w-full flex flex-col items-center justify-center">
                    <svg className="text-gray-100 w-20 h-36" viewBox="0 0 188 195" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M89.2144 0.368347C58.5015 0.368347 33.4473 25.5083 33.4473 56.2211C33.4473 75.0006 42.8355 91.6307 57.1389 101.748C23.7916 115.11 0.134766 147.716 0.134766 185.76C0.185798 188.059 1.13496 190.246 2.77902 191.854C4.42309 193.462 6.63137 194.364 8.93106 194.364C11.2307 194.364 13.439 193.462 15.0831 191.854C16.7272 190.246 17.6763 188.059 17.7273 185.76C17.7273 145.384 50.2648 112.847 90.6403 112.847C104.734 112.847 117.817 116.865 128.952 123.757C129.938 124.37 131.036 124.783 132.181 124.972C133.327 125.161 134.499 125.121 135.63 124.857C136.76 124.592 137.828 124.107 138.771 123.429C139.713 122.751 140.513 121.894 141.125 120.907C141.736 119.919 142.146 118.822 142.332 117.675C142.518 116.529 142.477 115.357 142.209 114.227C141.942 113.097 141.454 112.031 140.775 111.09C140.095 110.148 139.236 109.35 138.247 108.741C133.229 105.636 127.782 103.205 122.166 101.113C136.002 90.9431 145.067 74.621 145.067 56.2211C145.067 25.5083 119.927 0.368347 89.2144 0.368347ZM89.2144 17.9774C110.42 17.9774 127.458 35.0159 127.458 56.2211C127.458 77.4263 110.42 94.3957 89.2144 94.3957C68.0092 94.3957 51.0399 77.4263 51.0399 56.2211C51.0399 35.0159 68.0092 17.9774 89.2144 17.9774ZM134.347 132.346C132.591 132.343 130.875 132.865 129.418 133.846C127.962 134.826 126.832 136.22 126.174 137.848C125.517 139.476 125.361 141.263 125.727 142.98C126.094 144.697 126.966 146.265 128.231 147.483L143.985 163.236L128.231 178.974C127.385 179.783 126.708 180.751 126.241 181.824C125.774 182.897 125.526 184.052 125.511 185.222C125.496 186.392 125.714 187.554 126.154 188.638C126.593 189.723 127.244 190.709 128.069 191.539C128.895 192.369 129.877 193.025 130.959 193.471C132.041 193.916 133.201 194.141 134.371 194.132C135.542 194.124 136.698 193.882 137.774 193.421C138.849 192.96 139.822 192.288 140.635 191.447L156.424 175.675L172.195 191.447C173.85 193.096 176.092 194.021 178.428 194.019C180.764 194.016 183.004 193.087 184.656 191.435C186.309 189.783 187.238 187.543 187.24 185.207C187.242 182.871 186.317 180.629 184.668 178.974L168.896 163.236L184.668 147.483C185.954 146.247 186.835 144.65 187.192 142.903C187.55 141.156 187.369 139.342 186.672 137.7C185.975 136.059 184.796 134.668 183.29 133.712C181.785 132.756 180.025 132.279 178.242 132.346C175.957 132.414 173.788 133.37 172.195 135.009L156.424 150.781L140.635 135.009C139.817 134.169 138.84 133.501 137.76 133.043C136.68 132.586 135.52 132.349 134.347 132.346Z" fill="#4B5563" />
                    </svg>

                    <p className="text-orange-500 fold-bold text-center">No Active Users Curently !</p>
                </article>}
        </article>
    )
}


const MatchesCard = ({ match }) => {

    return (<article className='text-white flex items-center justify-center px-2 my-4'>
        <section className='w-[43%] flex items-center justify-center px-1 border-2 border-gray-300 rounded-xl py-2' style={{
            background: `linear-gradient(120deg, rgb(39, 138, 134) 1%, rgba(11, 42, 43, 0.32) 10%, rgb(22, 85, 82) 98%) repeat scroll 0% 0%`,
        }}>
            <div className='w-1/4 rounded-lg max-w-[5rem] flex justify-center'>
                <img src={match.p1.img} alt="" />
            </div>
            <div className='w-4/5 flex flex-col items-start pl-1'>
                <p className='font-bold text-sm'>{match.p1.name}</p>
                <p className='text-xs'>Guandari</p>
            </div>
        </section>
        <section className='w-[14%] flex items-center justify-center gap-x-1'>
            <AiOutlineCheck className='text-green-300 w-6 h-6' />
            <p className='text-xs font-bold'>VS</p>
            <AiOutlineClose className='text-red-500 w-6 h-6' />
        </section>
        <section className='w-[43%] flex items-center justify-center border-2 border-gray-300 rounded-xl py-2' style={{
            background: `linear-gradient(120deg, rgb(39, 138, 134) 1%, rgba(11, 42, 43, 0.32) 10%, rgb(22, 85, 82) 98%) repeat scroll 0% 0%`,
        }}>
            <div className='w-1/4 rounded-lg max-w-[5rem] flex justify-center'>
                <img src={match.p2.img} alt="" />
            </div>
            <div className='w-4/5 flex flex-col items-start pl-1'>
                <p className='font-bold text-sm'>{match.p2.name}</p>
                <p className='text-xs'>Guandari</p>
            </div>
        </section>
    </article>)
}
export default Matches