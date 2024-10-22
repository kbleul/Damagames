
import { useEffect, useState } from "react";
import Avatar from "../../../assets/Avatar.png"
import leagueImg from "../../../assets/league_bg.png"
import { useAuth } from "../../../context/auth";
import PaymentOptions from "./PaymentOptions";
// import PaymentPrompt from "./PaymentPrompt";
import { useNavigate } from "react-router-dom";
import { assignBadgeToUser, convertDateType, convertTimeType } from "../../../utils/utilFunc";
import LoginPromptModal from "../../Store/LoginPromptModal";
import CoinModal from "../../Store/CoinModal";
import { Localization } from "../../../utils/language";


const LANG = { "AMH": "amharic", "ENG": "english" }

const LeagueDetails = ({ selectedLeague }) => {

    const { lang } = useAuth();
    const navigate = useNavigate()


    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
    const [isPaymentPromptModalOpen, setIsPaymentPromptModalOpen] = useState(false)
    const [isShowModalOpen, set_isShowModalOpen] = useState(false)
    const [isCoinModalOpen, setIsCoinModalOpen] = useState(false)
    const [selectedLeagueSorted, setSelectedLeagueSorted] = useState(null)



    const [selectedMethod, setSelectedMethod] = useState(null)

    const [activeSeason, setActiveSeason] = useState(null)


    const badges = localStorage.getItem("BadgesAll") ? JSON.parse(localStorage.getItem("BadgesAll")) : null

    useEffect(() => {
        let activeSeason = selectedLeague.seasons.find(season => season.is_active) || null

        if (activeSeason) {
            let tempLeague = [activeSeason, ...selectedLeague.seasons.filter(season => season.id !== activeSeason.id)]
            setSelectedLeagueSorted([...tempLeague])

            tempLeague = null
            setActiveSeason(activeSeason.id)
        }
        else {
            setSelectedLeagueSorted([...selectedLeague.seasons])
        }
    }, [])


    return (
        <article className="relative mb-4 mt-2 text-white border mx-3 rounded-xl overflow-hidden bg-[#2B5A64]" >

            <section className="absolute top-0 left-0 w-full h-[50vh] overflow-hidden z-0">
                <img className="w-full" src={leagueImg} alt="" />
                <div style={{
                    background: `linear-gradient(90deg, #2B5A64 0%, rgba(42, 89, 99, 0.5) 100%)`
                }} className="w-full h-full absolute top-0 "></div>
            </section>
            <section className="z-10 relative ">


                {selectedLeague.seasons && selectedLeague.seasons.length > 0 && !activeSeason &&
                    <article>
                        <h5 className={activeSeason ? "font-bold pt-2" : "hidden"}>{Localization["Join Now !!"][lang]}</h5>
                        <p className={activeSeason ? "text-sm" : "pt-2 text-sm"}>{Localization["New Seasons starts soon !"][lang]}</p>
                    </article>
                }

                {selectedLeagueSorted && selectedLeagueSorted.length > 0 && selectedLeagueSorted.map((season) => (
                    season.is_active ? (
                        <section key={season.id}>
                            <section className="capitalize w-full text-left px-4 mt-3 font-bold">
                                <p className="text-xl">{JSON.parse(season.season_name)[LANG[lang]]}</p>
                                <h5 className="text-5xl">{Localization["Season"][lang]}</h5>
                            </section>
                            <ActiveSeason
                                season={season}
                                setIsPaymentModalOpen={setIsPaymentModalOpen}
                                setIsPaymentPromptModalOpen={setIsPaymentPromptModalOpen}
                                set_isShowModalOpen={set_isShowModalOpen}
                            />
                        </section>
                    ) : (
                        <SeasonCard season={season} badges={badges} />
                    )
                ))}


                {(!selectedLeague.seasons || selectedLeague.seasons.length) < 1 ?
                    <article className="flex items-center justify-center text-orange-600 h-[60vh]">
                        <p>{Localization["No seasons yet !"][lang]}</p>
                    </article>
                    :
                    <button onClick={() => {
                        let activeSeason = selectedLeague.seasons.find(season => season.is_active) || null
                        activeSeason && navigate(`/league/${activeSeason.id}`, {
                            state: { season_name: activeSeason.season_name },
                        })
                    }}
                        className={activeSeason ?
                            "w-3/5 mb-8 bg-gradient-to-b from-orange-500 to-orange-700 rounded-full my-2 py-2 font-semibold text-sm text-black"
                            : "hidden"}>{Localization["View League Details"][lang]}
                    </button>
                }

            </section>


            <PaymentOptions
                isPaymentModalOpen={isPaymentModalOpen}
                setIsPaymentModalOpen={setIsPaymentModalOpen}
                setIsPaymentPromptModalOpen={setIsPaymentPromptModalOpen}
                selectedMethod={selectedMethod} setSelectedMethod={setSelectedMethod}
                seasons={selectedLeague.seasons}
                isCoinModalOpen={isCoinModalOpen}
                setIsCoinModalOpen={setIsCoinModalOpen}
            />

            <LoginPromptModal isShowModalOpen={isShowModalOpen} set_isShowModalOpen={set_isShowModalOpen} />
            <CoinModal isCoinModalOpen={isCoinModalOpen} setIsCoinModalOpen={setIsCoinModalOpen} />

        </article >
    )
}


