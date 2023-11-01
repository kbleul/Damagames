import { HiUsers } from "react-icons/hi";
import { FaUserCheck } from "react-icons/fa";
import { FaUserTimes } from "react-icons/fa";

const Users: React.FC<{
  totalUsers: number;
  subscribedUsers: number;
}> = ({ totalUsers, subscribedUsers }) => {
  return (
    <article className="mt-8">
      <h2 className=" text-[#949494] font-bold">Users</h2>

      <section className="w-full flex justify-between items-center">
        <Card title="Total Users" amount={totalUsers} index={1} />
        <Card title="Registered Users" amount={subscribedUsers} index={2} />
        <Card
          title="Unregistered Users"
          amount={totalUsers - subscribedUsers}
          index={3}
        />
      </section>
    </article>
  );
};

const Card: React.FC<{
  title: string;
  amount: number;
  index: number;
}> = ({ title, amount, index }) => {
  const getIcon = () => {
    switch (index) {
      case 1:
        return <HiUsers color="white" size={28} />;

      case 2:
        return <FaUserCheck color="white" size={28} />;
      case 3:
        return <FaUserTimes color="white" size={28} />;

      default:
        break;
    }
  };
  return (
    <section className="w-[30%] flex justify-between items-center rounded-lg bg-white px-8 mt-2 py-1">
      <div className="py-4">
        <p className="text-[#A0AEC0] text-sm font-semibold">{title}</p>
        <p className="font-bold mt-2">{amount}</p>
      </div>
      <div className="w-[45px] h-[45px] bg-[#FF6D56] rounded-lg flex items-center justify-center">
        {getIcon()}
      </div>
    </section>
  );
};

export default Users;
