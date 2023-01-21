import SideMenu from "./SideMenu";
import { useNavigate } from "react-router-dom";
import background from "../assets/backdrop.jpg";
import avatar from "../assets/dama-default.jpg";
 import { useAuth } from "../context/auth";
import {Link } from "react-router-dom";

const CreateGame = () => {
  const navigate = useNavigate();
  const { user, token  } = useAuth();

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundPosition: "center",
        minWidth: "100vw",
        minHeight: "100vh",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100%",
      }}
    >

      <SideMenu />

      <div className="flex flex-col items-center justify-center gap-y-4 min-h-screen space-y-2">
        <div className="h-[183px] w-[130px] bg-inherit mt-4 ">
          <img src={avatar} className="" alt="avatar" />
        </div>

        <button
          onClick={() => navigate("/new-game")}
          className="w-3/5 mt-2 bg-orange-bg p-2 px-10 font-bold text-white rounded-lg max-w-[20rem]"
        >
          Create Game
        </button>
        <button
          onClick={() => navigate("/join-game")}
          className="w-3/5 mt-24 border-2 bg-transparent border-orange-color p-2 px-11 font-medium text-orange-color rounded-lg max-w-[20rem]"
        >
          Join Game
        </button>
        <button
          onClick={() => navigate("/pubic-game")}
          className="w-3/5 mt-24 border-2 bg-transparent border-orange-color p-2 px-11 font-medium text-orange-color rounded-lg max-w-[20rem]"
        >
          Play online
        </button>
        {/* <button
          onClick={() => navigate(`/game/${1}`)}
          className="w-3/5 mt-24 border-2 bg-transparent whitespace-nowrap
           border-orange-color p-2 px-11 font-medium text-orange-color rounded-lg max-w-[20rem]"
        >
          Play With computer
        </button> */}
        <>
        {user && token ? <></> :
          <div className="w-3/5 pb-[5vh]">
          <button className="w-full  border-2 bg-transparent border-orange-color p-2 px-11 font-medium text-orange-color rounded-lg mb-2 max-w-[20rem]" onClick={() => { navigate("/signup")  }}>
             <p>Sign Up</p>
          </button>
          <p className="text-orange-color text-xs">or</p>
          <button className="font-bold text-orange-color border-b border-orange-color" onClick={() => { navigate("/login")  }}>Log in</button>
        </div>
        }</>
       
        
        <section className="w-4/5 max-w-[30rem] flex items-center justify-evenly mt-[12vh]">
          <Link to="/score-board" className="flex flex-col justify-evenly items-center">
            <div className="h-6 w-8 bg-orange-color px-2 flex justify-center items-center ">
              <svg
                width="20"
                height="18"
                viewBox="0 0 20 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.5 11.5H14V8.5H15.5V11.5ZM14 0C13.45 0 13 0.45 13 1V2H7V1C7 0.45 6.55 0 6 0C5.45 0 5 0.45 5 1V2H2C0.9 2 0 2.9 0 4V16C0 17.1 0.9 18 2 18H18C19.1 18 20 17.1 20 16V4C20 2.9 19.1 2 18 2H15V1C15 0.45 14.55 0 14 0ZM7.5 12.25C7.5 12.66 7.16 13 6.75 13H4C3.45 13 3 12.55 3 12V10.5C3 9.95 3.45 9.5 4 9.5H6V8.5H3.75C3.34 8.5 3 8.16 3 7.75C3 7.34 3.34 7 3.75 7H6.5C7.05 7 7.5 7.45 7.5 8V9.5C7.5 10.05 7.05 10.5 6.5 10.5H4.5V11.5H6.75C7.16 11.5 7.5 11.84 7.5 12.25ZM17 12C17 12.55 16.55 13 16 13H13.5C12.95 13 12.5 12.55 12.5 12V8C12.5 7.45 12.95 7 13.5 7H16C16.55 7 17 7.45 17 8V12ZM10.75 4.75C10.75 5.16 10.41 5.5 10 5.5C9.59 5.5 9.25 5.16 9.25 4.75C9.25 4.34 9.59 4 10 4C10.41 4 10.75 4.34 10.75 4.75ZM10.75 8.25C10.75 8.66 10.41 9 10 9C9.59 9 9.25 8.66 9.25 8.25C9.25 7.84 9.59 7.5 10 7.5C10.41 7.5 10.75 7.84 10.75 8.25ZM10.75 11.75C10.75 12.16 10.41 12.5 10 12.5C9.59 12.5 9.25 12.16 9.25 11.75C9.25 11.34 9.59 11 10 11C10.41 11 10.75 11.34 10.75 11.75ZM10.75 15.25C10.75 15.66 10.41 16 10 16C9.59 16 9.25 15.66 9.25 15.25C9.25 14.84 9.59 14.5 10 14.5C10.41 14.5 10.75 14.84 10.75 15.25Z"
                  fill="#191921"
                />
              </svg>
            </div>
            <p className="text-orange-color text-[.7rem]">Score board</p>
          </Link>
{/* 
          <div className="flex flex-col justify-evenly items-center">
            <div
              className="h-6 w-8
          flex justify-center items-center  bg-orange-color px-2"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 16C4.9 16 4.01 16.9 4.01 18C4.01 19.1 4.9 20 6 20C7.1 20 8 19.1 8 18C8 16.9 7.1 16 6 16ZM0 0V2H2L5.6 9.59L4.25 12.04C4.09 12.32 4 12.65 4 13C4 14.1 4.9 15 6 15H18V13H6.42C6.28 13 6.17 12.89 6.17 12.75L6.2 12.63L7.1 11H14.55C15.3 11 15.96 10.59 16.3 9.97L19.88 3.48C19.9625 3.32739 20.004 3.15598 20.0005 2.98253C19.9969 2.80908 19.9485 2.63951 19.8598 2.49039C19.7711 2.34127 19.6453 2.2177 19.4946 2.13175C19.3439 2.04579 19.1735 2.0004 19 2H4.21L3.27 0H0ZM16 16C14.9 16 14.01 16.9 14.01 18C14.01 19.1 14.9 20 16 20C17.1 20 18 19.1 18 18C18 16.9 17.1 16 16 16Z"
                  fill="#191921"
                />
              </svg>
            </div>
            <p className="text-orange-color text-[.7rem]">Shop</p>
          </div> */}

        </section>
      </div>

      
    </div>
  );
};

export default CreateGame;