const ActiveSeason = ({ season, setIsPaymentModalOpen, set_isShowModalOpen }) => {
    const { lang, user } = useAuth();


    let isUserInSeason = user && user.seasons ? user.seasons.find(userSeason => userSeason?.id === season?.id) : null;
    const totalPlayer = season.number_of_player || 20

    const formattedStaringDate = convertDateType(JSON.parse(season?.starting_date)[LANG[lang]], lang)
    const formattedEndDate = convertDateType(JSON.parse(season?.ending_date)[LANG[lang]], lang)

    const formattedGameTime = convertTimeType(JSON.parse(season.starting_time)[LANG["ENG"]], JSON.parse(season.ending_time)[LANG["ENG"]], LANG["ENG"])
    const formattedGameTimeET = convertTimeType(JSON.parse(season.starting_time)[LANG["AMH"]], JSON.parse(season.ending_time)[LANG["AMH"]], LANG["AMH"])


    return (<article className="border rounded-3xl  my-4 mx-2 px-2">
        <section className="py-4">
            <p className="capitalize font-bold">{Localization["joined players"][lang]} - {season.player_count}</p>
            <div className="bg-transparent mx-8 rounded-full w-4/5 ml-[10%] h-10 border border-orange-600 overflow-x-hidden">
                <div style={{
                    width: `${Math.round((season.player_count / totalPlayer) * 100)}%`
                }} className="bg-orange-color h-full"></div>
            </div>
            {season.number_of_player !== season.player_count &&
                <p><span className={totalPlayer - season.player_count > 6 && "hidden"}>{lang === "ENG" && "Only"}
                </span> {(season.number_of_player || 20) - season.player_count} {Localization["spots left"][lang]}</p>}
        </section>
        <section>

            <section className="flex items-center justify-center gap-x-1">
                <div className="border bg-[#22474f] rounded-2xl w-1/2 py-3 h-24 flex flex-col justify-center">
                    <div className="w-full flex items-center justify-start ml-1 px-2">
                        <p className="w-2 h-2 bg-orange-color rounded-full mr-1"></p>
                        <h3 className="w-full text-left text-[#FF4C01] font-bold text-sm">{Localization["No. of players"][lang]}</h3>
                    </div>
                    <p className="text-xs w-full pl-6 text-left text-gray-300">{totalPlayer} {Localization["players"][lang]}</p>
                </div>

                {season.prizes && season.prizes.length > 0 && <div className="border bg-[#22474f] rounded-2xl w-1/2 py-2 h-24">
                    <div className="w-full flex items-center justify-start ml-3">
                        <p className="w-2 h-2 bg-orange-color rounded-full mr-1"></p>
                        <h3 className=" text-left text-[#FF4C01] font-bold text-sm">{Localization["Awards"][lang]}</h3>
                    </div>

                    <section className="flex flex-col items-start justify-start gap-x-2 px-1">
                        {season.prizes.map((price, index) =>
                            <div key={price.id} className="flex items-start justify-start gap-x-1 text-xs pb-1">
                                <p className="text-xs">{++index} - </p>
                                <p className="">{JSON.parse(price?.prize_name)[LANG[lang]]}</p>
                            </div>
                        )}

                    </section>


                </div>}
            </section>

        </section>
        <section className="mt-4">
            <p className="text-sm capitalize">{formattedStaringDate} - {formattedEndDate}</p>
            <p className="text-xs capitalize mt-2">{formattedGameTimeET.starting + " - " + formattedGameTimeET.ending} ማታ  <span className="uppercase">(et)</span></p>

            <p className="text-xs capitalize ">Or </p>

            <p className="text-xs capitalize mb-2">{formattedGameTime.starting + " - " + formattedGameTime.ending} <span className="uppercase">utc</span> </p>


            {user && season.is_active && season.number_of_player !== season.player_count && <>
                {isUserInSeason ?
                    <div className="px-4 text-center flex items-center justify-center gap-x-1  bg-gradient-to-b from-orange-500 to-orange-700 opacity-80  my-2 py-1 font-semibold text-xs text-white absolute top-[10%] right-0" >
                        <p className={isUserInSeason ? "w-full " : "w-4/5 text-right "}>{Localization["Joined"][lang]}</p>
                    </div> :
                    <button onClick={() => setIsPaymentModalOpen(true)}
                        className={isUserInSeason ? "w-3/5 bg-gradient-to-b from-orange-500 to-orange-700 rounded-full my-2 py-2 font-semibold text-sm text-gray-200" : "w-3/5 bg-gradient-to-b from-orange-500 to-orange-700 rounded-full my-2 py-2 font-semibold text-sm text-black"}>
                        {Localization["Join Season"][lang]}</button>
                }
            </>
            }

            {!user &&
                <button onClick={() => set_isShowModalOpen(true)}
                    className="w-3/5 bg-gradient-to-b from-orange-500 to-orange-700 rounded-full my-2 py-2 font-semibold text-sm text-black">{Localization["Join Season"][lang]}
                </button>}


        </section>
    </article>
    )
}


