import React from "react";
import { useNavigate } from "react-router-dom";

const Boards = () => {
    const navigate = useNavigate()
  return (
    <div className="flex items-center justify-between pb-3 w-full">
      <h3 className="font-semibold text-lg">Boards</h3>
      <button
          onClick={() => navigate('/board/create')}
        className="bg-main-bg p-2 rounded-sm font-medium hover:opacity-80 text-white"
      >
        Add Board
      </button>
    </div>
  );
};

export default Boards;
