
import React , {useState} from 'react'
import { useAuth } from "../context/auth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";



const SideMenu = () => {
    const navigate = useNavigate();
    const { user, token , logout } = useAuth();
    const [showMenu , setShowMenu] = useState(false)

    const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
    };

    const userLogOut = () => {
        handleLogout();
        logout();
        navigate("/create-game")
      };

      const logOutMutation = useMutation(
        async (newData) =>
          await axios.post(`${process.env.REACT_APP_BACKEND_URL}logout`, newData, {
            headers,
          }),
        {
          retry: false,
        }
      );

    const handleLogout = async (values) => {
        try {
          logOutMutation.mutate(
            {},
            {
              onSuccess: (responseData) => {
                console.log(responseData?.data?.data);
              },
              onError: (err) => {},
            }
          );
        } catch (err) {
          console.log(err);
        }
      };

  return (<>
    {user && token ? <div className="absolute top-0 flex flex-col w-full justify-end items-end w-[90%] mt-[3vh] ml-[5%]">
      <button className='mb-4' onClick = {() => setShowMenu(prev => !prev)}>
        <svg width="30" height="12" viewBox="0 0 24 6" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M21.277 2.41446e-05L20.6204 2.41159e-05C20.5673 0.0142871 20.519 0.0380588 20.4659 0.0475675C19.0851 0.256758 17.994 1.38829 17.9023 2.71473C17.796 4.19808 18.6554 5.45323 20.0555 5.8621C20.239 5.9144 20.4321 5.95243 20.6204 5.99998L21.277 5.99998C21.3205 5.98571 21.3591 5.96194 21.4074 5.95719C22.6819 5.75275 23.6524 4.84943 23.9276 3.6133C23.9469 3.51821 23.9759 3.42313 24 3.32804L24 2.68145C23.9855 2.63866 23.9614 2.59587 23.9565 2.55308C23.7538 1.31695 22.8606 0.375617 21.6198 0.0903331C21.4991 0.0618071 21.388 0.0285502 21.277 2.41446e-05ZM2.71815 6L3.37481 5.99998C3.42792 5.98571 3.4762 5.96194 3.52931 5.95719C4.91978 5.74324 6.00608 4.60695 6.09299 3.26623C6.18955 1.78763 5.3205 0.53724 3.91555 0.133121C3.73689 0.0808233 3.55345 0.0427892 3.37479 1.47517e-07L2.71818 1.18815e-07C2.67472 0.0142631 2.6361 0.0380348 2.59265 0.0475435C1.33736 0.275752 0.516598 0.993656 0.125528 2.19175C0.0724202 2.34864 0.0434521 2.51504 -1.17002e-07 2.67669L-1.45265e-07 3.32328C0.0144839 3.36607 0.0386241 3.40886 0.0434521 3.45165C0.251057 4.69253 1.13941 5.62914 2.38021 5.9144C2.49609 5.94295 2.60713 5.97147 2.71815 6ZM11.6693 5.99998L12.3259 5.99998C12.379 5.98571 12.4273 5.96194 12.4804 5.95243C13.8661 5.73849 14.9814 4.55941 15.0393 3.2282C15.1069 1.73058 14.1896 0.461171 12.7749 0.104596C12.6253 0.0665612 12.4756 0.0332809 12.3259 5.38784e-07L11.6693 5.10083e-07C11.6162 0.0142635 11.5679 0.0380352 11.5148 0.0475439C10.1292 0.256735 9.01389 1.44056 8.95115 2.77178C8.87873 4.2694 9.80088 5.53881 11.2155 5.89538C11.37 5.93342 11.5197 5.9667 11.6693 5.99998Z" fill="#FF4C01"/>
        </svg>
      </button>
      
     { showMenu && <ul  className="font-bold ml-12 z-10 ml-24 w-[50%] max-w-[10rem] border border-orange-color border-b-0 text-orange-color cursor-pointer">
        <li className='text-orange-color hover:text-black py-2 w-full border-b border-orange-color hover:border-black hover:bg-orange-color'
         onClick={() => { 
            setShowMenu(false);
            navigate("/profile")
        }}>Profile</li> 
        <li className='text-orange-color hover:text-black py-2 w-full border-b border-orange-color hover:border-black hover:bg-orange-color' 
        onClick={() => { 
            userLogOut() 
        }}>Logout</li> 
      </ul> }
    </div> : <></>}
    </>
  )
}

export default SideMenu