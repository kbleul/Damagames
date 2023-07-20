import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../../../context/Auth";
import { Tab } from "@headlessui/react";

import { PulseLoader } from "react-spinners";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const Awards = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const AWARDS = location.state.awards;

  const { token, user } = useAuth();

  const [awards, setAwards] = useState([...AWARDS]);

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const deleteAwardHistoryMutation = useMutation(
    async (newData: any) =>
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}admin/prizes/${newData.id}`,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );

  const deleteAwardSubmitHandler = async (awardId: string) => {
    try {
      deleteAwardHistoryMutation.mutate(
        { id: awardId },
        {
          onSuccess: (responseData: any) => {
            // setChanged((prev) => ++prev);
            setAwards((prev) =>
              prev.filter((award: any) => award.id !== awardId)
            );
          },
          onError: (err: any) => {
            // alert(err?.response?.data?.data);
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  function Row(props: { row: ReturnType<any> }) {
    const { row } = props;

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
              {row.prize_name.english
                ? row.prize_name.english
                : JSON.parse(row.prize_name).english}
            </span>
          </TableCell>
          <TableCell component="th" scope="row">
            <span className="cursor-pointer">
              {row.prize_name.amharic
                ? row.prize_name.amharic
                : JSON.parse(row.prize_name).amharic}
            </span>
          </TableCell>

          <TableCell align="center">
            <span className="cursor-pointer">
              {row.description.amharic
                ? row.description.amharic
                : JSON.parse(row.description).amharic}
            </span>
          </TableCell>
          <TableCell align="center">
            <span className="cursor-pointer">
              {row.description.english
                ? row.description.english
                : JSON.parse(row.description).english}
            </span>
          </TableCell>

          <TableCell align="center">
            {row.image ? (
              <div className="w-full flex items-center justify-center">
                <img
                  src={row.image}
                  alt=""
                  className="cursor-pointer w-8 h-8"
                />
              </div>
            ) : (
              <p className="w-6 h-6"></p>
            )}
          </TableCell>

          <TableCell>
            <button
              onClick={() =>
                navigate(`/awards/edit/${row.id}`, {
                  state: { awards: row },
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
                  deleteAwardSubmitHandler(row.id);
                }
              }}
              className="bg-red-500 rounded-sm hover:opacity-80
                text-center mr-4 px-5 p-1 mt-2 font-medium text-sm text-white"
            >
              Delete
            </button>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  return (
    <article>
      <div>
        <div className="flex items-center justify-between pb-3 w-full">
          <h3 className="font-semibold text-lg">Season Awards</h3>
          <button
            onClick={() =>
              navigate(`/awards/create/${AWARDS[0].season_id}`, {
                state: { awards: [...AWARDS] },
              })
            }
            className="bg-main-bg p-2 rounded-sm font-medium hover:opacity-80 text-white"
          >
            Add Awards
          </button>
        </div>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell width={25} align="center">
                  <span className="font-bold text-md">Rank</span>
                </TableCell>
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

                <TableCell width={100} align="center">
                  <span className="font-bold text-md">Image</span>
                </TableCell>
                <TableCell width={100} align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {awards?.map((award: any, index) => (
                <Row key={award.id} row={{ ...award, index: ++index }} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </article>
  );
};

export default Awards;
