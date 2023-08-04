
import Avatar from "../../../assets/Avatar.png";
import { useAuth } from "../../../context/auth";
import { Localization } from "../../../utils/language";
import { assignBadgeToUser } from "../../../utils/utilFunc";

const LANG = { "AMH": "amharic", "ENG": "english" }

const PlayerCard = ({ index, player, badges }) => {

    const { lang, user } = useAuth();

    let badge = null
    if (badges && badges.length > 0) {
        const { name } = assignBadgeToUser(player.userData?.game_point, badges)
        badge = name
    }

    const className = (user && user.id === player.userData.id) ?
        "border-2 border-orange-600 rounded-2xl flex items-center justify-center max-w-[550px] w-[94%] py-1 px-2"
        : "border-2 border-gray-200 rounded-2xl flex items-center justify-center max-w-[550px] w-[94%] py-1 px-2"

    return (<article className="flex items-start justify-center  my-8 pr-2">
        <p className="w-[6%] pt-2 text-xs text-gray-300">{++index}</p>
        <section className={className} style={{
            background: `linear-gradient(120deg, rgb(39, 138, 134) 1%, rgba(11, 42, 43, 0.32) 10%, rgb(22, 85, 82) 98%) repeat scroll 0% 0%`,
        }}>

            <div className="p-2 border w-[18%] rounded-lg max-w-[5rem] h-14 flex justify-center ">
                <img className="w-10 h-10"
                    src={
                        player?.userData?.profile_image ? player?.userData?.profile_image : Avatar
                    }
                    alt=""
                />
            </div>

            <section className=" w-1/2 flex flex-col justify-center">
                <div className="self-start font-bold ml-2 text-white text-left text-sm">{player?.userData?.username}</div>
                <div className=" flex items-center justify-between gap-4 px-2 ">
                    <p className="text-gray-300 font-bold text-xs">{badge ? badge[LANG[lang]] : ""}</p>
                </div>
            </section>

            <div className='w-[30%] flex flex-col items-center justify-center text-white  text-xs'>
                <p className="w-full">{Localization["Pts"][lang]} {player?.points}</p>
            </div>


        </section>


    </article>

    )
}

export default PlayerCard