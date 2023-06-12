import React, { useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridCellParams,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { Switch } from "@headlessui/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../../context/Auth";
import { useNavigate } from "react-router-dom";
interface Props {
  avatars: Array<object>;
  setIsUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditId: React.Dispatch<React.SetStateAction<string | null>>;
}
const AvatarTable = ({
  avatars,
  setIsUpdated,
  setIsModalOpen,
  setEditId,
}: Props) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const { token } = useAuth();
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  const columns: GridColDef[] = [
    { field: "index", headerName: "ID", width: 110 },
    {
      field: "name",
      headerName: "Name",
      width: 170,
      sortable: false,
      filterable: false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "nickname",
      headerName: "Nick Name",
      width: 170,
      sortable: false,
      filterable: false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "price",
      headerName: "Price",
      width: 130,
      sortable: false,
      filterable: false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "item",
      headerName: "Image",
      sortable: false,
      filterable: false,
      width: 150,
      renderCell: (params: GridCellParams) => {
        return (
          <img
            src={params.row.item}
            alt=""
            className="h-11 w-11 rounded-sm object-cover"
          />
        );
      },
    },

    {
      field: "status",
      headerName: "Status",
      width: 150,
      sortable: false,
      filterable: false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "action",
      headerName: "action",
      width: 350,
      renderCell: (params: GridCellParams) => {
        return (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleDelete(params.row.id)}
              className="bg-red-500 rounded-sm hover:opacity-80
                text-center px-5 p-1 font-medium text-sm text-white"
            >
              Delete
            </button>
            <button
              onClick={() => {
                navigate(`/avater/edit/${params.row.id}`);
              }}
              className="bg-main-bg rounded-sm hover:opacity-80
                text-center px-5 p-1 font-medium text-sm text-white"
            >
              Edit
            </button>
            <Switch
              checked={params.row.isHided}
              onChange={() => {
                handleUpdateStatus(params.row);
                setSelected(params.row.status);
              }}
              className={`${
                params.row.status === "Active" ? "bg-red-600" : "bg-[#aeaeae]"
              }
          relative inline-flex h-[28px] w-[63px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <span
                aria-hidden="true"
                className={`${
                  params.row.status === "Active"
                    ? "translate-x-9"
                    : "translate-x-0"
                }
            pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
          </div>
        );
      },
    },
  ];

  function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
      <Pagination
        // color="secondary"
        // variant="outlined"
        shape="rounded"
        page={page + 1}
        count={pageCount}
        // @ts-expect-error
        renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
        onChange={(event, value) => apiRef.current.setPage(value - 1)}
      />
    );
  }

  const handleUpdateStatus = (data: any) => {
    statusUpdateMutationSubmitHandler(data);
  };
  //post request for status update
  const statusUpdateMutation = useMutation(
    async (params: { id: number; value: any }) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}admin/store-item-status/${params.id}`,
        { active: params.value.status === "Active" ? 0 : 1 },
        { headers }
      ),
    { retry: false }
  );

  const statusUpdateMutationSubmitHandler = async (value: any) => {
    try {
      const id = value.id;
      const data = { status: value.status };
      statusUpdateMutation.mutate(
        { id, value: data },
        {
          onSuccess: (responseData: any) => {
            setIsUpdated((prev) => !prev);
          },
          onError: (err: any) => {},
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  //delete video
  const handleDelete = (id: number) => {
    if (window.confirm("are u sure you want to delete")) {
      deleteAvatarMutationHandler(id);
    }
  };

  const deleteAvatarMutation = useMutation(
    async (id: number) =>
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}admin/delete-store-item/${id}`,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );

  const deleteAvatarMutationHandler = async (id: number) => {
    try {
      deleteAvatarMutation.mutate(id, {
        onSuccess: (responseData: any) => {
          setIsUpdated((prev) => !prev);
        },
        onError: (err: any) => {
          console.log(err);
        },
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div style={{ height: 530, width: "100%" }}>
      <DataGrid
        rows={avatars}
        columns={columns}
        pageSize={8}
        getRowId={(row) => row.id}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        components={{
          Pagination: CustomPagination,
        }}
      />
    </div>
  );
};

export default AvatarTable;
