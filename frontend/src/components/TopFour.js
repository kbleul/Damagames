

import React, { useEffect, useState } from 'react'
import { assignBadgeToUser } from '../utils/utilFunc'
import { Localization } from '../utils/language'
import { useAuth } from '../context/auth';
import Avatar from "../assets/Avatar.png";


const TopFour = ({ item, badges }) => {

    const { lang } = useAuth();

    const [imageUrl, setImageUrl] = useState(null)

    useEffect(() => {
        let url = assignBadgeToUser(item.game_point, badges)
        console.log(item.game_point, badges, url)
        setImageUrl(url)
        //url = ""
    }, [])


    return (
        <section className="mx-1 mt-4 mb-2 flex-grow w-1/4 cursor-pointer">
            <div className=" h-16 md:h-24 border border-orange-color rounded-md flex items-center justify-center overflow-hidden">
                <img className="w-full" src={item.profile_image ? item.profile_image : Avatar} alt="" />
            </div>
            <p className="text-white text-xs md:text-base text-left  pl-1 font-bold">{item.username ? item.username : " - "}</p>
            <div className="flex justify-between pb-1">
                <p className="text-orange-color text-[.6rem]  md:text-sm text-left pl-1">{item.match_history.wins} {Localization["Wins"][lang]}</p>
                {imageUrl && badges && <img className=" w-5" src={imageUrl} alt="" />}
            </div>

        </section>
    )
}

export default TopFour