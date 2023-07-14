import axios from "axios";
import Avatar from "../../../assets/Avatar.png"
import { useAuth } from "../../../context/auth";
import socket from "../../../utils/socket.io";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { ImCancelCircle } from "react-icons/im"

import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";


const PlayLeagueInvite = ({ setIsInviteModalOpen, inviteData }) => {
    const { user, token, lang } = useAuth()
    const navigate = useNavigate()

    const [inviteErr, setInviteErr] = useState(null)
    const [isLoading, setIsLoading] = useState(false)


    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    const joinViaCodeMutation = useMutation(
        async (newData) =>
            await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}auth-join-game/${inviteData.gameId}`,
                newData,
                {
                    headers,
                }
            ),
        {
            retry: false,
        }
    );

    const joinViaCodeMutationSubmitHandler = async (values) => {
        console.log(values)
        try {
            joinViaCodeMutation.mutate(
                { is_league: true },
                {
                    onSuccess: (responseData) => {
                        const { id: userId, username, profile_image, game_point, default_board, default_crown } = user

                        socket.on("leauge-game-started", data => {
                            if (data.gameId && data.seasonId) {
                                setIsInviteModalOpen(false)
                                navigate(`/league-game/${data.gameId}`)
                                localStorage.setItem("seasonId", data.seasonId)
                                console.log("League game started", data)
                                localStorage.setItem("gamePlayers", JSON.stringify({
                                    p1: data.playerOne, p2: data.playerTwo
                                }))
                            }
                        })

                        socket.emit("join-room-league", {
                            gameId: inviteData.gameId,
                            gameCode: inviteData.gameCode,
                            seasonId: inviteData.seasonId,
                            sender: { id: userId, username, profile_image, game_point, default_board, default_crown },
                            receiverId: inviteData.sender.id,
                            isPlayerTwo: true
                        });

                        setTimeout(() => {
                            if (!inviteErr) {
                                setIsInviteModalOpen(false)
                                setIsLoading(false)
                            }
                        }, 2000)

                        console.log("Invite accepted")

                        localStorage.setItem("gameId", responseData?.data?.data?.game);
                        localStorage.setItem("p1", responseData?.data?.data?.playerOne?.username);

                    },
                    onError: (err) => {
                        toast(err?.response?.data?.message);
                    },

                }
            );
        } catch (err) {
        }
    };


    useEffect(() => {
        socket.on("play-league-invite-error", data => {
            setInviteErr(data[lang])
        })
    }, [])


    const handleRejectInvite = (receiverId, seasonId) => {

        const { id: userId, username, profile_image } = user

        socket.emit("reject-league-invite", {
            sender: { id: userId, username, profile_image },
            receiverId,
            seasonId,
        })
    }

    return (
        <article className="absolute w-full h-[100vh] bg-transparent z-70">


            {/* <ImCancelCircle
                onClick={() => {
                    setActiveSeasons(null)
                }} className="w-6 h-6 absolute top-2 right-2 text-orange-600 cursor-pointer" /> */}

            {inviteErr ? <section className="h-[80vh] w-full flex flex-col items-center justify-center">
                <p className="text-orange-500 fold-bold text-center">{inviteErr}</p>
            </section> :


                <section className="z-[100] absolute top-[22vh] w-4/5 ml-[10%] h-[30vh] border border-orange-600 rounded-xl bg-black flex flex-col items-center justify-center">
                    <div className="w-full flex items-center justify-center text-white gap-x-4">
                        <div className="flex flex-col items-center justify-center">
                            <img className="w-10 h-10 rounded-full border border-gray-500" src={inviteData?.sender?.profile_image ? inviteData?.sender?.profile_image : Avatar} alt="" />
                            <p className="text-xs">{inviteData?.sender?.username}</p>
                        </div>
                        <p>vs</p>

                        <div className="flex flex-col items-center justify-center">
                            <img className="w-10 h-10 rounded-full border border-gray-500" src={user?.profile_image ? user?.profile_image : Avatar} alt="" />
                            <p className="text-xs">{user?.username}</p>
                        </div>

                    </div>
                    <p className="text-white text-sm py-4"><span className="text-orange-600">{inviteData?.sender?.username}</span> is asking you to play.</p>

                    <div className="w-full flex items-center justify-center gap-x-[5%]">
                        <button onClick={() => {
                            setIsInviteModalOpen(false);
                            handleRejectInvite(inviteData.sender.id, inviteData.seasonId)
                        }} className="w-[30%] mb-2 bg-transparent border border-orange-600 text-white rounded-full my-2 py-2 font-semibold text-xs">Reject
                        </button>
                        <button onClick={() => {
                            setIsLoading(true);
                            joinViaCodeMutationSubmitHandler(inviteData.gameId)
                        }}
                            className={"w-[30%] mb-2 bg-gradient-to-b from-orange-500 to-orange-700 rounded-full my-2 py-2 font-semibold text-xs text-black flex items-center justify-center"
                            }>
                            {isLoading ?
                                <Oval
                                    height={20}
                                    width={20}
                                    color="#FF4C01"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                    visible={true}
                                    ariaLabel='oval-loading'
                                    secondaryColor="#F3C686"
                                    strokeWidth={2}
                                    strokeWidthSecondary={2}

                                /> : "Accept"
                            }
                        </button>
                    </div>
                </section>
            }

        </article>
    );
};

export default PlayLeagueInvite;
