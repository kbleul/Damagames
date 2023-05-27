import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { PulseLoader } from "react-spinners";
import { useAuth } from "../../context/Auth";
import {
  DataGrid,
  GridColDef,
  GridCellParams,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import CoinEditModal from "./components/CoinEditModal";

interface CoinsProps {
  drawCoins: number;
  id: string;
  looserCoins: number;
  newUserCoins: number;
  winnerCoins: number;
}
const CoinSetting = () => {
  const [coins, setCoins] = useState<Array<CoinsProps>>([]);
  const [isEditCoinModalOpen, setIsEditCoinModalOpen] =
    useState<boolean>(false);
  const { token } = useAuth();
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  const coinsData = useQuery(
    ["coinsDataApi",isEditCoinModalOpen],
    async () =>
      await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}admin/coin-settings`,
        {
          headers,
        }
      ),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!token,
      onSuccess: (res) => {
        setCoins(
          [res?.data?.data]?.map((data: any, index: number) => ({
            ...data,
            index: index + 1,
          }))
        );
      },
    }
  );


  const columns: GridColDef[] = [
    { field: "index", headerName: "ID", width: 110 },
    {
      field: "drawCoins",
      headerName: "drawCoins",
      width: 180,
      sortable: false,
      filterable: false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "looserCoins",
      headerName: "looserCoins",
      width: 170,
      sortable: false,
      filterable: false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "newUserCoins",
      headerName: "newUserCoins",
      width: 170,
      sortable: false,
      filterable: false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "winnerCoins",
      headerName: "winnerCoins",
      width: 170,
      sortable: false,
      filterable: false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "action",
      headerName: "action",
      width: 230,
      renderCell: (params: GridCellParams) => {
        return (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditCoinModalOpen(true)}
              className="bg-main-bg rounded-sm hover:opacity-80
                text-center px-10 p-1 font-medium text-sm text-white"
            >
              Edit
            </button>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <div className="flex items-center justify-between pb-3 w-full">
        <h3 className="font-semibold text-lg">Coin Setting</h3>
      </div>
      {coinsData.isFetched ? (
        <div style={{ height: 530 }}>
          <DataGrid
            rows={coins}
            columns={columns}
            pageSize={8}
            getRowId={(row) => row.id}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <PulseLoader color="#FF4C01" />
        </div>
      )}
      <CoinEditModal
        isEditCoinModalOpen={isEditCoinModalOpen}
        setIsEditCoinModalOpen={setIsEditCoinModalOpen}
      />
    </div>
  );
};

export default CoinSetting;
