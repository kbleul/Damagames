import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../context/Auth";
import axios from "axios";
import React, { useState, useEffect } from "react";

import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useMutation } from "@tanstack/react-query";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Switch } from "@headlessui/react";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";

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

const Season = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const seasons = location.state?.seasons;
  console.log(seasons);
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const deleteLeaguHistoryMutation = useMutation(
    async (newData: any) =>
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}admin/seasons/${newData.id}`,
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
            navigate(-1);
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

  const updateSeasonHistoryMutation = useMutation(
    async (newData: any) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}admin/seasons/${newData.id}`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );
  const updateSeasonSubmitHandler = async (values: any) => {
    console.log(values);
    try {
      values.status = 1;
      updateSeasonHistoryMutation.mutate(
        {
          _method: "PATCH",
          id: values.id,
          league_id: values.league_id,
          season_name: values.season_name,
          starting_date: values.starting_date,
          ending_date: values.ending_date,
          starting_time: values.starting_time,
          ending_time: values.ending_time,
          number_of_player: values.number_of_player,
          playing_day: values.playing_day,
          season_price: values.season_price,
          is_active: !values.is_active,
        },
        {
          onSuccess: (responseData: any) => {
            navigate(-1);
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
    const [open, setOpen] = React.useState(false);

    return (
      <React.Fragment>
        <TableRow
          sx={{
            "& > *": {
              borderBottom: "unset",
            },
          }}
        >
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <AiOutlineArrowUp /> : <AiOutlineArrowDown />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            <span className="cursor-pointer">{row.index}</span>
          </TableCell>
          <TableCell component="th" scope="row">
            <span className="cursor-pointer">
              {row.season_name.english
                ? row.season_name.english
                : JSON.parse(row.season_name).english}
            </span>
          </TableCell>
          <TableCell component="th" scope="row">
            <span className="cursor-pointer">
              {row.season_name.amharic
                ? row.season_name.amharic
                : JSON.parse(row.season_name).amharic}
            </span>
          </TableCell>

          <TableCell align="center">
            <span className="cursor-pointer">
              {row.starting_date.amharic
                ? row.starting_date.amharic
                : JSON.parse(row.starting_date).amharic}{" "}
              -
              {row.ending_date.amharic
                ? row.ending_date.amharic
                : JSON.parse(row.ending_date).amharic}
            </span>
          </TableCell>

          <TableCell align="center">
            <span className="cursor-pointer">
              {row.starting_time.amharic
                ? row.starting_time.amharic
                : JSON.parse(row.starting_time).amharic}{" "}
              -
              {row.ending_time.amharic
                ? row.ending_time.amharic
                : JSON.parse(row.ending_time).amharic}
            </span>
          </TableCell>
          <TableCell align="center">
            <span className="cursor-pointer">
              {JSON.parse(row.playing_day).map((day: string, index: number) => (
                <span>{day} </span>
              ))}
            </span>
          </TableCell>
          <TableCell align="center">
            <span className="cursor-pointer">
              {row.coin_amount ? row.coin_amount : 0}
            </span>
          </TableCell>
          <TableCell align="center">
            <span className="cursor-pointer">{row.number_of_player}</span>
          </TableCell>
          <TableCell align="center">
            <span className="cursor-pointer">{row.player_count}</span>
          </TableCell>
          <TableCell align="center">
            <Switch
              onChange={() => {
                updateSeasonSubmitHandler(row);
              }}
              checked={row.is_active}
              className={`${row.is_active ? "bg-red-400" : "bg-[#aeaeae]"}
  relative inline-flex h-[16px] w-[31.5px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <span
                aria-hidden="true"
                className={`${row.is_active ? "translate-x-4" : "translate-x-0"}
    pointer-events-none inline-block h-[12px] w-[12px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
          </TableCell>
          <TableCell align="center">
            <Switch
              checked={row.is_game_time}
              className={`${row.is_game_time ? "bg-green-400" : "bg-[#aeaeae]"}
  relative inline-flex h-[16px] w-[31.5px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <span
                aria-hidden="true"
                className={`${
                  row.is_game_time ? "translate-x-4" : "translate-x-0"
                }
    pointer-events-none inline-block h-[12px] w-[12px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
          </TableCell>

          <TableCell>
            <button
              onClick={() =>
                navigate(`/season/edit`, {
                  state: { season: row },
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
                row.prizes.length === 0
                  ? navigate(`/awards/create/${row.id}`, {
                      state: { awards: row.prizes },
                    })
                  : navigate(`/awards/${row.id}`, {
                      state: { awards: row.prizes },
                    });
              }}
              className="border-2 border-red-600 text-red-600 rounded-sm hover:opacity-80
                text-center ml-2 px-5 p-1 mt-2 font-medium text-sm"
            >
              Awards
            </button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Awards</TableCell>
                      <TableCell align="center">Date</TableCell>
                      <TableCell align="center">Date ET</TableCell>
                      <TableCell align="center">Time</TableCell>
                      <TableCell align="center">Time ET</TableCell>
                      {/* <TableCell align="center">completed</TableCell>
                      <TableCell align="center">incomplete</TableCell>
                      <TableCell align="center">play with computer</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        width={350}
                        component="td"
                        scope="row"
                        align="center"
                      >
                        {row.prizes.map((prize: any) => (
                          <span className="block" key={prize.id}>
                            {prize.level}-{" "}
                            {JSON.parse(prize.prize_name).english} /{" "}
                            {JSON.parse(prize.prize_name).amharic}{" "}
                          </span>
                        ))}
                      </TableCell>
                      <TableCell
                        width={350}
                        component="th"
                        scope="row"
                        align="center"
                      >
                        {JSON.parse(row.starting_date).amharic +
                          " / " +
                          JSON.parse(row.ending_date).amharic}
                      </TableCell>
                      <TableCell
                        width={350}
                        component="th"
                        scope="row"
                        align="center"
                      >
                        {JSON.parse(row.starting_date).english +
                          " / " +
                          JSON.parse(row.ending_date).english}
                      </TableCell>
                      <TableCell
                        width={350}
                        component="td"
                        scope="row"
                        align="center"
                      >
                        {JSON.parse(row.starting_time).english +
                          " - " +
                          JSON.parse(row.ending_time).english}
                      </TableCell>
                      <TableCell
                        width={350}
                        component="td"
                        scope="row"
                        align="center"
                      >
                        {JSON.parse(row.starting_time).amharic +
                          " - " +
                          JSON.parse(row.ending_time).amharic}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  return (
    <div>
      <div>
        <div className="flex items-center justify-between pb-3 w-full">
          <h3 className="font-semibold text-lg">Seasons</h3>
          <button
            onClick={() =>
              navigate("/season/create", {
                state: { leagueId: id },
              })
            }
            className="bg-main-bg p-2 rounded-sm font-medium hover:opacity-80 text-white"
          >
            Add Season
          </button>
        </div>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell width={15}></TableCell>

                <TableCell width={15}></TableCell>
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
                  <span className="font-bold text-md">Days</span>
                </TableCell>
                <TableCell width={100} align="center">
                  <span className="font-bold text-md">Min Pts</span>
                </TableCell>
                <TableCell width={100} align="center">
                  <span className="font-bold text-md">Total Players</span>
                </TableCell>
                <TableCell width={100} align="center">
                  <span className="font-bold text-md">Current Players</span>
                </TableCell>
                <TableCell width={100} align="center">
                  <span className="font-bold text-md">Status</span>
                </TableCell>

                <TableCell align="center">
                  <span className="font-bold text-md">Active Now</span>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {seasons?.map((row: SeasonProps, index: number) => (
                <Row key={row.id} row={{ ...row, index: ++index }} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* <section className="mt-8 w-full flex items-center justify-end gap-x-4">
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
                totalPages !== currentPage && setCurrentPage((prev) => prev + 1)
              }
              className="bg-orange-500 p-2 px-5 text-white font-medium"
            >
              next
            </button>
          )}
        </section> */}
      </div>
    </div>
  );
};

export default Season;
