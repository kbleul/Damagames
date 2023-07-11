import { useState } from "react"
import { AiFillStar } from "react-icons/ai"
import PaymentOptions from "./PaymentOptions"

import leagueImg from "../../../assets/league_bg.png"
import { useAuth } from "../../../context/auth"
import LoginPromptModal from "../../Store/LoginPromptModal"
import CoinModal from "../../Store/CoinModal"




const LeaguesCard = ({ league, setSelectedLeague }) => {

    const LANG = { "AMH": "amharic", "ENG": "english" }
    const { user, lang } = useAuth();

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
    const [isShowModalOpen, set_isShowModalOpen] = useState(false)
    const [isCoinModalOpen, setIsCoinModalOpen] = useState(false)

    //payment choices
    const [selectedMethod, setSelectedMethod] = useState(null)

    const activeSeason = league.seasons.find(season => season.is_active === true)

    let isUserInSeason = localStorage.getItem("dama-user-seasons") ?
        (activeSeason ? JSON.parse(localStorage.getItem("dama-user-seasons")).find(userSeason => userSeason?.id === activeSeason?.id) : null) : null

    return (
        <article className="bg-[#2B5A64] relative border-2 overflow-hidden border-gray-200 rounded-2xl flex items-center justify-center mt-6 mb-2 mx-[5%] max-w-[500px] text-white text-center">
            <section className="absolute top-0 left-0 w-2/5 h-full z-0">
                <img className="h-[10rem] rounded-2xl" src={leagueImg} alt="" />
                <div style={{
                    background: `linear-gradient(270deg, #2B5A64 0%, rgba(42, 89, 99, 0.5) 100%)`
                }} className="w-full h-full absolute top-0 "></div>
            </section>
            <section className="relative z-10 w-full flex flex-col items-center py-2">
                <h4 className="text-xl font-bold">{league.league_name[[LANG[lang]]] ?
                    league.league_name[[LANG[lang]]] : JSON.parse(league.league_name)[[LANG[lang]]]}</h4>

                <div>
                    <p className="text-xs ">{league.description[[LANG[lang]]]}</p>
                    <p className="text-xs">{league.seasons.length} Seasons</p>
                </div>

                <div className="w-full flex justify-evenly items-center">
                    <button onClick={() => setSelectedLeague(league)}
                        className="w-2/5 flex items-center justify-center gap-x-1 border-2 border-orange-500 rounded-full my-2 py-2 font-semibold text-sm text-orange-500">View Details
                    </button>
                    {activeSeason ? <button disabled={isUserInSeason ? true : false} onClick={() =>
                        user ? setIsPaymentModalOpen(true) : set_isShowModalOpen(true)}
                        className={isUserInSeason ? "px-4 text-center flex items-center justify-center gap-x-1  bg-gradient-to-b from-orange-500 to-orange-700 opacity-80 rounded-2xl  my-2 py-1 font-semibold text-xs text-white absolute top-0 right-1" :
                            "w-2/5 flex items-center gap-x-1 bg-gradient-to-b from-orange-500 to-orange-700 rounded-full my-2 py-2 font-semibold text-sm text-black"}>
                        <p className={isUserInSeason ? "w-full " : "w-4/5 text-right "}>{isUserInSeason ? "Joined" : "Join League"}</p>
                        {!isUserInSeason && <p><AiFillStar className="text-white" /></p>}
                    </button> :
                        <button
                            className="px-4 text-center flex items-center justify-center gap-x-1  bg-gradient-to-b bg-gray-400   opacity-80 rounded-2xl  my-2 py-1 font-semibold text-xs text-white absolute top-0 right-1">
                            Closed
                        </button>
                    }
                </div>
            </section>

            <PaymentOptions
                isPaymentModalOpen={isPaymentModalOpen}
                setIsPaymentModalOpen={setIsPaymentModalOpen}
                selectedMethod={selectedMethod}
                setSelectedMethod={setSelectedMethod}
                seasons={league.seasons}
                isCoinModalOpen={isCoinModalOpen}
                setIsCoinModalOpen={setIsCoinModalOpen}
            />

            <LoginPromptModal isShowModalOpen={isShowModalOpen} set_isShowModalOpen={set_isShowModalOpen} />

            <CoinModal isCoinModalOpen={isCoinModalOpen} setIsCoinModalOpen={setIsCoinModalOpen} />

        </article >
    )
}

export default LeaguesCard