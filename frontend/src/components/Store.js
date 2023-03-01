import { useNavigate } from "react-router-dom";

const Store = () => {
    const navigate = useNavigate();

    return (<main className="h-[100vh] text-white flex flex-col items-center ">
        <h2 className="font-bold mt-[5vh] mb-[2vh] text-2xl">Coming Soon...</h2>
        <section className="bg-orange-color mb-[6vh] w-[25%] flex items-center justify-center p-4 rounded-lg">
            <svg width="100" height="60" viewBox="0 0 72 75" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.5993 60C17.6394 60 14.4355 63.375 14.4355 67.5C14.4355 71.625 17.6394 75 21.5993 75C25.5591 75 28.799 71.625 28.799 67.5C28.799 63.375 25.5591 60 21.5993 60ZM0 0V7.5H7.19975L20.1593 35.9625L15.2995 45.15C14.7235 46.2 14.3995 47.4375 14.3995 48.75C14.3995 52.875 17.6394 56.25 21.5993 56.25H64.7978V48.75H23.1112C22.6072 48.75 22.2112 48.3375 22.2112 47.8125L22.3192 47.3625L25.5591 41.25H52.3782C55.0781 41.25 57.454 39.7125 58.678 37.3875L71.5655 13.05C71.8626 12.4777 72.012 11.8349 71.9992 11.1845C71.9865 10.534 71.812 9.89816 71.4928 9.33896C71.1736 8.77976 70.7207 8.31637 70.1782 7.99405C69.6357 7.67173 69.0222 7.5015 68.3977 7.5H15.1555L11.7716 0H0ZM57.598 60C53.6382 60 50.4343 63.375 50.4343 67.5C50.4343 71.625 53.6382 75 57.598 75C61.5579 75 64.7978 71.625 64.7978 67.5C64.7978 63.375 61.5579 60 57.598 60Z" fill="#191921" />
            </svg>
        </section>
        <section className="w-[80%] ">
            <p className="text-gray-300 mb-8">Improve your gaming experience by spending your coins on unique avatars,
                gaming boards, and pawns.</p>
            <p className="text-gray-300 mb-8">Adding an extra layer of excitement for you as you look forward to exploring
                the new features.</p>
            <p className="text-gray-300 mb-12">Personalized and distinctive look for your gaming experience
                by purchasing items from the store.</p>
        </section>
        <section>
            <button className="bg-orange-color rounded-lg px-4 py-2 hover:cursor-pointer focus:cursor-pointer"
                onClick={() => navigate("/create-game")}>Go Back</button>
        </section>
    </main>)
}

export default Store;