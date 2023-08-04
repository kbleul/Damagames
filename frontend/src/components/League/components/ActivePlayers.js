import Avatar from "../../../assets/Avatar.png";

import { useEffect, useState } from "react"
import { Circles } from "react-loader-spinner";
import socket from "../../../utils/socket.io";
import { useAuth } from "../../../context/auth";
import { useNavigate, useParams } from "react-router-dom";
import { assignBadgeToUser } from "../../../utils/utilFunc";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import RejectInviteModal from "./RejectInviteModal";
import { Localization } from "../../../utils/language";

import { ET_DAYS } from "../../../utils/data"

const LANG = { "AMH": "amharic", "ENG": "english" }


const ActivePlayers = ({ isGameTime, isInviteModalOpen, setIsInviteModalOpen, setInviteData }) => {

    const { user, lang } = useAuth();
    const { id } = useParams()

    const [rejectedInviteData, setRejectedInviteData] = useState(null)

    const [activePlayers, setActivePlayers] = useState(null)
    const [playedActivePlayers, setPlayedActivePlayers] = useState(null)

    const [isLoading, setIsLoading] = useState(isGameTime)
    const [error, setError] = useState(null)

    const [inviteErr, setInviteErr] = useState(null)

    const [activeSeason, setActiveSeason] = useState(null)



    const badges = localStorage.getItem("BadgesAll") ? JSON.parse(localStorage.getItem("BadgesAll")) : null

    useEffect(() => {

        let playerSeasons = JSON.parse(localStorage.getItem("dama-user-seasons")).find(season => season.id == id) || null


        if (isGameTime) {
            socket.on("activeSeasonPlayers", (data) => {

                setIsLoading(false)
                if (data.seasonId === id) {

                    if (!activePlayers && !playedActivePlayers) {

                        if (data.error) {
                            setActivePlayers(null);
                            setPlayedActivePlayers(null)
                            setError(Localization["Error fetching active players"][lang])
                            return
                        }

                        playerSeasons = JSON.parse(localStorage.getItem("dama-user-seasons")).find(season => season.id == id) || null

                        if (!playerSeasons) {
                            setActivePlayers([...data.activePlayers.filter(item => item.id !== user.id)]);
                            setPlayedActivePlayers(null)
                            setError(null)
                            return
                        }


                        else if (!playerSeasons.have_played) {
                            setActivePlayers([...data.activePlayers.filter(item => item.id !== user.id)]);
                            return
                        }

                        else {

                            let played = []
                            let notPlayed = []
                            data.activePlayers.forEach(player => {

                                if (player.id !== user.id) {
                                    playerSeasons.have_played.includes(player.id) ?
                                        played.push(player) : notPlayed.push(player)
                                }
                            })

                            setActivePlayers([...notPlayed])
                            setPlayedActivePlayers([...played])

                            playerSeasons = played = notPlayed = null
                        }
                    }
                }

            });

            socket.on('get-reject-league-invite', data => {
                setRejectedInviteData(data)
            })


            socket.on("play-league-invite", data => {
                if (user && user.id !== data.sender.id && !isInviteModalOpen) {
                    setInviteData(data)
                    setIsInviteModalOpen(true)
                }
            })

            socket.on("play-league-invite-error", data => { setInviteErr(data[lang]) })

            if (user && id) {
                const { id: userId, username, profile_image, game_point, default_board, default_crown } = user

                socket.emit("checkInLeague", {
                    seasonId: id,
                    userData: { id: userId, username, profile_image, game_point, default_board, default_crown }
                });

                setTimeout(() => {
                    socket.emit("getActiveSeasonPlayers", { seasonId: id });
                }, 500);
            }
        }

        playerSeasons && setActiveSeason(playerSeasons)
    }, [])


    return (<article>

        {!isLoading && !isGameTime ? <section className="h-[24vh] w-full flex flex-col items-center justify-center">
            <p className="text-orange-500 fold-bold text-center">{Localization["It's currently not game time."][lang]}</p>
            {activeSeason && <div>
                <p className="text-white mt-6">{Localization["Game time"][lang]} <br /><span className="text-xs text-gray-200">
                    {JSON.parse(activeSeason.starting_time)[LANG[lang]].split(":")[0]}:
                    {JSON.parse(activeSeason.starting_time)[LANG[lang]].split(":")[1]} - {JSON.parse(activeSeason.ending_time)[LANG[lang]].split(":")[0]}:
                    {JSON.parse(activeSeason.ending_time)[LANG[lang]].split(":")[1]}
                    {lang === "ENG" && "  UTC"}</span></p>
                <p className="text-xs text-gray-200">{lang === "ENG" ? JSON.parse(activeSeason?.playing_day).join(", ")
                    : (JSON.parse(activeSeason?.playing_day).map((day, index) => (
                        index !== JSON.parse(activeSeason?.playing_day).length - 1 ? `${ET_DAYS[day]} , ` : `${ET_DAYS[day]}`
                    )))}</p>
            </div>}




        </section> :


            <article>

                {!isLoading && !inviteErr && !error && activePlayers &&
                    activePlayers.length === 0
                    && <section className="h-[21vh] w-full flex flex-col items-center justify-center">
                        <svg className="text-gray-100 w-16 h-28" viewBox="0 0 188 195" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M89.2144 0.368347C58.5015 0.368347 33.4473 25.5083 33.4473 56.2211C33.4473 75.0006 42.8355 91.6307 57.1389 101.748C23.7916 115.11 0.134766 147.716 0.134766 185.76C0.185798 188.059 1.13496 190.246 2.77902 191.854C4.42309 193.462 6.63137 194.364 8.93106 194.364C11.2307 194.364 13.439 193.462 15.0831 191.854C16.7272 190.246 17.6763 188.059 17.7273 185.76C17.7273 145.384 50.2648 112.847 90.6403 112.847C104.734 112.847 117.817 116.865 128.952 123.757C129.938 124.37 131.036 124.783 132.181 124.972C133.327 125.161 134.499 125.121 135.63 124.857C136.76 124.592 137.828 124.107 138.771 123.429C139.713 122.751 140.513 121.894 141.125 120.907C141.736 119.919 142.146 118.822 142.332 117.675C142.518 116.529 142.477 115.357 142.209 114.227C141.942 113.097 141.454 112.031 140.775 111.09C140.095 110.148 139.236 109.35 138.247 108.741C133.229 105.636 127.782 103.205 122.166 101.113C136.002 90.9431 145.067 74.621 145.067 56.2211C145.067 25.5083 119.927 0.368347 89.2144 0.368347ZM89.2144 17.9774C110.42 17.9774 127.458 35.0159 127.458 56.2211C127.458 77.4263 110.42 94.3957 89.2144 94.3957C68.0092 94.3957 51.0399 77.4263 51.0399 56.2211C51.0399 35.0159 68.0092 17.9774 89.2144 17.9774ZM134.347 132.346C132.591 132.343 130.875 132.865 129.418 133.846C127.962 134.826 126.832 136.22 126.174 137.848C125.517 139.476 125.361 141.263 125.727 142.98C126.094 144.697 126.966 146.265 128.231 147.483L143.985 163.236L128.231 178.974C127.385 179.783 126.708 180.751 126.241 181.824C125.774 182.897 125.526 184.052 125.511 185.222C125.496 186.392 125.714 187.554 126.154 188.638C126.593 189.723 127.244 190.709 128.069 191.539C128.895 192.369 129.877 193.025 130.959 193.471C132.041 193.916 133.201 194.141 134.371 194.132C135.542 194.124 136.698 193.882 137.774 193.421C138.849 192.96 139.822 192.288 140.635 191.447L156.424 175.675L172.195 191.447C173.85 193.096 176.092 194.021 178.428 194.019C180.764 194.016 183.004 193.087 184.656 191.435C186.309 189.783 187.238 187.543 187.24 185.207C187.242 182.871 186.317 180.629 184.668 178.974L168.896 163.236L184.668 147.483C185.954 146.247 186.835 144.65 187.192 142.903C187.55 141.156 187.369 139.342 186.672 137.7C185.975 136.059 184.796 134.668 183.29 133.712C181.785 132.756 180.025 132.279 178.242 132.346C175.957 132.414 173.788 133.37 172.195 135.009L156.424 150.781L140.635 135.009C139.817 134.169 138.84 133.501 137.76 133.043C136.68 132.586 135.52 132.349 134.347 132.346Z" fill="#4B5563" />
                        </svg>

                        <p className="text-orange-500 fold-bold text-center text-sm">{Localization["Nobody is online right now."][lang]}</p>

                    </section>
                }

                {isLoading &&
                    <section className="w-full h-[60vh] flex items-center justify-center ">
                        <Circles
                            height="50"
                            width="70"
                            radius="9"
                            color="#FF4C01"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClassName=""
                            visible={true}
                        />
                    </section>}

                {!isLoading && !inviteErr && error && <section className="w-full h-[60vh] flex items-center justify-center">
                    <p className="text-orange-600 ">{error}</p>
                </section>}

                {!isLoading && inviteErr && !error && <section className="h-[70vh] w-4/5 ml-[10%] flex flex-col items-center justify-center">
                    <p className="text-orange-500 text-sm ">{inviteErr}</p>
                </section>}

                {!error && !inviteErr && !isLoading && activePlayers &&
                    <section>
                        {activePlayers.map((player) =>
                            user.id !== player.id && <ActivePlayersCard key={player.id} player={player} badges={badges} seasonId={id} setInviteErr={setInviteErr} rejectedInviteData={rejectedInviteData} />)}
                    </section>}


                {!error && !inviteErr && !isLoading && playedActivePlayers && playedActivePlayers.length > 0 && <section className="mt-12">
                    <p className=" text-left text-gray-300 w-[95%] ml-[5%] mb-4 font-bold text-sm border-b">{Localization["Already Played"][lang]}</p>
                    <section>
                        {playedActivePlayers.map((player) =>
                            user.id !== player.id && <ActivePlayersCard key={player.id} player={player} badges={badges}
                                seasonId={id} setInviteErr={setInviteErr} rejectedInviteData={rejectedInviteData} hasPlayed={true} />)}
                    </section>
                </section>}
            </article>}

        <RejectInviteModal rejectedInviteData={rejectedInviteData} setRejectedInviteData={setRejectedInviteData} />
    </article >
    )
}

