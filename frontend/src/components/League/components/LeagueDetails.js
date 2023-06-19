
import Avatar from "../../../assets/Avatar.png"
import leagueImg from "../../../assets/league_bg.png"


const LeagueDetails = () => {
    return (
        <article className="relative mb-4 mt-2 text-white border mx-3 rounded-xl overflow-hidden bg-[#2B5A64]" >

            <section className="absolute top-0 left-0 w-full h-[50vh] overflow-hidden z-0">
                <img className="w-full" src={leagueImg} alt="" />
                <div style={{
                    background: `linear-gradient(90deg, #2B5A64 0%, rgba(42, 89, 99, 0.5) 100%)`
                }} className="w-full h-full absolute top-0 "></div>
            </section>
            <section className="z-10 relative ">
                <h5 className="font-bold pt-2">Join now</h5>
                <p className="text-sm">New Seasons starts soon !</p>

                <section className="capitalize w-full text-left px-4 mt-3 font-bold">
                    <p className="text-xl">Name</p>
                    <h5 className="text-5xl">League</h5>
                </section>

                <ActiveSeason />
                <SeasonCard />
                <SeasonCard />

                <SeasonCard />

                <button
                    className="w-3/5 mb-8 bg-gradient-to-b from-orange-500 to-orange-700 rounded-full my-2 py-2 font-semibold text-sm text-black">View League Details
                </button>
            </section>


        </article>
    )
}


const ActiveSeason = () => {

    const className = `w-[${(60 / 100) * 100}%] bg-orange-color h-full`

    return (<article className="border rounded-3xl  my-4 mx-2 px-2">
        <section className="py-4">
            <p className="capitalize font-bold">joined player - 5</p>
            <div className="bg-transparent mx-8 rounded-full w-4/5 ml-[10%] h-10 border border-orange-600 overflow-x-hidden">
                <div className={className}></div>
            </div>
            <p>Only 15 spots left</p>
        </section>
        <section>
            {/* <div className="flex items-center justify-between mx-2">
                <h3 className="w-full font-bold text-right">Status  <span className="text-xs text-orange-600 ml-4">Active</span></h3>
                <p className="w-1/2 sm text-right">Active</p>
            </div> */}

            <section className="flex items-center justify-evenly gap-x-1">
                <div className="border bg-[#22474f] rounded-2xl w-1/2 py-2">
                    <div className="w-full flex items-center justify-start ml-1 px-2">
                        <p className="w-2 h-2 bg-orange-color rounded-full mr-1"></p>
                        <h3 className="w-full text-left text-[#FF4C01] font-bold text-sm">No. of players </h3>
                    </div>
                    <p className="text-xs w-full text-center  text-gray-300">80 players</p>
                </div>

                <div className="border bg-[#22474f] rounded-2xl w-1/2 py-2">
                    <div className="w-full flex items-center justify-start ml-1">
                        <p className="w-2 h-2 bg-orange-color rounded-full mr-1"></p>
                        <h3 className="w-full text-left text-[#FF4C01] font-bold text-sm">Awards</h3>
                    </div>

                    <section className="flex items-center justify-center gap-x-2 px-2">
                        <div className="flex items-start justify-center text-xs">
                            <p className="text-xs">1</p>
                            <img className="w-3/5" src={Avatar} alt="" />
                        </div>
                        <div className="flex items-start justify-center text-xs">
                            <p className="text-xs">2</p>
                            <img className="w-3/5" src={Avatar} alt="" />
                        </div>
                        <div className="flex items-start justify-center text-xs">
                            <p className="text-xs">3</p>
                            <img className="w-3/5" src={Avatar} alt="" />
                        </div>
                    </section>

                </div>
            </section>

        </section>

        <section className="mt-4">
            <p className="text-sm capitalize">July 25 - Aug 1</p>
            <p className="text-sm text-xs capitalize">3pm - 5pm</p>
            <button
                className="w-3/5 bg-gradient-to-b from-orange-500 to-orange-700 rounded-full my-2 py-2 font-semibold text-sm text-black">Join Season
            </button>
        </section>
    </article>
    )
}
const SeasonCard = () => {

    const Players = () => {
        return (<section className=" border-r-2 mr-4 flex items-center justify-center mx-[2%] py-1 gap-x-1">
            <div className="w-[15%] flex items-center justify-center">
                <img className="w-full max-w-[2rem]" src={Avatar} alt="" />
            </div>
            <div className="w-[85%]  text-xs capitalize">
                <p className=" w-full font-bold text-left">player name</p>
                <p className=" w-full text-left">badge</p>
            </div>



        </section>)
    }


    return (<article className="text-white flex items-start justify-center my-8 px-2">
        <section className="w-1/2 ">
            <h3 className="font-bold text-xl w-full text-left">Seasons</h3>
            <p className="text-xs text-left pb-2">Season name</p>
            <Players />
            <Players />
            <Players />
        </section>
        <section className="w-1/2 ">
            <div className="flex items-center justify-between mx-2">
                <h3 className="w-1/2 font-bold text-left">Status</h3>
                <p className="w-1/2 text-xs text-gray-200 text-right">Completed</p>
            </div>

            <div className="border bg-[#22474f] my-2  rounded-2xl py-2">
                <div className="w-full flex items-center justify-start ml-1 px-2">
                    <p className="w-2 h-2 bg-orange-color rounded-full mr-1"></p>
                    <h3 className="w-full text-left text-[#FF4C01] font-bold text-sm">No. of players </h3>
                </div>
                <p className="text-xs w-full text-left ml-4 text-gray-300">80 players</p>
            </div>

            <div className="border bg-[#22474f] my-2  rounded-2xl py-2">
                <div className="w-full flex items-center justify-start ml-1">
                    <p className="w-2 h-2 bg-orange-color rounded-full mr-1"></p>
                    <h3 className="w-full text-left text-[#FF4C01] font-bold text-sm">Awards</h3>
                </div>

                <section className="flex items-center justify-center gap-x-2 px-2">
                    <div className="flex items-start justify-center text-xs">
                        <p className="text-xs">1</p>
                        <img className="w-3/5" src={Avatar} alt="" />
                    </div>
                    <div className="flex items-start justify-center text-xs">
                        <p className="text-xs">2</p>
                        <img className="w-3/5" src={Avatar} alt="" />
                    </div>
                    <div className="flex items-start justify-center text-xs">
                        <p className="text-xs">3</p>
                        <img className="w-3/5" src={Avatar} alt="" />
                    </div>
                </section>

            </div>
            {/* <p className="text-xs text-gray-300 mt-4 w-full text-center">20/10/2018 - 01/05/2022 G.C</p> */}


        </section>

    </article>)
}

export default LeagueDetails