const SeasonCard = ({ season, badges }) => {

    const { lang, user } = useAuth();

    const Players = ({ player }) => {

        let badge = null
        if (badges && badges.length > 0) {
            const { name } = assignBadgeToUser(player.userData?.game_point, badges)
            badge = name
        }

        return (<section className=" border-r-2 mr-4 pr-1 flex items-center justify-center mx-[2%] py-1 gap-x-1">

            <div className="w-[30%] flex items-center justify-center overflow-hidden ">
                <img className={(user && user.id === player?.userData?.id) ?
                    "w-8 h-8 rounded-full border-2 border-orange-600" :
                    "w-8 h-8 rounded-full border border-gray-500"} src={player?.userData?.profile_image ?
                        player?.userData?.profile_image : Avatar} alt="" />
            </div>
            <div className="w-[70%] overflow-hidden text-xs capitalize">
                <p className="w-full font-bold text-left">{player?.userData?.username}</p>
                <p className="w-full text-left">{badge ? badge[LANG[lang]] : ""}</p>
            </div>

        </section>)
    }


    return (<article className="text-white flex items-start justify-center my-8 px-2">
        <section className="w-1/2 ">
            <p className="text-xs text-left ">{JSON.parse(season.season_name)[LANG[lang]]}</p>
            <h3 className="font-bold text-xl w-full text-left pb-2">{Localization["Season"][lang]}</h3>

            {season.top3Player.map(player => (
                <Players key={player.userData.id} player={player} />
            ))}

        </section>
        <section className="w-1/2 ">
            <div className="flex items-center justify-between mx-2 h-16">
                {lang === "ENG" && <h3 className="w-1/2 font-bold text-left">Status</h3>}
                <p className="w-1/2 text-xs text-gray-200 text-right">{Localization["Completed"][lang]}</p>
            </div>

            <div className="border bg-[#22474f] mt-6 mb-2  rounded-2xl py-3">
                <div className="w-full flex items-center justify-start ml-1 px-2">
                    <p className="w-2 h-2 bg-orange-color rounded-full mr-1"></p>
                    <h3 className="w-full text-left text-[#FF4C01] font-bold text-sm">{Localization["No. of players"][lang]}</h3>
                </div>
                <p className="text-xs w-full text-left ml-6 text-gray-300">{season.number_of_player || 25} {Localization["players"][lang]}</p>
            </div>

            {season.prizes && season.prizes.length > 0 && <div className="border bg-[#22474f] my-2  rounded-2xl py-2 h-16">
                <div className="w-full flex items-center justify-start ml-3">
                    <p className="w-2 h-2 bg-orange-color rounded-full mr-1"></p>
                    <h3 className="w-full text-left text-[#FF4C01] font-bold text-sm">{Localization["Awards"][lang]}</h3>
                </div>

                <section className="flex items-center justify-center gap-2 px-2">

                    {season.prizes.map((price, index) =>
                        <div key={price.id} className="flex items-start justify-center text-xs gap-x-1">
                            <p className="text-xs">{++index}</p>
                            <img className="w-3/5 max-w-[3rem] h-6 rounded-md" src={price.image} alt="" />
                        </div>
                    )}

                </section>

            </div>}

        </section>

    </article>)
}

export default LeagueDetails