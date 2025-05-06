import { Status } from "@/@types/enum/status";
import { LocationInfo } from "@/@types/location-props";
import { PAGINATION } from "@/constants/pagination";
import { formatTime } from "@/utils/time";
import { Avatar, Box, Chip, IconButton, Link, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Tooltip, Typography, useTheme } from "@mui/material";
import { TablePaginationActionsProps } from "@mui/material/TablePagination/TablePaginationActions";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { Product } from "@/@types/product-props";
import BlankCard from "../../shared/BlankCard";
import { CategoryInfo } from "@/@types/category-props";
import { getLink } from "@/utils/image";

interface ProductTableProps {
    data: Product[];
    onEditProduct: (product: Product) => void
    categories: CategoryInfo[];
}

const ProductTable = ({ categories, data, onEditProduct }: ProductTableProps) => {
    const [dataDisplay, setDataDisplay] = useState<Product[]>([]);
    const [dataFiltered, setDataFiltered] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalPage, setTotalPage] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        setSearchTerm(value);

        const dataFilter = data.filter(function (el: Product) {
            // return el.fullName.toLowerCase().includes(value.toLowerCase())
            //     || el.email.toLowerCase().includes(value.toLowerCase())
            //     || el.phone.toLowerCase().includes(value.toLowerCase()) || el.userID?.toLowerCase().includes(value.toLowerCase());
        });

        console.log("dataFilter", dataFilter);

        setDataFiltered(dataFilter);
    };

    const handleChangePage = (event: any, newPage: any) => {
        console.log(newPage);
        setCurrentPage(newPage);
    };

    const [rowsPerPage, setRowsPerPage] = useState(PAGINATION.ITEMPERPAGE);
    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, PAGINATION.ITEMPERPAGE));
        setCurrentPage(0);
    };

    const theme = useTheme();
    const borderColor = theme.palette.divider;

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
            // const start = ((currentPage - 1) >= 0 ? (currentPage - 1) : 0) * rowsPerPage;
            const start = currentPage * rowsPerPage;

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

    return <Box sx={{ overflowX: "auto", width: '100%' }}>
        <BlankCard>
            <TableContainer>
                <Table sx={{ whiteSpace: { xs: "nowrap", md: "unset" } }} size={'small'}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: '80px' }}>
                                <Typography variant="h6" fontSize="14px">
                                    No
                                </Typography>
                            </TableCell>
                            <TableCell align="center" sx={{ width: '50px' }}>
                                <Typography variant="h6" fontSize="14px">
                                    Image
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="h6" fontSize="14px">
                                    Product Name
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="h6" fontSize="14px">
                                    Price
                                </Typography>
                            </TableCell>
                            {/* <TableCell>
                                <Typography variant="h6" fontSize="14px">
                                    Description
                                </Typography>
                            </TableCell> */}

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
                                product: Product,
                                index: number
                                //   invoice: {
                                //   id: any;
                                //   billFrom: any;
                                //   billTo: any;
                                //   totalCost: any;
                                //   status: any;
                                // }

                            ) => (
                                <TableRow key={product.id}>

                                    <TableCell>
                                        <Typography variant="body1" fontSize="12px">
                                            {(rowsPerPage * currentPage) + (index + 1)}

                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Avatar src={product.image == "" ? (categories.length > 0 ? getLink(categories[0].productUrl) : "") : product.image} />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body1" fontSize="14px">
                                            {product.productName}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body1" fontSize="14px">
                                            {product.locationInfo.map((location, index) => {
                                                return (
                                                    "$" + location.price + (index != product.locationInfo.length - 1 ? ";" : "")
                                                )
                                            })
                                            }
                                        </Typography>
                                    </TableCell>


                                    <TableCell align="center">
                                        <Tooltip title="Edit Product">
                                            <IconButton
                                                color="success"
                                                onClick={() => { onEditProduct(product); }}
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
                                colSpan={7}
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
    </Box>;
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
export default ProductTable;