import Avatar from "../assets/Avatar.png";
import { SORTBY } from "../utils/data"
import { useEffect, useState } from "react";
import { assignBadgeToUser } from "../utils/utilFunc";
import { useAuth } from "../context/auth";


const Score = ({ score, badges, index, sortBy }) => {

  const [badgeData, setBadgeData] = useState(null)

  const { lang } = useAuth();
  const LANG = { "AMH": "amharic", "ENG": "english" }

  let amount
  let type


  if (sortBy === SORTBY.COIN) {
    amount = score.coin
    type = " coins"
  }
  else if (sortBy === SORTBY.COMPUTER) {
    amount = score.match_history.playWithComputerWins
    type = " wins"
  }
  else if (sortBy === SORTBY.PERSON) {
    amount = score.match_history.wins
    type = " wins"
  }

  useEffect(() => {

    if (badges && badges.length > 0) {
      let data = assignBadgeToUser(score?.game_point, badges)


      /* 
      setimage here if needed using 
      distruct badge_image 
      */
      let badge = badges.find(item => item.id === data.id)

      setBadgeData(badge)
      data = badge = []
    }

  }, [])

  return (<>
    <article className="w-4/5 max-w-[50rem] relative">
      <section
        className="w-full flex items-center mt-[6vh] border rounded-lg p-2 mb-2"
        style={{
          background: `linear-gradient(120deg, rgb(39, 138, 134) 1%, rgba(11, 42, 43, 0.32) 10%, rgb(22, 85, 82) 98%) repeat scroll 0% 0%`,
        }}
      >
        <div className="p-2 border w-1/4 rounded-lg max-w-[5rem] flex justify-center">
          <p className="absolute top-[4.5vh] border border-gray-200 px-5 py-[0.1rem] text-white  text-xs rounded-md bg-[#089b9b]">
            {amount}
            {type}
          </p>
          <img
            src={
              score?.profile_image ? score?.profile_image : Avatar
            }
            alt=""
          />
        </div>

        <section className=" w-full flex flex-col justify-center">
          <div className="self-start font-bold ml-6 text-white text-left text-base">{`${++index}- ${score?.username
            }`}</div>
          {badgeData && <div className=" flex items-center justify-between gap-4 px-6 ">
            <p className="text-gray-300 font-bold text-xs">{badgeData.name[LANG[lang]]}</p>
          </div>}
        </section>

        {badgeData && <div className='w-6 h-6'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" fill="red"><path fill={badgeData?.color} d="m23 2l1.593 3L28 5.414l-2.5 2.253L26 11l-3-1.875L20 11l.5-3.333L18 5.414L21.5 5L23 2z" /><path fill={badgeData?.color} d="m22.717 13.249l-1.938-.498a6.994 6.994 0 1 1-5.028-8.531l.499-1.937A8.99 8.99 0 0 0 8 17.69V30l6-4l6 4V17.708a8.963 8.963 0 0 0 2.717-4.459ZM18 26.263l-4-2.667l-4 2.667V19.05a8.924 8.924 0 0 0 8 .006Z" /></svg>
        </div>}
      </section>
    </article>
    {/* {badge && <BadgeHistory isBadgeHistoryOpen={isBadgeHistoryOpen} setIsBadgeHistoryOpen={setIsBadgeHistoryOpen} badge={badge} />} */}
  </>
  );
};


export default Score;
