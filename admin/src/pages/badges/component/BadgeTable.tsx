import React from "react";
import {
  DataGrid,
  GridColDef,
  GridCellParams,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import { Switch } from "@headlessui/react";
import { Pagination, PaginationItem } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../../context/Auth";
import { useNavigate } from "react-router-dom";

interface Props {
  badges: Array<object>;
  setIsUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}

const BadgeTable = ({ badges, setIsUpdated }: Props) => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const deleteBadgeMutation = useMutation(
    async (id: string) =>
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}admin/badges/${id}`,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );

  const deleteBadgeMutationHandler = async (id: string) => {
    try {
      deleteBadgeMutation.mutate(id, {
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

  const handleDelete = (id: string) => {
    if (window.confirm("are u sure you want to delete")) {
      deleteBadgeMutationHandler(id);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "Eng Name",
      headerName: "Eng Name",
      width: 140,
      sortable: false,
      filterable: false,
      headerClassName: "super-app-theme--header",
      renderCell: (params: GridCellParams) => {
        return <p>{params.row.name.english}</p>;
      },
    },
    {
      field: "Amh Name",
      headerName: "Amh Name",
      width: 140,
      sortable: false,
      filterable: false,
      headerClassName: "super-app-theme--header",
      renderCell: (params: GridCellParams) => {
        return <p>{params.row.name.amharic}</p>;
      },
    },
    {
      field: "Eng Disc",
      headerName: "Eng Disc",
      width: 210,
      sortable: false,
      filterable: false,
      headerClassName: "super-app-theme--header",
      renderCell: (params: GridCellParams) => {
        return <p>{params.row.description.english}</p>;
      },
    },
    {
      field: "Amh Disc",
      headerName: "Amh Disc",
      width: 210,
      sortable: false,
      filterable: false,
      renderCell: (params: GridCellParams) => {
        return <p>{params.row.description.amharic}</p>;
      },
    },
    {
      field: "point",
      headerName: "Point",
      width: 90,
      sortable: false,
      filterable: false,
      headerClassName: "super-app-theme--header",
      renderCell: (params: GridCellParams) => {
        return <p>{params.row.point}</p>;
      },
    },
    {
      field: "color",
      headerName: "Color",
      width: 90,
      sortable: false,
      filterable: false,
      headerClassName: "super-app-theme--header",
      renderCell: (params: GridCellParams) => {
        return <p>{params.row.color}</p>;
      },
    },
    {
      field: "item",
      headerName: "Image",
      sortable: false,
      filterable: false,
      width: 100,
      renderCell: (params: GridCellParams) => {
        return (
          params.row.badge_image &&
          params.row.badge_image !== "" && (
            <img
              src={params.row.badge_image}
              alt=""
              className="h-11 w-11 rounded-sm object-cover"
            />
          )
        );
      },
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
                navigate(`/badge/edit/${params.row.id}`);
              }}
              className="bg-main-bg rounded-sm hover:opacity-80
                    text-center px-5 p-1 font-medium text-sm text-white"
            >
              Edit
            </button>
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
  return (
    <div style={{ height: 530, width: "100%" }}>
      <DataGrid
        rows={badges}
        columns={columns}
        pageSize={8}
        getRowId={(row) => row.id}
        rowsPerPageOptions={[10]}
        disableSelectionOnClick
        components={{
          Pagination: CustomPagination,
        }}
      />
    </div>
  );
};

export default BadgeTable;
