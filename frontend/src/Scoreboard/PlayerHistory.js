
import React, { useState, useEffect } from 'react'
import { useAuth } from "../context/auth";
import axios from 'axios'

const PlayerHistory = ({ playerName }) => {

  const [history, setHistory] = useState({})

  const { token } = useAuth();

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer  ${token}`
  };

  const getHistory = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}match-history`, { headers })

      setHistory(response.data.data)
    } catch (error) { }
  }

  useEffect(() => { token && getHistory() }, [])



  return (<>{Object.keys(history).length > 0 &&

    <article className="h-[53vh] overflow-y-hidden flex flex-col justify-end items-end relative">

      <section className="absolute top-8 w-full flex justify-center items-end text-white pt-3" >
        <div className='w-4/5 max-w-[600px] border border-gray-400 rounded-[2rem] pt-8 pb-12 flex flex-col items-center' style={{
          background: `linear-gradient(120deg, rgb(39, 138, 134) 1%, rgba(11, 42, 43, 0.32) 10%, rgb(22, 85, 82) 98%) repeat scroll 0% 0%`
        }}>
          <h5 className='absolute top-0 px-8 rounded-md border bg-teal-500'>{history.rank}</h5>
          <h2 className='font-bold text-center  text-lg'>{playerName}</h2>
          <div className="py-2 flex justify-between text-sm w-4/5 border-b border-orange-400 pr-1 font-bold">
            <h4>Games Played</h4>
            <p>{history.played}</p>
          </div>
          <div className="py-2 flex justify-between text-sm w-4/5 border-b border-orange-400 pr-1">
            <h4>Wins</h4>
            <p>{history.wins}</p>
          </div>
          <div className="py-2 flex justify-between text-sm w-4/5 border-b border-orange-400 pr-1">
            <h4>Draws</h4>
            <p>{history.draw}</p>
          </div>
          <div className="py-2 flex justify-between text-sm w-4/5 border-b border-orange-400 pr-1">
            <h4>Losses</h4>
            <p>{history.losses}</p>
          </div>
          <div className="py-2 flex justify-between text-sm w-4/5 border-b border-orange-400 pr-1">
            <h4>Coins</h4>
            <p>{history.coins}</p>
          </div>

        </div>
      </section>

    </article>
  }

  </>
  )
}

export default PlayerHistory

