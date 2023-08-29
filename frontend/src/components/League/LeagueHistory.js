

import { useEffect, useState } from "react"
import leagueImgMain from "../../assets/leagueBg.jpg"
import PlayerCard from "./components/PlayerCard"
import Nav from "./components/Nav"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { LEAGUE_CATAGORIES } from "../../utils/data"
import Matches from "./components/Matches"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import { Circles } from "react-loader-spinner";
import { useAuth } from "../../context/auth"
import ActivePlayers from "./components/ActivePlayers"
import { Localization } from "../../utils/language"

const LANG = { "AMH": "amharic", "ENG": "english" }

const LeagueHistory = ({ isInviteModalOpen, setIsInviteModalOpen, setInviteData }) => {

    const navigate = useNavigate()


    const { id } = useParams()
    const { token, user, lang } = useAuth();

    const location = useLocation();
    const season_name = location.state ? JSON.parse(location.state?.season_name)[LANG[lang]] : null;

    const [active, setActive] = useState(LEAGUE_CATAGORIES[0])

    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [leagues, setLeagues] = useState(null)

    //is user in this competion
    const [isInSeason, setIsInSeason] = useState(false)
    const [isGameTime, setIsGameTime] = useState(false)


    const badges = localStorage.getItem("BadgesAll") ? JSON.parse(localStorage.getItem("BadgesAll")) : null


    const checkUserInSeason = (playersArr) => {
        if (!user && !token) return

        let player = playersArr.find(player => player.userData.id === user.id)

        player ? setIsInSeason(true) : setIsInSeason(false)
    }



    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
    };

    const onSuccess = data => {
        setError(null)
        setLeagues([...data.users])
        setIsLoading(false)

        checkUserInSeason(data?.users)
        setIsGameTime(data?.is_game_time ? true : false)
    }

    const OnError = (err) => {
        setError(err.message)
        setIsLoading(false)
    }

    const SeasonData = useQuery(
        ["getSeasonDataApi"],
        async () =>
            await axios.get(`${process.env.REACT_APP_BACKEND_URL}standings/${id}`, {
                headers,
            }),
        {
            keepPreviousData: false,
            refetchOnWindowFocus: false,
            retry: true,
            onSuccess: (res) => onSuccess(res?.data?.data),
            onError: (err) => OnError(err)
        }
    );


    return (
        <article style={{
            backgroundImage: `url(${leagueImgMain})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            position: "relative"
        }} className="w-full h-[100vh] overflow-y-scroll">

            <button
                className="z-50 bg-orange-color rounded-full w-8 h-8 flex justify-center items-center mr-2 mt-2 absolute top-0 left-2 md:right-4"
                onClick={() => navigate("/league")}
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

            <section className="text-white pt-2 flex flex-col items-center">
                <h2 id="title" className="capitalize text-4xl font-bold text-center">
                    {season_name ? season_name : Localization["Dama"][lang]}
                </h2>
                <p id="description" className={lang === "ENG" ?
                    "text-xl text-left " : "text-xl text-left font-bold "}>
                    {Localization["League"][lang]}
                </p>
            </section>

            <Nav active={active} setActive={setActive} isInSeason={isInSeason} />

            {active === LEAGUE_CATAGORIES[0] && leagues && <article>{
                leagues.length === 0 ? <section className="w-full h-[60vh] flex items-center justify-center">
                    <p className="text-orange-600 ">{Localization["No one has joined yet."][lang]}</p>
                </section> : <section>
                    {leagues.map((player, index) => (
                        <PlayerCard key={player.userData.id} index={index} player={player} badges={badges} />
                    ))}

                </section>}

            </article>
            }

            {
                active === LEAGUE_CATAGORIES[0] && isLoading &&
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
                </section>
            }

            {
                active === LEAGUE_CATAGORIES[0] && error && <section className="w-full h-[60vh] flex items-center justify-center">
                    <p className="text-orange-600 ">{error}</p>
                </section>
            }


            {
                user && active === LEAGUE_CATAGORIES[1] &&
                <ActivePlayers isGameTime={isGameTime}
                    isInviteModalOpen={isInviteModalOpen}
                    setIsInviteModalOpen={setIsInviteModalOpen}
                    setInviteData={setInviteData} />
            }

            {active === LEAGUE_CATAGORIES[2] && <Matches seasonId={id} />}


        </article >
    )
}





export default LeagueHistory