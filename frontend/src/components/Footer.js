
import { useNavigate } from "react-router-dom";

export const Footer = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full bg-inherit absolute top-[95vh] text-white">
            <a onClick={() => navigate("/privacy-policy")} className="text-xs text-gray-200 cursor-pointer">Privacy Policy |  v1.0.0</a>
        </div>
    )
}


