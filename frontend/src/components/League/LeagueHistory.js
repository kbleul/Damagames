

import { useEffect, useState } from "react"
import leagueImgMain from "../../assets/leagueBg.jpg"
import { VscListSelection } from "react-icons/vsc"
import PlayerCard from "./components/PlayerCard"
import { useNavigate } from "react-router-dom"

const LeagueHistory = () => {

    const navigate = useNavigate()
    const [playerItems, setPlayerItems] = useState(null)

    return (
        <article style={{
            backgroundImage: `url(${leagueImgMain})`,
            backgroundPosition: "center",
            minWidth: "100vw",
            minHeight: "100vh",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            width: "100%",
            position: "relative",
        }}>

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

            <Nav setPlayerItems={setPlayerItems} />

            {playerItems && <article>{
                playerItems.map((player, index) => (
                    <PlayerCard key={playerItems.username} index={index} player={player} />
                ))}
            </article>}

            {playerItems && <article>{
                playerItems.map((player, index) => (
                    <PlayerCard key={playerItems.username} index={index} player={player} />
                ))}
            </article>}

            {playerItems && <article>{
                playerItems.map((player, index) => (
                    <PlayerCard key={playerItems.username} index={index} player={player} />
                ))}
            </article>}

            {playerItems && <article>{
                playerItems.map((player, index) => (
                    <PlayerCard key={playerItems.username} index={index} player={player} />
                ))}
            </article>}

            {playerItems && <article>{
                playerItems.map((player, index) => (
                    <PlayerCard key={playerItems.username} index={index} player={player} />
                ))}
            </article>}

        </article>
    )
}


const CATAGORIES = ["Standing", "Active", "Matches"]

const PLAYERS = [
    {
        username: "Lu tenet",
        point: 60
    },
    {
        username: "Ruvi Makr ",
        point: 120
    }, {
        username: "Suli Wipt",
        point: 1000
    }
]

const Nav = ({ setPlayerItems }) => {

    const [active, setActive] = useState("Standing")

    useEffect(() => {
        setPlayerItems([...PLAYERS])
    }, [])


    return (<section className="relative mt-6 w-[94%] ml-[3%] max-w-[600px] border border-orange-600 rounded-full text-orange-color bg-black flex items-center justify-center">

        <div className={active === CATAGORIES[0] ?
            "w-1/3 bg-gradient-to-b from-orange-500 to-orange-700 rounded-full flex items-center justify-center gap-x-1 py-3 text-black font-bold"
            : "w-1/3 flex items-center justify-center gap-x-1 py-3 cursor-pointer"}
            onClick={() => {
                if (active !== CATAGORIES[0]) {
                    setActive(CATAGORIES[0])
                    setPlayerItems([...PLAYERS])
                }
            }}>
            <VscListSelection className="w-4 h-5" />
            <p className="text-xs">{CATAGORIES[0]}</p>
        </div>

        <div className={active === CATAGORIES[1] ?
            "w-1/3 bg-gradient-to-b from-orange-500 to-orange-700 rounded-full flex items-center justify-center gap-x-1 py-3 text-black font-bold"
            : "w-1/3 flex items-center justify-center gap-x-1 py-3 cursor-pointer"}
            onClick={() => {
                if (active !== CATAGORIES[1]) {
                    setActive(CATAGORIES[1])
                    setPlayerItems([...PLAYERS.reverse()])
                }
            }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="m21.1 12.5l1.4 1.41l-6.53 6.59L12.5 17l1.4-1.41l2.07 2.08l5.13-5.17M10 17l3 3H3v-2c0-2.21 3.58-4 8-4l1.89.11L10 17m1-13a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4Z" /></svg>
            <p className="text-xs">{CATAGORIES[1]} Users</p>
        </div>

        <div className={active === CATAGORIES[2] ?
            "ml-1 w-1/3 bg-gradient-to-b from-orange-500 to-orange-700 rounded-full flex items-center justify-center gap-x-1 py-3 text-black font-bold"
            : "w-1/3 flex items-center justify-center gap-x-1 py-3 cursor-pointer"}
            onClick={() => {
                if (active !== CATAGORIES[2]) {
                    setActive(CATAGORIES[2])
                    setPlayerItems([...PLAYERS])
                }
            }}>
            <svg className="w-4 h-5" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_2576_6832)">
                    <path d="M3.27538 6.56545C3.63119 6.3354 3.93921 6.13219 4.25187 5.93664C4.63358 5.69764 5.04449 5.75516 5.27815 6.07276C5.51912 6.39994 5.42752 6.8102 5.03918 7.06581C4.301 7.55212 3.5595 8.03267 2.81402 8.50875C2.37855 8.78673 1.9995 8.7126 1.70543 8.2902C1.20158 7.56617 0.704372 6.83832 0.211811 6.10726C-0.0284954 5.75068 0.0524918 5.33531 0.387062 5.12571C0.72827 4.91163 1.13719 5.00557 1.39276 5.36343C1.55275 5.58709 1.7041 5.8165 1.89528 6.09512C2.23914 4.90077 2.7722 3.87193 3.60265 3.01499C5.70101 0.848669 8.28065 0.00706333 11.2632 0.756648C14.2452 1.50623 16.161 3.41886 16.8593 6.31431C17.8517 10.4271 15.298 14.3303 11.0754 15.2991C8.09677 15.9822 4.81082 14.7725 3.08022 12.3557C2.81203 11.9812 2.85717 11.5735 3.19373 11.339C3.53029 11.1039 3.94319 11.1895 4.22864 11.5588C5.57024 13.297 7.3659 14.1674 9.61362 14.115C12.7104 14.0421 15.3717 11.594 15.618 8.62761C15.8855 5.41008 13.7254 2.67566 10.4394 2.07242C7.32673 1.50176 4.09189 3.45975 3.27605 6.40953C3.26808 6.43764 3.27538 6.46959 3.27538 6.56545Z" fill="currentColor" />
                    <path d="M9.98655 6.05169C9.98655 6.51946 9.99518 6.98723 9.9819 7.455C9.97659 7.6416 10.0403 7.76941 10.1764 7.89785C10.7353 8.42697 11.285 8.96568 11.8346 9.5031C12.1792 9.84051 12.2031 10.2642 11.8997 10.5441C11.5977 10.8227 11.1841 10.7984 10.8436 10.4706C10.1791 9.83221 9.52253 9.18678 8.85804 8.54903C8.66752 8.36626 8.57193 8.15986 8.57326 7.89658C8.57989 6.81214 8.57458 5.72834 8.57658 4.6439C8.5779 4.18252 8.85339 3.87962 9.26895 3.87067C9.69579 3.86173 9.9819 4.16846 9.98589 4.64838C9.98987 5.11615 9.98655 5.58392 9.98655 6.05169Z" fill="currentColor" />
                </g>
                <defs>
                    <clipPath id="clip0_2576_6832">
                        <rect width="17" height="15" fill="currentColor" transform="translate(0.0732422 0.488281)" />
                    </clipPath>
                </defs>
            </svg>
            <p className="text-xs">{CATAGORIES[2]}</p>
        </div>
    </section>)
}

export default LeagueHistory