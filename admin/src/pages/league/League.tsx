import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/Auth";
import axios from "axios";
import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";

import { useMutation } from "@tanstack/react-query";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Switch } from "@headlessui/react";

interface UserProps {
  id: string;
  username: string;
  current_point: number;
  phone: number;
  rank: number;
  coin: number;
}

interface priceProps {
  id: string;
  season_id: string;
  level: string | number;
  prize_name: { english: string; amharic: string };
  description: { english: string; amharic: string };
  image: string;
}

interface SeasonProps {
  id: string;
  league_id: string;
  number_of_player: string | number;
  season_name: { english: string; amharic: string };
  playing_day: string[];
  starting_date: { english: string; amharic: string };
  ending_date: { english: string; amharic: string };
  starting_time: { english: string; amharic: string };
  ending_time: { english: string; amharic: string };
  is_active: boolean;
  player_count: number | string;
  is_game_time: boolean;
  prizes: priceProps[];
  top3Player: UserProps[] | null;
}

interface LeagueProps {
  id: string;
  league_name: { english: string; amharic: string };
  min_join_point: string | number | null;
  league_price: string;
  status: boolean;
  description: { english: string; amharic: string };
  seasons: SeasonProps[] | [];
}

const League = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [changed, setChanged] = useState(0);

  const [leagues, setLeagues] = useState<Array<LeagueProps>>([]);
  const [displayLeagues, setDisplayLeagues] = useState<Array<LeagueProps>>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage - 1;
  const [totalPages, setTotalPages] = useState<number | null>(null);

  useEffect(() => {
    if (leagues.length > 0) {
      setDisplayLeagues([...leagues.slice(startIndex, endIndex + 1)]);
    }
  }, [leagues, currentPage]);

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  const leagueData = useQuery(
    ["leagueDataApi", changed],
    async () =>
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}admin/leagues`, {
        headers,
      }),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!token,
      onSuccess: (res) => {
        setLeagues(
          res?.data?.data.map((data: any, index: number) => ({
            ...data,
            index: index + 1,
          }))
        );

        setTotalPages(Math.ceil(res?.data?.data.length / itemsPerPage));
      },
    }
  );

  const updateLeaguHistoryMutation = useMutation(
    async (newData: any) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}admin/leagues/${newData.id}`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );

  const updateLeagueSubmitHandler = async (values: any) => {
    try {
      updateLeaguHistoryMutation.mutate(
        {
          _method: "patch",
          id: values.id,
          league_name: JSON.stringify({
            english: JSON.parse(values.league_name).english,
            amharic: JSON.parse(values.league_name).amharic,
          }),
          league_price: values.price ? values.price : 0,
          min_join_point: values.pts ? values.pts : 0,
          description: JSON.stringify({
            english: values.desc,
            amharic: values.descAm,
          }),
          status: values.status === "1" ? "0" : "1",
        },
        {
          onSuccess: (responseData: any) => {
            setChanged((prev) => ++prev);
          },
          onError: (err: any) => {
            alert(err?.response?.data?.data);
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const deleteLeaguHistoryMutation = useMutation(
    async (newData: any) =>
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}admin/leagues/${newData.id}`,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );

  const deleteLeagueSubmitHandler = async (id: string) => {
    try {
      deleteLeaguHistoryMutation.mutate(
        { id },
        {
          onSuccess: (responseData: any) => {
            setChanged((prev) => ++prev);
          },
          onError: (err: any) => {
            alert(err?.response?.data?.data);
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  function Row(props: { row: ReturnType<any> }) {
    const { row } = props;

    let desEn = row.description.english
      ? row.description.english === ""
        ? "-"
        : row.description.english
      : JSON.parse(row.description).english;

    let desAm = row.description.amharic
      ? row.description.amharic === ""
        ? "-"
        : row.description.amharic
      : JSON.parse(row.description).amharic;

    return (
      <React.Fragment>
        <TableRow
          sx={{
            "& > *": {
              borderBottom: "unset",
            },
          }}
        >
          <TableCell component="th" scope="row">
            <span className="cursor-pointer">{row.index}</span>
          </TableCell>
          <TableCell component="th" scope="row">
            <span className="cursor-pointer">
              {row.league_name.english
                ? row.league_name.english
                : JSON.parse(row.league_name).english}
            </span>
          </TableCell>
          <TableCell component="th" scope="row">
            <span className="cursor-pointer">
              {row.league_name.amharic
                ? row.league_name.amharic
                : JSON.parse(row.league_name).amharic}
            </span>
          </TableCell>

          <TableCell align="center">
            <span className="cursor-pointer">{desEn}</span>
          </TableCell>
          <TableCell align="center">
            <span className="cursor-pointer">{desAm}</span>
          </TableCell>
          <TableCell align="center">
            <span className="cursor-pointer">{row.league_price || "-"}</span>
          </TableCell>
          <TableCell align="center">
            <span className="cursor-pointer">{row?.min_join_point || 0}</span>
          </TableCell>

          <TableCell align="center">
            <span className="cursor-pointer">{row?.seasons.length}</span>
          </TableCell>

          <TableCell align="center">
            <Switch
              onChange={() => {
                updateLeagueSubmitHandler(row);
              }}
              checked={row.status === "1" ? true : false}
              className={`${row.status === "1" ? "bg-red-600" : "bg-[#aeaeae]"}
          relative inline-flex h-[28px] w-[63px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <span
                aria-hidden="true"
                className={`${
                  row.status === "1" ? "translate-x-9" : "translate-x-0"
                }
            pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
          </TableCell>

          <TableCell>
            <button
              onClick={() =>
                navigate(`/league/edit/${row.id}`, {
                  state: { league: row },
                })
              }
              className="bg-main-bg rounded-sm hover:opacity-80
                text-center mr-2 px-5 p-1 font-medium text-sm text-white"
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (window.confirm("are u sure you want to delete")) {
                  deleteLeagueSubmitHandler(row.id);
                }
              }}
              className="bg-red-500 rounded-sm hover:opacity-80
                text-center mr-4 px-5 p-1 mt-2 font-medium text-sm text-white"
            >
              Delete
            </button>

            <button
              onClick={() => {
                navigate(`/season/create`, {
                  state: { leagueId: row.id },
                });
              }}
              className="ml-2 bg-red-700 rounded-sm hover:opacity-80 text-center px-5 p-1 mt-2 font-medium text-sm text-white"
            >
              + Add Season
            </button>

            <button
              disabled={row.seasons.length === 0}
              onClick={() => {
                navigate(`/season/${row.id}`, {
                  state: { seasons: row.seasons },
                });
              }}
              className={
                row.seasons.length === 0
                  ? "hidden"
                  : "ml-2 border border-red-700 text-black font-bold rounded-sm hover:opacity-80 text-center px-5 p-1 mt-2  text-sm"
              }
            >
              Seasons -{row.seasons.length}
            </button>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between pb-3 w-full">
        <h3 className="font-semibold text-lg">Leagues</h3>
        <button
          onClick={() => navigate("/league/create")}
          className="bg-main-bg p-2 rounded-sm font-medium hover:opacity-80 text-white"
        >
          Add League
        </button>
      </div>

      {totalPages ? (
        <div>
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell width={25}></TableCell>
                  <TableCell width={110}>
                    <span className="font-bold text-md">Name Eng</span>
                  </TableCell>
                  <TableCell width={110}>
                    <span className="font-bold text-md">Name Amh</span>
                  </TableCell>
                  <TableCell width={150} align="center">
                    <span className="font-bold text-md">Desc Eng</span>
                  </TableCell>
                  <TableCell width={150} align="center">
                    <span className="font-bold text-md">Desc Amh</span>
                  </TableCell>
                  <TableCell width={25} align="center">
                    <span className="font-bold text-md">Price</span>
                  </TableCell>
                  <TableCell width={100} align="center">
                    <span className="font-bold text-md">Min Pts</span>
                  </TableCell>
                  <TableCell width={100} align="center">
                    <span className="font-bold text-md">Seasons</span>
                  </TableCell>

                  <TableCell width={100} align="center">
                    <span className="font-bold text-md">Status</span>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayLeagues?.map((row) => (
                  <Row key={row.id} row={row} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <section className="mt-8 w-full flex items-center justify-end gap-x-4">
            {totalPages && totalPages > 1 && currentPage !== 1 && (
              <button
                onClick={() =>
                  currentPage !== 1 && setCurrentPage((prev) => prev - 1)
                }
                className="bg-orange-300 p-2 px-5 text-white font-medium"
              >
                prev
              </button>
            )}
            {totalPages && totalPages > 1 && totalPages !== currentPage && (
              <button
                onClick={() =>
                  totalPages !== currentPage &&
                  setCurrentPage((prev) => prev + 1)
                }
                className="bg-orange-500 p-2 px-5 text-white font-medium"
              >
                next
              </button>
            )}
          </section>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <PulseLoader color="#FF4C01" />
        </div>
      )}

      {leagueData.isFetched && leagues.length === 0 && (
        <div className="mt-24 text-orange-500 w-full flex items-center justify-center">
          <p>No leagues yet</p>
        </div>
      )}
    </div>
  );
};

export default League;
