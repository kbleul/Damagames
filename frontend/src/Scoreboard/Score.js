import Avatar from "../assets/Avatar.png";
import { SORTBY } from "../utils/data"
import { useEffect, useState } from "react";
import { assignBadgeToUser } from "../utils/utilFunc";
import { useAuth } from "../context/auth";
import BadgeHistory from "./BadgeHistory";





const Score = ({ score, badges, index, sortBy }) => {

  const [badge, setBadge] = useState(null)
  const [isBadgeHistoryOpen, setIsBadgeHistoryOpen] = useState(false)


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
    if (badges) {
      let url = assignBadgeToUser(score?.game_point, badges)

      let { name, description } = badges.find(item => item.badge_image === url)

      setBadge({ url, name, desc: description })

      url = []
      name = description = null
    }

  }, [])

  return (<>
    <article className="w-4/5 max-w-[50rem] relative">
      <section
        className="w-full flex mt-[6vh] border rounded-lg p-2 mb-2"
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
        <div className="w-[70%] font-bold self-center text-white text-left ml-4 text-sm">{`${++index}- ${score?.username
          }`}</div>

        <div className="w-[10%]  cursor-pointer" onClick={prev => setIsBadgeHistoryOpen(true)}>
          {badge && <img src={badge?.url} alt="" />}
        </div>

      </section>
    </article>
    {badge && <BadgeHistory isBadgeHistoryOpen={isBadgeHistoryOpen} setIsBadgeHistoryOpen={setIsBadgeHistoryOpen} badge={badge} />}
  </>
  );
};


export default Score;
