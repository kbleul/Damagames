import { useState } from "react"
import { AiFillStar } from "react-icons/ai"
import PaymentOptions from "./PaymentOptions"
import PaymentPrompt from "./PaymentPrompt"

const LeaguesCard = ({ league }) => {

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
    const [isPaymentPromptModalOpen, setIsPaymentPromptModalOpen] = useState(false)

    //payment choices
    const [selectedMethod, setSelectedMethod] = useState(null)


    return (
        <article className="bg-[#2B5A64] relative border-2 overflow-hidden border-gray-200 rounded-2xl flex items-center justify-center mt-6 mb-2 mx-[5%] max-w-[500px] text-white text-center">
            <section className="absolute top-0 left-0 w-2/5 h-full z-0">
                <img className="h-[10rem] rounded-2xl" src={league.img} alt="" />
                <div style={{
                    background: `linear-gradient(270deg, #2B5A64 0%, rgba(42, 89, 99, 0.5) 100%)`
                }} className="w-full h-full absolute top-0 "></div>
            </section>
            <section className="relative z-10 w-full flex flex-col items-center py-2">
                <h4 className="text-xl font-bold">{league.name}</h4>
                <p className="text-sm font-bold">{league.playerCount} Players</p>
                <div>
                    <p className="text-xs ">{league.date}</p>
                    <p className="text-xs">{league.time}</p>
                </div>

                <div className="w-full flex justify-evenly items-center">
                    <button
                        className="w-2/5 bg-gradient-to-b from-orange-500 to-orange-700 rounded-full my-2 py-2 font-semibold text-sm text-black">View Details
                    </button>
                    <button onClick={() => setIsPaymentModalOpen(true)}
                        className="w-2/5 flex items-center gap-x-1 bg-gradient-to-b from-orange-500 to-orange-700 rounded-full my-2 py-2 font-semibold text-sm text-black">
                        <p className="w-4/5 text-right ">Join League</p>
                        <p><AiFillStar className="text-white" /></p>
                    </button>
                </div>
            </section>

            <PaymentOptions
                isPaymentModalOpen={isPaymentModalOpen}
                setIsPaymentModalOpen={setIsPaymentModalOpen}
                setIsPaymentPromptModalOpen={setIsPaymentPromptModalOpen}
                selectedMethod={selectedMethod}
                setSelectedMethod={setSelectedMethod} />
            <PaymentPrompt
                isPaymentPromptModalOpen={isPaymentPromptModalOpen}
                setIsPaymentPromptModalOpen={setIsPaymentPromptModalOpen}
                selectedMethod={selectedMethod}
                setIsPaymentModalOpen={setIsPaymentModalOpen}
            />

        </article>
    )
}

export default LeaguesCard