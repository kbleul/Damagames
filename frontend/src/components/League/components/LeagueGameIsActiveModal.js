

import React from 'react'
import { useAuth } from '../../../context/auth';
import { useNavigate } from 'react-router-dom';
import { ImCancelCircle } from "react-icons/im"
import { Localization } from '../../../utils/language';

const LeagueGameIsActiveModal = ({ activeSeasons, setActiveSeasons }) => {

    const LANG = { "AMH": "amharic", "ENG": "english" }
    const { lang } = useAuth();
    const navigate = useNavigate()


    const formateTime = time => {
        let newTime = time.split(":")

        newTime = newTime[0] + ":" + newTime[1]
        return newTime
    }

    return (
        <article className="absolute top-[20vh] w-full h-[80vh] bg-transparent z-70 ">


            <section className="scrollbar-hide z-[100] relative w-4/5 ml-[10%]   h-[45vh] border border-orange-600 rounded-xl bg-black flex flex-col items-center justify-center overflow-y-scroll pt-16">

                <ImCancelCircle
                    onClick={() => {
                        setActiveSeasons(null)
                    }} className="w-6 h-6 absolute top-2 right-2 text-orange-600 cursor-pointer" />
                <p className="text-white pt-16 pb-4 font-bold px-2">{Localization["This league games"][lang]}</p>
                <p className="text-orange-600 text-sm pb-8 px-2">{Localization["Go to the season"][lang]}</p>

                <div className="w-4/5 h-[40vh] pb-8 ">
                    {activeSeasons.map(season =>
                        <div style={{
                            background: `linear-gradient(90deg, #FF4C01 0%, rgba(0, 0, 0, 0) 139.19%)`,
                        }} key={season.id} className='py-2 mb-4 flex items-center justify-center text-white mb-4 w-full rounded-2xl'>
                            <div className='w-3/5'>
                                <p className='font-bold'>{JSON.parse(season.season_name)[LANG[lang]]}</p>
                                <p className='text-xs text-gray-200'>{formateTime(JSON.parse(season.starting_time)[LANG[lang]]) + "-" + formateTime(JSON.parse(season.ending_time)[LANG[lang]])}</p>
                            </div>

                            <div className='w-2/5'>
                                <button onClick={() => {
                                    setActiveSeasons(null)
                                    navigate(`/league/${season.id}`, {
                                        state: { season_name: season.season_name },
                                    })
                                }} className=" max-w-[100px] px-6 mb-2 bg-transparent border border-orange-600 text-white rounded-full my-2 py-2 font-semibold text-xs">{Localization["Play"][lang]}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

        </article>
    )
}

export default LeagueGameIsActiveModal