"use client";
import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "@/app/context/AdminContext/index";
import {
  Table,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Badge,
  Tooltip,
  IconButton,
  Tabs,
  Tab,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Typography,
  Grid,
  Stack,
  InputAdornment,
  Chip,
  TablePagination,
  TableFooter,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  IconEdit,
  IconEye,
  IconListDetails,
  IconSearch,
  IconShoppingBag,
  IconSortAscending,
  IconTrash,
  IconTruck,
} from "@tabler/icons-react";
import CustomCheckbox from "@/app/components/forms/theme-elements/CustomCheckbox";
import { PAGINATION } from "@/constants/pagination";
import { UserInfo } from "@/@types/user-props";
import { Status } from "@/@types/enum/status";
import { TablePaginationActionsProps } from "@mui/material/TablePagination/TablePaginationActions";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";

function AdminList() {
  const { data, deleteInvoice, fetchData } = useContext(AdminContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedProducts, setSelectedProducts] = useState<any>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const tabItem = ["All", "Shipped", "Delivered", "Pending"];
  const [currentIndex, setCurrentIndex] = useState(0);


  // Handle status filter change
  const handleClick = (status: string) => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % tabItem.length);
    setActiveTab(status);
  };

  // const [data, setData] = useState<UserInfo[]>([]);
  const [dataFiltered, setDataFiltered] = useState<UserInfo[]>([]);
  const [dataDisplay, setDataDisplay] = useState<UserInfo[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  // const { updateAdmin } = useAdmin();

  useEffect(() => {
    if (dataFiltered && dataFiltered.length > 0) {

      // console.log("start", start);
      // console.log("end", start + PAGINATION.ITEMPERPAGE - 1);
      setTotalPage(Math.ceil(dataFiltered.length / rowsPerPage));
      getDataDisplay();

    } else {
      setTotalPage(0);
      setCurrentPage(1);
      setDataDisplay([]);
    }
  }, [dataFiltered]);

  const getDataDisplay = () => {
    console.log("currentPage", currentPage);
    if (dataFiltered && dataFiltered.length > 0) {
      // const start = (currentPage - 1) * PAGINATION.ITEMPERPAGE;
      const start = (currentPage - 1) * rowsPerPage;

      const end = dataFiltered.length > (start + rowsPerPage) ? start + rowsPerPage : dataFiltered.length;
      const _data = [...dataFiltered];
      setDataDisplay(_data.slice(start, end));
    } else {
      setDataDisplay([]);
    }
  }

  useEffect(() => {
    getDataDisplay();
  }, [currentPage]);

  useEffect(() => {

    setDataFiltered(data);

  }, [data]);

  // const getData = async () => {
  //   // const users = await getUsers("ADMIN");
  //   // setData(users);
  //   // setDataFiltered(users);
  //   setAdmin(admins);
  // }

  // const { isLoading, getUsers } = useUsers();
  // const { getAdmin } = useAdmin();


  // Filter invoices based on search term
  // const filteredInvoices = data.filter(
  //   (invoice: { billFrom: string; billTo: string; status: string }) => {
  //     return (
  //       (invoice.billFrom.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         invoice.billTo.toLowerCase().includes(searchTerm.toLowerCase())) &&
  //       (activeTab === "All" || invoice.status === activeTab)
  //     );
  //   }
  // );



  // Calculate the counts for different statuses
  // const Shipped = invoices.filter(
  //   (t: { status: string }) => t.status === "Shipped"
  // ).length;
  // const Delivered = invoices.filter(
  //   (t: { status: string }) => t.status === "Delivered"
  // ).length;
  // const Pending = invoices.filter(
  //   (t: { status: string }) => t.status === "Pending"
  // ).length;

  // Toggle all checkboxes
  const toggleSelectAll = () => {
    const selectAllValue = !selectAll;
    setSelectAll(selectAllValue);
    // if (selectAllValue) {
    //   setSelectedProducts(invoices.map((invoice: { id: any }) => invoice.id));
    // } else {
    //   setSelectedProducts([]);
    // }
  };

  // Toggle individual product selection
  const toggleSelectProduct = (productId: any) => {
    const index = selectedProducts.indexOf(productId);
    if (index === -1) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(
        selectedProducts.filter((id: any) => id !== productId)
      );
    }
  };

  // Handle opening delete confirmation dialog
  const handleDelete = () => {
    setOpenDeleteDialog(true);
  };

  // Handle confirming deletion of selected products
  const handleConfirmDelete = async () => {
    for (const productId of selectedProducts) {
      await deleteInvoice(productId);
    }
    setSelectedProducts([]);
    setSelectAll(false);
    setOpenDeleteDialog(false);
  };

  // Handle closing delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearchTerm(value);

    const dataFilter = data.filter(function (el: UserInfo) {
      return el.fullName.toLowerCase().includes(value.toLowerCase())
        || el.email.toLowerCase().includes(value.toLowerCase())
        || el.phone.toLowerCase().includes(value.toLowerCase()) || el.userID?.toLowerCase().includes(value.toLowerCase());
    });

    console.log("dataFilter", dataFilter);

    setDataFiltered(dataFilter);
  };

  const handleChangePage = (event: any, newPage: any) => {
    setCurrentPage(newPage);
  };

  const [rowsPerPage, setRowsPerPage] = useState(PAGINATION.ITEMPERPAGE);
  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, PAGINATION.ITEMPERPAGE));
    setCurrentPage(1);
  };


  return (
    (<Box>
      <Stack

        justifyContent="space-between"
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
        <TextField
          id="search"
          type="text"
          size="small"
          variant="outlined"
          placeholder="Search"
          value={searchTerm}
          onChange={(e: any) => // setSearchTerm(e.target.value)
            handleSearchChange(e)
          }
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconSearch size={"16"} />
                </InputAdornment>
              ),
            }
          }}
        />
        <Box display="flex" gap={1}>
          {selectAll && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleDelete}
              startIcon={<IconTrash width={18} />}
            >
              Delete All
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            component={Link}
            href="/apps/admin/create"
          >
            New Admin
          </Button>
        </Box>
      </Stack>
      <Box sx={{ overflowX: "auto" }}>
        <Table sx={{ whiteSpace: { xs: "nowrap", md: "unset" } }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <CustomCheckbox
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
              </TableCell>
              <TableCell>
                <Typography variant="h6" fontSize="14px">
                  No
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" fontSize="14px">
                  Full name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" fontSize="14px">
                  Email
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant="h6" fontSize="14px">
                  Status
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6" fontSize="14px">
                  Action
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataDisplay.map(
              (
                user: UserInfo
                //   invoice: {
                //   id: any;
                //   billFrom: any;
                //   billTo: any;
                //   totalCost: any;
                //   status: any;
                // }

              ) => (
                <TableRow key={user.id}>
                  <TableCell padding="checkbox">
                    <CustomCheckbox
                      checked={selectedProducts.includes(user.id)}
                      onChange={() => toggleSelectProduct(user.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" fontSize="14px">
                      {user.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" fontSize="14px">
                      {user.fullName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize="14px">{user.email}</Typography>
                  </TableCell>
                  <TableCell>
                    {user.status === Status.Active ? (
                      <Chip
                        color="primary"
                        label="ACTIVE"
                        size="small"
                      />
                    ) : <Chip
                      color="warning"
                      label="DEACTIVE"
                      size="small"
                    />}
                  </TableCell>
                  {/* <TableCell>
                    <Typography fontSize="14px">{invoice.totalCost}</Typography>
                  </TableCell>
                  <TableCell>
                    {invoice.status === "Shipped" ? (
                      <Chip
                        color="primary"
                        label={invoice.status}
                        size="small"
                      />
                    ) : invoice.status === "Delivered" ? (
                      <Chip
                        color="success"
                        label={invoice.status}
                        size="small"
                      />
                    ) : invoice.status === "Pending" ? (
                      <Chip
                        color="warning"
                        label={invoice.status}
                        size="small"
                      />
                    ) : (
                      ""
                    )}
                  </TableCell> */}
                  <TableCell align="center">
                    <Tooltip title="Edit Admin">
                      <IconButton
                        color="success"
                        component={Link}
                        href={`/apps/admins/edit/${user.id}`}
                      >
                        <IconEdit width={22} />
                      </IconButton>
                    </Tooltip>
                    {/* <Tooltip title="View Invoice">
                      <IconButton
                        color="primary"
                        component={Link}
                        href={`/apps/invoice/detail/${invoice.billFrom}`}
                      >
                        <IconEye width={22} />
                      </IconButton>
                    </Tooltip> */}
                    <Tooltip title="Delete Invoice">
                      <IconButton
                        color="error"
                        onClick={() => {
                          // setSelectedProducts([invoice.id]);
                          // handleDelete();
                        }}
                      >
                        <IconTrash width={22} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={6}
                count={dataFiltered.length}
                rowsPerPage={rowsPerPage}
                page={currentPage}
                SelectProps={{
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Box>
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete selected invoices?
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleCloseDeleteDialog}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="outlined"
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box >)
  );
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: any) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: any) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: any) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: any) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export default AdminList;

