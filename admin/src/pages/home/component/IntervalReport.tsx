import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../context/Auth";
import axios from "axios";
import { PulseLoader } from "react-spinners";

import { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import IntervalReportTable from "./IntervalReportTable";
import IntervalDateSelector from "./IntervalDateSelector";

const catagories = [
  "With Computer Verified",
  "With Computer Unverified",
  "User Games",
];
const IntervalReport = () => {
  const { token, logout } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState(catagories[0]);

  const [userGames, setUserGames] = useState([]);
  const [withComputerVerified, setWithComputerVerified] = useState<object[]>(
    []
  );
  const [withComputerunverified, setWithComputerunverified] = useState([]);

  const [startingDate, setStartingDate] = useState("");
  const [endingDate, setEndingDate] = useState("");

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    intervalReportSubmitHandler();
  }, [endingDate]);

  const intervalReportMutation = useMutation(
    (newData: any) =>
      axios.post(
        `${process.env.REACT_APP_BACKEND_URL}admin/interval-game-report`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );
  const intervalReportSubmitHandler = async () => {
    try {
      intervalReportMutation.mutate(
        {
          start_date: startingDate,
          end_date: endingDate,
        },
        {
          onSuccess: (responseData: any) => {
            console.log(responseData.data.data);
            setUserGames(responseData.data.data.games);
            setWithComputerVerified([...responseData.data.data.computer_games]);
            setWithComputerunverified(responseData.data.data.computer_game_nas);
          },
          onError: (err: any) => {
            alert(err?.response?.data?.data);
          },
        }
      );
    } catch (err: any) {
      console.log(err);
    }
  };
  function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <article className="mt-12">
      <h2 className="font-mono text-2xl">Games Played</h2>

      <IntervalDateSelector
        setStartingDate={setStartingDate}
        setEndingDate={setEndingDate}
      />

      {selectedCategory === catagories[0] && (
        <div className="py-3 ">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
              {catagories.map((category) => (
                <Tab
                  key={category}
                  className={({ selected }) =>
                    classNames(
                      "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                      "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                      selectedCategory === category
                        ? "bg-white shadow"
                        : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                    )
                  }
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-2">
              <Tab.Panel>
                <div className="flex flex-col items-start space-y-2 w-full">
                  {intervalReportMutation.isSuccess ? (
                    <IntervalReportTable
                      data={withComputerunverified}
                      selectedCategory={selectedCategory}
                    />
                  ) : (
                    <div className="flex items-center justify-center">
                      <PulseLoader color="#06b6d4" />
                    </div>
                  )}
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      )}

      {selectedCategory === catagories[1] && (
        <div className="py-3 ">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
              {catagories.map((category) => (
                <Tab
                  key={category}
                  className={({ selected }) =>
                    classNames(
                      "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                      "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                      selectedCategory === category
                        ? "bg-white shadow"
                        : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                    )
                  }
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-2">
              <Tab.Panel>
                <div className="flex flex-col items-start space-y-2 w-full">
                  {intervalReportMutation.isSuccess ? (
                    <IntervalReportTable
                      data={withComputerVerified}
                      selectedCategory={selectedCategory}
                    />
                  ) : (
                    <div className="flex items-center justify-center">
                      <PulseLoader color="#06b6d4" />
                    </div>
                  )}
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      )}

      {selectedCategory === catagories[2] && (
        <div className="py-3 ">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
              {catagories.map((category) => (
                <Tab
                  key={category}
                  className={({ selected }) =>
                    classNames(
                      "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                      "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                      selectedCategory === category
                        ? "bg-white shadow"
                        : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                    )
                  }
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-2">
              <Tab.Panel>
                <div className="flex flex-col items-center space-y-2 w-full">
                  {intervalReportMutation.isSuccess ? (
                    <IntervalReportTable
                      data={userGames}
                      selectedCategory={selectedCategory}
                    />
                  ) : (
                    <div className="flex items-center justify-center">
                      <PulseLoader color="#FF4C01" />
                    </div>
                  )}
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      )}
    </article>
  );
};

export default IntervalReport;
