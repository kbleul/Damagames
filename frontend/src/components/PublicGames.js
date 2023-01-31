import { useEffect, useState } from "react"
import socket from "../utils/socket.io";
import Avatar from "../assets/Avatar.png";
import PublicGameImg from "../assets/p.png";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";



const PubicGames = () => {

  const { user, token } = useAuth();

    const [publicGames, setPublicGames] = useState([])
    const [myFriend, setMyFriend] = useState("Your Friend");
    const [code, setCode] = useState();

    const [isVerified, setIsVerified] = useState(false);
    const [name, setName] = useState(user && token ? user.username : "");
    const navigate = useNavigate();

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const header = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };


useEffect(() => {
    socket.on("getPublicGames", (data) => {
      console.log("ola", data)
        setPublicGames([...data])
        });

        socket.emit("publicGames");
}, [])
  
const handleJoin = () => {
  if (!name) {
    toast("name is required.");

    return;
  }
  const gameId =  localStorage.getItem("gameId")
  if (gameId) {
    nameMutationWithCode();
  }
};
  const nameMutation = useMutation(
    async (newData) =>
      await axios.post( user && token
          ? `${process.env.REACT_APP_BACKEND_URL}auth-start-game/${localStorage.getItem("gameId")}`
          : `${process.env.REACT_APP_BACKEND_URL}add-player/${localStorage.getItem("gameId")}`,
        newData,
        {
          headers: user && token ? header : headers,
        }
      ),
    {
      retry: false,
    }
  );
  
   //with code
   const nameMutationWithCode = async (values) => {
    try { console.log({gameid2 : localStorage.getItem("gameId")})
      nameMutation.mutate(user && token ? {} : { username: name }, {
        onSuccess: (responseData) => {

          socket.emit("join-room", responseData?.data?.data?.game);

          socket.emit("sendMessage", { 
            status: "started", 
            player2: JSON.stringify(responseData?.data?.data?.playerTwo),
           });

          console.log(responseData?.data.data?.playerTwo);

          navigate("/game");
          //first clear local storage
          localStorage.clear();
          localStorage.setItem("p1", responseData?.data?.data?.playerOne.name);
          localStorage.setItem("p2", responseData?.data?.data?.playerTwo.name);
          localStorage.setItem("playerTwoIp", responseData?.data?.data?.ip);
          localStorage.setItem(
            "playerTwo",
            JSON.stringify(responseData?.data?.data?.playerTwo)
          );
          localStorage.setItem("gameId", responseData?.data?.data?.game);
        },
        onError: (err) => {
          console.log(err?.response?.data?.message);
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  

const handleSubmitCode = (mycode) => {
  socket.emit("joinPublicGame", mycode)
  joinViaCodeMutationSubmitHandler();
}

const joinViaCodeMutation = useMutation(
  async (newData) =>
    await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}join-game-via-code`,
      newData,
      {
        headers,
      }
    ),
  {
    retry: false,
  }
);

const joinViaCodeMutationSubmitHandler = async (values) => {
  try {
    joinViaCodeMutation.mutate(
      { code: code },
      {
        onSuccess: (responseData) => {
          console.log(responseData?.data);
          setIsVerified(true);
          responseData?.data?.data?.playerOne?.username && setMyFriend(prev => prev + " " + responseData?.data?.data?.playerOne?.username);
          localStorage.setItem("gameId", responseData?.data?.data?.game);
        },
        onError: (err) => {
          console.log(err?.response?.data);
          toast(err?.response?.data?.message);
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
};
  return (<>{!isVerified ?
    <main className="flex flex-col items-center h-[100vh] overflow-y-scroll ">
    <div>
      <img src={PublicGameImg} />
    </div>
    {publicGames?.length ===0 && 
      <p className="my-4 mt-[30vh] ml-[2%] w-[96%] max-w-[600px] text-orange-color font-bold">
        No public games currently !
      </p>}
    {publicGames?.map(game => (
      <article
      style={{
          background: `linear-gradient(120deg, rgb(39, 138, 134) 1%, rgba(11, 42, 43, 0.32) 10%, rgb(22, 85, 82) 98%) repeat scroll 0% 0%`,
        }}
         key={game.code} className="mt-4 mb-6 rounded-md ml-[2%] w-[96%] max-w-[600px] border ">

        <section className="flex justify-evenly px-4 text-xs text-white font-bold border-b border-gray-600">
          <p className="w-1/2">{`Rank - ${game.rank}`}</p>
          {/* <p className="">Coins - { game.coin ? game.coin : 0}</p> */}
          <p className="text-xs w-full text-right text-gray-400 mr-2">{game.time}</p>

        </section>
        <section className="flex justify-between mt-2 text-sm"> 
          <div className="w-[80%] flex items-center justify-left pl-4">
           <img className="w-6 h-6" src={Avatar} alt="avatar" />
           <p className="text-white ml-4 font-bold">{game.createdBy}</p>
          </div>
          <a 
          onClick={() =>{ setCode(game.code); handleSubmitCode(game.code)}}
          className="w-[20%] mr-4 bg-orange-color hover:bg-orange-600 text-black font-bold px-12 flex items-center justify-center">Join</a>
        </section>
        <section className="flex justify-between mt-2">
        </section>
       
     </article>))
     }

     
    </main> 
    : <main>
    <div
          className="flex flex-col items-center justify-center 
          min-h-screen  p-5 "
        >
          <div
            className="flex flex-col items-center justify-center space-y-2  border
             border-orange-color p-3 rounded-sm w-full max-w-xs mx-auto"
          >
            <h2 className="font-medium text-white text-lg pt-4">
              Tell Us Your Name
            </h2>
            <p className="text-gray-400 pb-2">
              <span
                className={
                  myFriend === "Your Friend" ? "" : "font-bold text-orange-400"
                }
              >
                 {myFriend}
              </span>{" "}
              is waiting for you. <br />
              Join Now !
            </p>

            <input
              disabled={user && token}
              type="text"
              placeholder="Tell us Your name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="bg-transparent  border border-orange-color w-full
                   p-2 rounded-sm text-white focus:outline-none focus:ring-0"
            />
            <button
              onClick={handleJoin}
              disabled={nameMutation.isLoading}
              className="bg-orange-bg p-2 px-10 font-medium text-white rounded-sm w-full"
            >
              {nameMutation.isLoading ? "Loading.." : "Join"}
            </button>
            <p
              onClick={() => navigate("/create-game")}
              className="text-orange-color text-center pt-3 cursor-pointer"
            >
              Back
            </p>
          </div>
        </div>
    </main>}
    </>
  )
}

export default PubicGames