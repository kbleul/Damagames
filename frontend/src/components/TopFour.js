

import React, { useEffect, useState } from 'react'
import { assignBadgeToUser } from '../utils/utilFunc'
import { Localization } from '../utils/language'
import { useAuth } from '../context/auth';
import Avatar from "../assets/Avatar.png";


const TopFour = ({ item, badges }) => {

    const { lang } = useAuth();
    const LANG = { "AMH": "amharic", "ENG": "english" }

    const [badgeData, setBadgeData] = useState(null)

    useEffect(() => {
        if (badges && badges.length > 0) {
            let data = assignBadgeToUser(item.game_point, badges)
            setBadgeData(data)
            data = ""
        }

    }, [])


    return (
        <section className="ml-1 mb-1 flex-grow cursor-pointer w-full border rounded-lg border-gray-500 flex justify-center items-center">
            <div className=" w-7 h-7 border border-orange-color rounded-full flex items-center justify-center overflow-hidden">
                <img className="w-full" src={item.profile_image ? item.profile_image : Avatar} alt="" />
            </div>

            <div className='w-4/5'>
                <p className="text-white text-sm text-left md:text-base font-bold pl-4">{item.username ? item.username : " - "}</p>
                <div className='flex items-center justify-between'>
                    <p className='pl-4 text-orange-color text-xs text-center'>{badgeData?.name[LANG[lang]]}</p>
                </div>
            </div>

            <div className='w-4 h-4'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" fill="red"><path fill={badgeData?.color} d="m23 2l1.593 3L28 5.414l-2.5 2.253L26 11l-3-1.875L20 11l.5-3.333L18 5.414L21.5 5L23 2z" /><path fill={badgeData?.color} d="m22.717 13.249l-1.938-.498a6.994 6.994 0 1 1-5.028-8.531l.499-1.937A8.99 8.99 0 0 0 8 17.69V30l6-4l6 4V17.708a8.963 8.963 0 0 0 2.717-4.459ZM18 26.263l-4-2.667l-4 2.667V19.05a8.924 8.924 0 0 0 8 .006Z" /></svg>
            </div>

        </section>
    )
}

export default TopFour