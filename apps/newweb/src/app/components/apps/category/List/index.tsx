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
  Stack,
  InputAdornment,
  Chip,
  TablePagination,
  TableFooter,
  useTheme,
  TableContainer,
  Avatar,
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
  IconX,
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
import { UserContext } from "@/app/context/UserContext";
import BlankCard from "@/app/components/shared/BlankCard";
import { CategoryInfo } from "@/@types/category-props";
import { CategoryContext } from "@/app/context/CategoryContext";
import CategoryDialog from "./CategoryDialog";
import Grid from "@mui/material/Grid2";
import { getLink } from "@/utils/image";
import { Attachment } from "@/@types/product-props";

function CategoryList() {
  const { data, deleteInvoice, fetchData } = useContext(CategoryContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedProducts, setSelectedProducts] = useState<any>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);



  // const [data, setData] = useState<UserInfo[]>([]);
  const [dataFiltered, setDataFiltered] = useState<CategoryInfo[]>([]);
  const [dataDisplay, setDataDisplay] = useState<CategoryInfo[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  // const { updateAdmin } = useAdmin();

  useEffect(() => {
    if (dataFiltered && dataFiltered.length > 0) {

      // console.log("start", start);
      // console.log("end", start + PAGINATION.ITEMPERPAGE - 1);
      setTotalPage(Math.ceil(dataFiltered.length / rowsPerPage));
      getDataDisplay();
    } else {
      setTotalPage(0);
      setCurrentPage(0);
      setDataDisplay([]);
    }
  }, [dataFiltered]);

  const getDataDisplay = () => {
    console.log("currentPage", currentPage);
    if (dataFiltered && dataFiltered.length > 0) {
      // const start = (currentPage - 1) * PAGINATION.ITEMPERPAGE;
      const start = (currentPage) * rowsPerPage;
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

    const dataFilter = data.filter(function (el: CategoryInfo) {
      return el.name.toLowerCase().includes(value.toLowerCase());
    });

    console.log("dataFilter", dataFilter);

    setDataFiltered(dataFilter);
  };

  const handleChangePage = (event: any, newPage: any) => {
    setCurrentPage(newPage);
  };

  const [rowsPerPage, setRowsPerPage] = useState(PAGINATION.ITEMPERPAGE);

  const [isOpenCategoryDialog, setIsOpenCategoryDialog] = useState(false);
  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, PAGINATION.ITEMPERPAGE));
    setCurrentPage(1);
  };
  const [selectedCategory, setSelectedCategory] = useState<CategoryInfo | undefined>(undefined);





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
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setIsOpenCategoryDialog(true);
              setSelectedCategory(undefined);
            }}
          >
            New Category
          </Button>
        </Box>
      </Stack>
      <Box sx={{ overflowX: "auto", paddingTop: '4px' }}>
        <BlankCard>
          <TableContainer>
            <Table sx={{ whiteSpace: { xs: "nowrap", md: "unset" } }}>
              <TableHead>
                <TableRow>
                  {/* <TableCell padding="checkbox">
                    <CustomCheckbox
                      checked={selectAll}
                      onChange={toggleSelectAll}
                    />
                  </TableCell> */}
                  <TableCell sx={{ width: '24px' }}>
                    <Typography variant="h6" fontSize="14px">
                      No
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: '120px' }}>
                    <Typography variant="h6" fontSize="14px">
                      Category Default Image
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: '120px' }}>
                    <Typography variant="h6" fontSize="14px">
                      Product Default Image
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" fontSize="14px">
                      Category
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: '108px' }}>
                    <Typography variant="h6" fontSize="14px" >
                      Action
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataDisplay.map(
                  (
                    category: CategoryInfo,
                    index: number
                    //   invoice: {
                    //   id: any;
                    //   billFrom: any;
                    //   billTo: any;
                    //   totalCost: any;
                    //   status: any;
                    // }

                  ) => (
                    <TableRow key={category.name}>
                      <TableCell>
                        <Typography variant="body1" fontSize="14px">
                          {index + 1}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Avatar src={getLink(category.url)} />
                      </TableCell>
                      <TableCell>
                        <Avatar src={getLink(category.productUrl)} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" fontSize="14px">
                          {category.name}
                        </Typography>
                      </TableCell>


                      <TableCell align="center">
                        <Tooltip title="Edit Admin">
                          <IconButton
                            color="success"
                            // component={Link}
                            // href={`/apps/admins/edit/${user.id}`}
                            onClick={() => {
                              setIsOpenCategoryDialog(true);
                              setSelectedCategory(category);
                            }}
                          >
                            <IconEdit width={22} />
                          </IconButton>
                        </Tooltip>

                        {/* <Tooltip title="Delete Invoice">
                          <IconButton
                            color="error"
                            onClick={() => {
                              // setSelectedProducts([invoice.id]);
                              // handleDelete();
                            }}
                          >
                            <IconTrash width={22} />
                          </IconButton>
                        </Tooltip> */}
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
          </TableContainer>
        </BlankCard>
      </Box>
      <CategoryDialog category={selectedCategory} state={isOpenCategoryDialog} handleCloseDialog={(refresh?: Boolean) => {
        if (refresh) {
          fetchData();
        }
        setIsOpenCategoryDialog(false)
      }}></CategoryDialog>
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

export default CategoryList;

