import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../../context/Auth";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import { PulseLoader } from "react-spinners";
interface UserProps {
  id: string;
  username: string;
  current_point: number;
  phone: number;
  rank: number;
  coin: number;
}
const Users = () => {
  const { token, user } = useAuth();
  const [users, setUsers] = useState<Array<UserProps>>([]);
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  const usersData = useQuery(
    ["usersDataApi"],
    async () =>
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}admin/users`, {
        headers,
      }),
    {
      keepPreviousData: false,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!token,
      onSuccess: (res) => {
        console.log(res?.data?.data?.users);
        setUsers(
          res?.data?.data?.users?.map((data: any, index: number) => ({
            ...data,
            index: index + 1,
          }))
        );
      },
    }
  );
  console.log(users);

  function Row(props: { row: ReturnType<any> }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    console.log({ row });
    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
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
            {row.username}
          </TableCell>
          <TableCell align="center">{row.rank}</TableCell>
          <TableCell align="center">{row?.phone}</TableCell>
          <TableCell align="center">{row.current_point}</TableCell>
          <TableCell align="center">{row.coin}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  match_history
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">coins</TableCell>
                      <TableCell align="center">draw</TableCell>
                      <TableCell align="center">losses</TableCell>
                      <TableCell align="center">played</TableCell>
                      <TableCell align="center">wins</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell component="td" scope="row" align="center">
                        {row.match_history?.coins}
                      </TableCell>
                      <TableCell component="th" scope="row" align="center">
                        {row.match_history?.draw}
                      </TableCell>
                      <TableCell component="th" scope="row" align="center">
                        {row.match_history?.losses}
                      </TableCell>
                      <TableCell component="th" scope="row" align="center">
                        {row.match_history?.played}
                      </TableCell>
                      <TableCell component="td" scope="row" align="center">
                        {row.match_history?.wins}
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
      {usersData.isFetched ? (
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell width={300}>userName</TableCell>
                <TableCell width={100} align="center">
                  Rank
                </TableCell>
                <TableCell width={200} align="center">
                  Phone
                </TableCell>
                <TableCell align="center">current Point</TableCell>
                <TableCell align="center">coin</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.map((row) => (
                <Row key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div className="flex items-center justify-center">
          <PulseLoader color="#FF4C01" />
        </div>
      )}
    </div>
  );
};

export default Users;
