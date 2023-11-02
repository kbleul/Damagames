import React from "react";
import { ImUsers } from "react-icons/im";
import { FaUserCheck } from "react-icons/fa";
import { FiMonitor } from "react-icons/fi";
import { FaUsers } from "react-icons/fa";

const Games: React.FC<{
  totalUsers: number;
  subscribedUsers: number;
}> = ({ totalUsers, subscribedUsers }) => {
  return (
    <article className="mt-8 ">
      <h2 className="text-sm text-[#949494] font-bold uppercase">Games</h2>

      <section className="w-full flex justify-evenly items-center bg-white py-2 pb-4 rounded-xl mt-2">
        <Card
          title="Total Users"
          amount={totalUsers}
          index={1}
          registeredUsers={5}
          unRegisteredUsers={5}
        />
        <Card
          title="Played with Computer"
          amount={totalUsers}
          index={2}
          registeredUsers={5}
          unRegisteredUsers={5}
        />
        <Card
          title="Played with Friends"
          amount={totalUsers}
          index={3}
          registeredUsers={5}
          unRegisteredUsers={5}
        />
        <Card
          title="Played with Public"
          amount={totalUsers}
          index={4}
          registeredUsers={5}
          unRegisteredUsers={5}
        />
      </section>
    </article>
  );
};

const Card: React.FC<{
  title: string;
  amount: number;
  index: number;
  registeredUsers: number;
  unRegisteredUsers: number;
}> = ({ title, amount, index, registeredUsers, unRegisteredUsers }) => {
  const getIcon = () => {
    switch (index) {
      case 1:
        return <FaUserCheck color="#FF6D56" size={24} />;

      case 2:
        return <FiMonitor color="red" size={24} />;
      case 3:
        return <ImUsers color="#FF6D56" size={24} />;

      case 4:
        return <FaUsers color="#FF6D56" size={24} />;

      default:
        break;
    }
  };
  return (
    <section className="w-[23%] flex flex-col justify-between items-center rounded-xl bg-[#F6F6F6]  mt-2 px-4 py-3 border border-[#FE7E6A]">
      <div className="py-2 flex items-center justify-between w-full">
        <div className="flex justify-start items-center gap-x-2">
          {getIcon()}
          <h3 className="text-[#A0AEC0] text-xs font-semibold">{title}</h3>
        </div>

        <p className="font-bold ">{amount}</p>
      </div>
      <div className="py-2 flex items-center justify-between w-full px-4 bg-[#F7E4E1] rounded-lg mt-1">
        <p className="text-[#333333] text-sm ">Registered Users</p>
        <p className="font-bold">{registeredUsers}</p>
      </div>
      <div className="py-2 flex items-center justify-between w-full px-4 bg-[#F7E4E1] rounded-lg mt-2">
        <p className="text-[#333333] text-sm ">unregistered Users</p>
        <p className="font-bold">{unRegisteredUsers}</p>
      </div>
    </section>
  );
};

export default Games;