const ActivePlayersCard = ({ player, badges, seasonId, rejectedInviteData, hasPlayed }) => {

    const navigate = useNavigate()

    const { user, token, lang } = useAuth();
    const [isLoading, setIsLoading] = useState(false)

    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    //no userName if the user logged in
    const createGameMutation = useMutation(
        async (newData) =>
            await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}auth-create-game`,
                newData,
                {
                    headers
                }
            ),
        {
            retry: false,
        }
    );

    const createGameMutationSubmitHandler = async (values) => {
        setIsLoading(true)
        try {

            localStorage.getItem("seasonId") && localStorage.removeItem("seasonId")
            localStorage.getItem("gameId") && localStorage.removeItem("gameId")
            localStorage.getItem("gamePlayers") && localStorage.removeItem("gamePlayers")

            localStorage.getItem("playerOne") && localStorage.removeItem("playerOne")
            localStorage.getItem("playerTwo") && localStorage.removeItem("playerTwo")

            localStorage.getItem("playerOneIp") && localStorage.removeItem("playerOneIp")
            localStorage.getItem("playerTwoIp") && localStorage.removeItem("playerTwoIp")


            createGameMutation.mutate(
                { has_bet: false },
                {
                    onSuccess: (responseData) => {

                        const { game, playerOne, ip, code } = responseData?.data?.data

                        localStorage.setItem("gameId", game);
                        localStorage.setItem(
                            "playerOne",
                            JSON.stringify(playerOne)
                        );

                        localStorage.setItem("playerOneIp", ip);

                        const { id: userId, username, profile_image, game_point, default_board, default_crown } = user

                        const { receiverId } = values


                        socket.on("leauge-game-started", data => {
                            if (data.gameId && data.seasonId) {
                                navigate(`/league-game/${data.gameId}`)
                                localStorage.setItem("seasonId", data.seasonId)
                                localStorage.setItem("gamePlayers", JSON.stringify({
                                    p1: data.playerOne, p2: data.playerTwo
                                }))
                            }
                        })

                        socket.emit("join-room-league", {
                            gameId: game,
                            gameCode: code,
                            seasonId,
                            sender: { id: userId, username, profile_image, game_point, default_board, default_crown },
                            receiverId: receiverId,
                        });


                    },
                    onError: (err) => { },
                }
            );
        } catch (err) { }
    };

    useEffect(() => {
        rejectedInviteData && setIsLoading(false)
    }, [rejectedInviteData])

    return (<article className="flex items-start justify-center  mb-4 pr-2 relative">
        <section className="border-2 border-gray-200 rounded-2xl flex max-w-[550px] w-[94%] py-1 px-2" style={{
            background: `linear-gradient(120deg, rgb(39, 138, 134) 1%, rgba(11, 42, 43, 0.32) 10%, rgb(22, 85, 82) 98%) repeat scroll 0% 0%`,
        }}>

            <div className="p-2 border w-[18%] rounded-lg max-w-[5rem] h-16 flex justify-center ">
                <img className="w-12 h-12"
                    src={
                        player?.profile_image ? player?.profile_image : Avatar
                    }
                    alt=""
                />
            </div>

            <section className=" w-1/2 flex flex-col justify-center">
                <div className="self-start font-bold ml-2 text-white text-left text-sm pl-2 py-1">{player?.username}</div>
            </section>

            <div className='w-[30%] flex flex-col items-center justify-center text-white  text-xs'>
                <p className="w-full pb-2">Pts 20 </p>
                {!hasPlayed && <button onClick={() => createGameMutationSubmitHandler({ receiverId: player?.id })}
                    className="w-4/5 ml-[10%] rounded-full py-1 text-white bg-orange-600 flex items-center justify-center">{isLoading ?
                        <Oval
                            height={15}
                            width={15}
                            color="#000"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                            ariaLabel='oval-loading'
                            secondaryColor="#F3C686"
                            strokeWidth={2}
                            strokeWidthSecondary={2}

                        /> : Localization["Play"][lang]}</button>}
            </div>


        </section>

        <div className={hasPlayed ? "w-3 h-3 rounded-full bg-gray-300 absolute right-8 top-2"
            : "w-3 h-3 rounded-full bg-orange-600 absolute right-8 top-2"}></div>

    </article>

    )
}

export default ActivePlayers