


import { useNavigate } from "react-router-dom"
import leagueImgMain from "../../assets/leagueBg.jpg"
import leagueImg from "../../assets/league_bg.png"
import LeaguesCard from "./components/LeaguesCard"

import { Circles } from "react-loader-spinner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../../context/auth";
import LeagueDetails from "./components/LeagueDetails";




const League = () => {

    const LANG = { "AMH": "amharic", "ENG": "english" }
    const { lang } = useAuth();

    const navigate = useNavigate()

    const [leagues, setLeagues] = useState([])
    const [selectedLeague, setSelectedLeague] = useState(null)

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
    };

    const LeaguesData = useQuery(
        ["getLeaguesDataApi"],
        async () =>
            await axios.get(`${process.env.REACT_APP_BACKEND_URL}get-league`, {
                headers,
            }),
        {
            keepPreviousData: true,
            refetchOnWindowFocus: false,
            retry: false,
            onSuccess: (res) => {
                setError(null)
                setLeagues([...res?.data?.data])
                setIsLoading(false)
            },
            onError: (err) => {
                setError(err.message)
                setIsLoading(false)
            }
        }
    );


    return (
        <article style={{
            backgroundImage: `url(${leagueImgMain})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            position: "relative",
        }} className="w-full h-[100vh] overflow-y-scroll">

            <button
                className="z-10 bg-orange-color rounded-full w-8 h-8 flex justify-center items-center mr-2 mt-2 fixed left-2 md:right-4 z-40"
                onClick={() => {
                    selectedLeague ? setSelectedLeague(null) : navigate("/create-game")
                }}
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

            <section className="text-white pt-2">
                <h2 className="text-6xl font-bold ml-[32%] md:ml-[40%] w-3/5  text-left ">Dama</h2>
                <p className="text-2xl ml-[32%] md:ml-[40%] w-3/5  text-left px-1">League</p>
            </section>

            {!selectedLeague && <article>
                {!error && !isLoading && <section>
                    {leagues.map(league => (
                        <LeaguesCard key={league.id} league={league} setSelectedLeague={setSelectedLeague} />
                    ))}
                </section>}

                {isLoading && <section className="w-full h-[60vh] flex items-center justify-center ">
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

                {error && <section className="w-full h-[60vh] flex items-center justify-center">
                    <p className="text-orange-600 ">{error}</p>
                </section>}
            </article>}

            {selectedLeague && <LeagueDetails selectedLeague={selectedLeague} />}

        </article>
    )
}


export default League