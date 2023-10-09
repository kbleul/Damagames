import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import {
  DataGrid,
  GridColDef,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";

const IntervalReportTable = ({
  data,
  selectedCategory,
}: {
  data: Array<object>;
  selectedCategory: string;
}) => {
  console.log("data", selectedCategory, data);
  const columns: GridColDef[] = [
    {
      field: "game_date",
      headerName: "Date",
      width: 430,
      sortable: false,
      filterable: false,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div className="  w-[33.3%] text-center">{params.value}</div>
      ),
    },
    {
      field: "total_games",
      headerName: "Total Games",
      width: 430,
      sortable: false,
      filterable: false,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div className=" w-[33.3%] text-center">{params.value}</div>
      ),
    },
    {
      field: "finished_games",
      headerName: "Finished Games",
      width: 430,
      sortable: false,
      filterable: false,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div className=" w-[33.3%] text-center">{params.value}</div>
      ),
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
    <div className="text-center" style={{ height: 630, width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={10}
        getRowId={(row) => row.game_date}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        components={{
          Pagination: CustomPagination,
        }}
      />
    </div>
  );
};

export default IntervalReportTable;
