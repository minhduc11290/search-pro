import { Status } from "@/@types/enum/status";
import { LocationInfo } from "@/@types/location-props";
import { PAGINATION } from "@/constants/pagination";
import { formatTime } from "@/utils/time";
import { Box, Chip, IconButton, Link, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Tooltip, Typography, useTheme } from "@mui/material";
import { TablePaginationActionsProps } from "@mui/material/TablePagination/TablePaginationActions";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import BlankCard from "../../shared/BlankCard";
import { CategoryInfo } from "@/@types/category-props";

interface LocationTableProps {
    data: LocationInfo[];
    onEditLocation: (location: LocationInfo) => void,
    categories: CategoryInfo[];
}

const LocationTable = ({ data, onEditLocation }: LocationTableProps) => {
    const [dataDisplay, setDataDisplay] = useState<LocationInfo[]>([]);
    const [dataFiltered, setDataFiltered] = useState<LocationInfo[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalPage, setTotalPage] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        setSearchTerm(value);

        const dataFilter = data.filter(function (el: LocationInfo) {
            // return el.fullName.toLowerCase().includes(value.toLowerCase())
            //     || el.email.toLowerCase().includes(value.toLowerCase())
            //     || el.phone.toLowerCase().includes(value.toLowerCase()) || el.userID?.toLowerCase().includes(value.toLowerCase());
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
        setCurrentPage(0);
    };

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
            // const start = (currentPage - 1) * rowsPerPage;
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
    const theme = useTheme();
    const borderColor = theme.palette.divider;

    return <Box sx={{ overflowX: "auto", width: '100%' }}>
        <BlankCard>
            <TableContainer>
                <Table sx={{ whiteSpace: { xs: "nowrap", md: "unset" } }} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="h6" fontSize="14px">
                                    No
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="h6" fontSize="14px">
                                    Address
                                </Typography>
                            </TableCell>
                            {/* <TableCell>
                                <Typography variant="h6" fontSize="14px">
                                    State/Zip
                                </Typography>
                            </TableCell> */}
                            <TableCell>
                                <Typography variant="h6" fontSize="14px">
                                    Open time
                                </Typography>
                            </TableCell>
                            {/* <TableCell>
                                <Typography variant="h6" fontSize="14px">
                                    Status
                                </Typography>
                            </TableCell> */}
                            <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                                <Typography variant="h6" fontSize="14px">
                                    Action
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataDisplay.map(
                            (
                                location: LocationInfo,
                                index: number
                                //   invoice: {
                                //   id: any;
                                //   billFrom: any;
                                //   billTo: any;
                                //   totalCost: any;
                                //   status: any;
                                // }

                            ) => (
                                <TableRow key={location.locationID}>
                                    {/* <TableCell padding="checkbox">
                <CustomCheckbox
                  checked={selectedProducts.includes(store.id)}
                  onChange={() => toggleSelectProduct(store.id)}
                />
              </TableCell> */}
                                    <TableCell>
                                        <Typography variant="h6" fontSize="14px">
                                            {(rowsPerPage * currentPage) + (index + 1)}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Typography variant="h6" fontSize="14px">
                                            {(location.addressLine1 ?? '') + " " + (location.addressLine2 ?? '') + "," + (location.city ?? '') + "," + (location.state) + " " + location.zipCode}
                                        </Typography>
                                    </TableCell>
                                    {/* <TableCell>
                                        <Typography variant="h6" fontSize="14px">
                                            {location.state}
                                        </Typography>
                                    </TableCell> */}
                                    <TableCell>
                                        <Typography fontSize="14px"> {'Mon: ' + (location.isOpenMon ? formatTime(location.openTimeMon) + " - " + formatTime(location.closeTimeMon) : 'Closed')};
                                            {'Tue: ' + (location.isOpenTue ? formatTime(location.openTimeTue) + " - " + formatTime(location.closeTimeTue) : 'Closed')};
                                            {'Wed: ' + (location.isOpenWed ? formatTime(location.openTimeWed) + " - " + formatTime(location.closeTimeWed) : 'Closed')};
                                            {'Thu: ' + (location.isOpenThu ? formatTime(location.openTimeThu) + " - " + formatTime(location.closeTimeThu) : 'Closed')};
                                            {'Fri: ' + (location.isOpenFri ? formatTime(location.openTimeFri) + " - " + formatTime(location.closeTimeFri) : 'Closed')};
                                            {'Sat: ' + (location.isOpenSat ? formatTime(location.openTimeSat) + " - " + formatTime(location.closeTimeSat) : 'Closed')};
                                            {'Sun: ' + (location.isOpenSun ? formatTime(location.openTimeSun) + " - " + formatTime(location.closeTimeSun) : 'Closed')}
                                        </Typography>
                                    </TableCell>

                                    <TableCell align="center" sx={{ whitespace: 'nowrap', flexWrap: 'nowrap', display: 'flex' }}>
                                        <Tooltip title="Edit Location">
                                            <IconButton
                                                color="success"
                                                // component={Link}
                                                // href={`/apps/locations/edit/${location.locationID}`}
                                                onClick={() => {
                                                    onEditLocation(location);
                                                }}
                                            >
                                                <IconEdit width={22} />
                                            </IconButton>
                                        </Tooltip>

                                        {/* <Tooltip title="Delete Location">
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
                    {/* <TableFooter>
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
                    </TableFooter> */}
                </Table>
            </TableContainer>
        </BlankCard>
    </Box >;
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
export default LocationTable;