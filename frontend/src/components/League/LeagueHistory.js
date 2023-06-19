

import { useState } from "react"
import leagueImgMain from "../../assets/leagueBg.jpg"
import PlayerCard from "./components/PlayerCard"
import Nav from "./components/Nav"
import { useNavigate } from "react-router-dom"
import { LEAGUE_CATAGORIES } from "../../utils/data"
import Matches from "./components/Matches"
import LeagueDetails from "./components/LeagueDetails"

const LeagueHistory = () => {

    const navigate = useNavigate()

    const [active, setActive] = useState("Standing")
    const [playerItems, setPlayerItems] = useState(null)


    // const headers = {
    //     "Content-Type": "application/json",
    //     Accept: "application/json",
    // };

    // const LeaguesData = useQuery(
    //     ["getLeaguesDataApi"],
    //     async () =>
    //         await axios.get(`${process.env.REACT_APP_BACKEND_URL}get-league`, {
    //             headers,
    //         }),
    //     {
    //         keepPreviousData: true,
    //         refetchOnWindowFocus: false,
    //         retry: false,
    //         onSuccess: (res) => {
    //             setError(null)
    //             setLeagues([...res?.data?.data])
    //             setIsLoading(false)
    //         },
    //         onError: (err) => {
    //             setError(err.message)
    //             setIsLoading(false)
    //         }
    //     }
    // );


    return (
        <article style={{
            backgroundImage: `url(${leagueImgMain})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            position: "relative"
        }} className="w-full h-[100vh] overflow-y-scroll">

            <button
                className="z-10 bg-orange-color rounded-full w-8 h-8 flex justify-center items-center mr-2 mt-2 absolute top-0 left-2 md:right-4"
                onClick={() => navigate("/create-game")}
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

            {/* <Nav setPlayerItems={setPlayerItems} active={active} setActive={setActive} /> */}

            {/* {playerItems && <article>{
                playerItems.map((player, index) => (
                    <PlayerCard key={player.id} index={index} player={player} />
                ))}
            </article>}




            {active === LEAGUE_CATAGORIES[1] && playerItems.length === 0 &&
                <article className="h-[70vh] w-full flex flex-col items-center justify-center">
                    <svg className="text-gray-100 w-20 h-36" viewBox="0 0 188 195" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M89.2144 0.368347C58.5015 0.368347 33.4473 25.5083 33.4473 56.2211C33.4473 75.0006 42.8355 91.6307 57.1389 101.748C23.7916 115.11 0.134766 147.716 0.134766 185.76C0.185798 188.059 1.13496 190.246 2.77902 191.854C4.42309 193.462 6.63137 194.364 8.93106 194.364C11.2307 194.364 13.439 193.462 15.0831 191.854C16.7272 190.246 17.6763 188.059 17.7273 185.76C17.7273 145.384 50.2648 112.847 90.6403 112.847C104.734 112.847 117.817 116.865 128.952 123.757C129.938 124.37 131.036 124.783 132.181 124.972C133.327 125.161 134.499 125.121 135.63 124.857C136.76 124.592 137.828 124.107 138.771 123.429C139.713 122.751 140.513 121.894 141.125 120.907C141.736 119.919 142.146 118.822 142.332 117.675C142.518 116.529 142.477 115.357 142.209 114.227C141.942 113.097 141.454 112.031 140.775 111.09C140.095 110.148 139.236 109.35 138.247 108.741C133.229 105.636 127.782 103.205 122.166 101.113C136.002 90.9431 145.067 74.621 145.067 56.2211C145.067 25.5083 119.927 0.368347 89.2144 0.368347ZM89.2144 17.9774C110.42 17.9774 127.458 35.0159 127.458 56.2211C127.458 77.4263 110.42 94.3957 89.2144 94.3957C68.0092 94.3957 51.0399 77.4263 51.0399 56.2211C51.0399 35.0159 68.0092 17.9774 89.2144 17.9774ZM134.347 132.346C132.591 132.343 130.875 132.865 129.418 133.846C127.962 134.826 126.832 136.22 126.174 137.848C125.517 139.476 125.361 141.263 125.727 142.98C126.094 144.697 126.966 146.265 128.231 147.483L143.985 163.236L128.231 178.974C127.385 179.783 126.708 180.751 126.241 181.824C125.774 182.897 125.526 184.052 125.511 185.222C125.496 186.392 125.714 187.554 126.154 188.638C126.593 189.723 127.244 190.709 128.069 191.539C128.895 192.369 129.877 193.025 130.959 193.471C132.041 193.916 133.201 194.141 134.371 194.132C135.542 194.124 136.698 193.882 137.774 193.421C138.849 192.96 139.822 192.288 140.635 191.447L156.424 175.675L172.195 191.447C173.85 193.096 176.092 194.021 178.428 194.019C180.764 194.016 183.004 193.087 184.656 191.435C186.309 189.783 187.238 187.543 187.24 185.207C187.242 182.871 186.317 180.629 184.668 178.974L168.896 163.236L184.668 147.483C185.954 146.247 186.835 144.65 187.192 142.903C187.55 141.156 187.369 139.342 186.672 137.7C185.975 136.059 184.796 134.668 183.29 133.712C181.785 132.756 180.025 132.279 178.242 132.346C175.957 132.414 173.788 133.37 172.195 135.009L156.424 150.781L140.635 135.009C139.817 134.169 138.84 133.501 137.76 133.043C136.68 132.586 135.52 132.349 134.347 132.346Z" fill="#4B5563" />
                    </svg>

                    <p className="text-orange-500 fold-bold text-center">No Active Users Curently !</p>
                </article>}

            {active === LEAGUE_CATAGORIES[2] &&
                <Matches />} */}

            <LeagueDetails />

        </article>
    )
}





export default LeagueHistory