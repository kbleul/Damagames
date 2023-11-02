import totalImg from "../../../assets/totalImg.svg";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type dataType = {
  labels: string[];
  hidden: boolean;
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
};
const options: ChartOptions<"doughnut"> = {
  plugins: {
    legend: {
      display: false, // Set to false to hide the labels
    },
    tooltip: {
      enabled: true,
    },
  },
  cutout: "70%",
  responsive: true,
  maintainAspectRatio: false,
};

export const dataOne = {
  labels: ["Avatar", "Boards", "Crowns"],
  hidden: false,
  datasets: [
    {
      data: [24, 17, 38],
      backgroundColor: ["#AE4A21", "#FFA078", "#5E2209"],
      borderColor: ["#AE4A21", "#FFA078", "#5E2209"],
      borderWidth: 1,
    },
  ],
};

export const dataTwo = {
  labels: ["Red", "Blue"],
  hidden: true,
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19],
      backgroundColor: ["#AE4A21", "#FFA078"],
      borderColor: ["#AE4A21", "#FFA078"],
      borderWidth: 1,
    },
  ],
};

const FinancialAssets = () => {
  return (
    <article className=" w-full mt-8 ">
      <h2 className="text-sm text-[#949494] font-bold uppercase">
        Financial Statistics
      </h2>

      <section className="flex items-center justify-between w-full ">
        <Total total={2500} />
        <Chart title="Assets" data={dataOne} />
        <Chart title="Leagues" data={dataTwo} />
      </section>
    </article>
  );
};

const Total: React.FC<{ total: number }> = ({ total }) => {
  return (
    <article className="w-[25%]  mt-2 p-4   rounded-xl bg-white">
      <h3 className="text-[#A0AEC0] text-xs font-semibold">
        Total In app Income
      </h3>
      <p className="text-2xl font-semibold mt-1">
        280,67.50<span>birr</span>
      </p>
      <div className="flex items-center justify-center mt-4">
        <img src={totalImg} alt="" className="w-24 h-28" />
      </div>
    </article>
  );
};

const Chart: React.FC<{ title: string; data: dataType }> = ({
  title,
  data,
}) => {
  const style: {
    [key: number]: string;
  } = {
    0: `w-4 h-4  rounded-sm bg-[#AE4A21]`,
    1: `w-4 h-4  rounded-sm bg-[#FFA078]`,
    2: `w-4 h-4  rounded-sm bg-[#5E2209]`,
  };

  return (
    <article className="w-[35%] h-[14rem] mt-2 p-4 bg-white rounded-xl">
      <h3 className="text-[#A0AEC0] text-xs font-semibold">{title}</h3>
      <section className="w-full flex">
        <div className="w-1/2 h-[11rem] flex items-center justify-center relative">
          <Doughnut data={data} options={options} />
          <div className="absolute top-[40%]">
            <p className="text-xs  text-center">Total</p>
            <p className="text-xs ">
              <span className="font-bold">50,000,000</span> birr
            </p>
          </div>
        </div>
        <div className="w-1/2  pl-2 flex flex-col justify-center gap-y-2">
          {data.labels.map((item, index) => (
            <div
              key={item + "==" + index}
              className="flex items-center gap-x-2 pb-1"
            >
              <p className={style[index]}></p>

              <p className="text-sm">
                {item} -{" "}
                <span className="font-bold">
                  {data.datasets[0].data[index]}500
                </span>{" "}
                birr
              </p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
};

export default FinancialAssets;
