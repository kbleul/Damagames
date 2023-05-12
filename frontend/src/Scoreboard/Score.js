import Avatar from "../assets/Avatar.png";
import { useAuth } from "../context/auth";
import { Localization } from "../utils/language";
import { SORTBY } from "../utils/data"

const Score = ({ score, hasBadge, index, sortBy }) => {
  const { lang } = useAuth();
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

  return (
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

        {hasBadge && (
          <div className="w-[10%]  ">
            <svg
              width="20"
              height="27"
              viewBox="0 0 20 27"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.25 17.7917V26.3753C16.25 26.4858 16.2207 26.5944 16.165 26.6898C16.1094 26.7853 16.0294 26.8643 15.9331 26.9188C15.8369 26.9733 15.728 27.0013 15.6174 27C15.5068 26.9986 15.3986 26.968 15.3037 26.9112L10 23.7311L4.69625 26.9112C4.6013 26.968 4.49295 26.9987 4.38227 27C4.27159 27.0012 4.16255 26.9731 4.0663 26.9185C3.97006 26.8639 3.89006 26.7847 3.83448 26.689C3.77891 26.5934 3.74976 26.4847 3.75 26.3741V17.793C2.13268 16.4991 0.957491 14.7351 0.386824 12.7449C-0.183843 10.7547 -0.121805 8.63655 0.564364 6.68311C1.25053 4.72967 2.52695 3.03742 4.21723 1.84022C5.9075 0.643029 7.92818 0 10 0C12.0718 0 14.0925 0.643029 15.7828 1.84022C17.473 3.03742 18.7495 4.72967 19.4356 6.68311C20.1218 8.63655 20.1838 10.7547 19.6132 12.7449C19.0425 14.7351 17.8673 16.4991 16.25 17.793V17.7917ZM10 17.4857C11.9891 17.4857 13.8968 16.6961 15.3033 15.2906C16.7098 13.8852 17.5 11.9789 17.5 9.9913C17.5 8.00366 16.7098 6.09742 15.3033 4.69195C13.8968 3.28647 11.9891 2.49689 10 2.49689C8.01088 2.49689 6.10322 3.28647 4.6967 4.69195C3.29018 6.09742 2.5 8.00366 2.5 9.9913C2.5 11.9789 3.29018 13.8852 4.6967 15.2906C6.10322 16.6961 8.01088 17.4857 10 17.4857ZM10 14.9876C8.67392 14.9876 7.40215 14.4612 6.46447 13.5242C5.52678 12.5872 5 11.3164 5 9.9913C5 8.6662 5.52678 7.39538 6.46447 6.4584C7.40215 5.52142 8.67392 4.99502 10 4.99502C11.3261 4.99502 12.5979 5.52142 13.5355 6.4584C14.4732 7.39538 15 8.6662 15 9.9913C15 11.3164 14.4732 12.5872 13.5355 13.5242C12.5979 14.4612 11.3261 14.9876 10 14.9876Z"
                fill="#FF4C01"
              />
            </svg>
          </div>
        )}
      </section>
    </article>
  );
};

export default Score;
