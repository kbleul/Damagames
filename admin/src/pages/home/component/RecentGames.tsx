import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      display: true,
      title: {
        font: {
          size: 12,
        },
        display: true,
        text: "Timeline",
      },
      grid: {
        display: false,
        drawBorder: false, //<- set this
      },
    },
    y: {
      display: true,

      ticks: {
        display: false,
      },
      title: {
        font: {
          size: 12,
        },
        display: true,
        text: "Number of games",
      },
      grid: {
        color: "#eeeeee",
        drawBorder: false, //<- set this
      },
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: [20, 30, 40, 80, 60, 70, 20],
      backgroundColor: [
        "#FFEAE1",
        "#FFEAE1",
        "#FFEAE1",
        "#FF4C02",
        "#FFEAE1",
        "#FFEAE1",
        "#FFEAE1",
      ],
      borderRadius: 10,
    },
  ],
};
const RecentGames = () => {
  return (
    <article className="mt-8  w-[45%]  ">
      <h2 className="text-sm text-[#949494] font-bold uppercase">
        Recent Games
      </h2>

      <section className="relative  w-full h-[51vh] bg-white mt-2 rounded-xl px-2">
        <div className="px-8 pt-4 pb-6 flex justify-between items-center">
          <p className="font-bold text-[#333333] text-lg ">
            1588
            <span className="text-xs text-[#a0aec0]">{"  "}Total Games</span>
          </p>
          <div className="rounded-md flex items-center justify-center gap-x-4 bg-[#F5F4F6] px-2 py-1">
            <button className="text-xs bg-[#FF764C] text-white  px-3 py-[0.1rem] font-semibold rounded-md">
              Month
            </button>
            <button className="text-xs bg-[#FF764C] text-white  px-3 py-[0.1rem] font-semibold rounded-md">
              Year
            </button>
          </div>
        </div>
        <Graph />
      </section>
    </article>
  );
};

const Graph = () => {
  return <Bar options={options} data={data} />;
};

export default RecentGames;
