
import { useNavigate } from "react-router-dom";
import VERSION from "../version";
export const Footer = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full bg-inherit text-white text-center mt-16">
            <button onClick={() => navigate("/privacy-policy")} className="text-xs text-gray-200 cursor-pointer">Privacy Policy | {VERSION}</button>
        </div>
    )
}


