
import Avatar from "../../../assets/Avatar.png";

const PlayerCard = ({ index, player }) => {

    console.log("dsffd")
    return (<article className="flex items-start justify-center  my-8 pr-2">
        <p className="w-[6%] pt-2 text-xs text-gray-300">{index}</p>
        <section className="border-2 border-gray-200 rounded-2xl flex max-w-[550px] w-[94%] py-1 px-2" style={{
            background: `linear-gradient(120deg, rgb(39, 138, 134) 1%, rgba(11, 42, 43, 0.32) 10%, rgb(22, 85, 82) 98%) repeat scroll 0% 0%`,
        }}>

            <div className="p-2 border w-[18%] rounded-lg max-w-[5rem] flex justify-center ">
                <img
                    src={
                        player?.profile_image ? player?.profile_image : Avatar
                    }
                    alt=""
                />
            </div>

            <section className=" w-1/2 flex flex-col justify-center">
                <div className="self-start font-bold ml-2 text-white text-left text-sm">{player?.username}</div>
                <div className=" flex items-center justify-between gap-4 px-2 ">
                    <p className="text-gray-300 font-bold text-xs">Badge Name</p>
                </div>
            </section>

            <div className='w-[30%] flex items-center'>
                <p className="text-white text-xs w-full">Pts {player.point}</p>
            </div>


        </section>
    </article>

    )
}

export default PlayerCard