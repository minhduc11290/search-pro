import { Category, Store, StoreRequest } from "@/@types/store-props"
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomFormText from "@/app/components/forms/theme-elements/CustomFormText";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import { Box, Divider, FormHelperText, LinearProgress, MenuItem, useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid2";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from 'yup';
import { useDropzone } from "react-dropzone";
import useStoreProducts from "@/hooks/store-products";
import readXlsxFile from 'read-excel-file'
import useStoreLocations from "@/hooks/store-locations";
import { LocationInfo } from "@/@types/location-props";
import toast from "react-hot-toast";


interface DialogShowPassProps {
    store: Store;
    state: boolean;
    handleCloseDialog: (refresh: boolean) => void;
}
const DialogImport = (props: DialogShowPassProps) => {

    const [openDialog, setOpenDialog] = useState(false);
    // const handleCloseDialog = () => {
    //     setOpenDialog(false);
    // }

    useEffect(() => {
        setOpenDialog(props.state);
        init();
        if (props.state) {
            setPressed(false);
        }
    }, [props.state]);

    const validationSchema = yup.object({
        fileName: yup.string()
            .required('Required Information'),


    });

    const formik = useFormik({
        initialValues: {
            fileName: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            handleSubmit();
        }
    })
    const [file, setFile] = useState<File | null>(null);

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        maxFiles: 1,
        onDrop: acceptedFiles => {

            // formik.setFieldValue("images", acceptedFiles);
            // setImages(acceptedFiles.map(file => Object.assign(file, {
            //     name: file.name,
            //     url: URL.createObjectURL(file)
            // })));
            // const newFiles = acceptedFiles.map(file => {
            //     return {
            //         name: file.name,
            //         url: URL.createObjectURL(file)
            //     }
            // });
            // const formFiles = [...formik.values.images, ...acceptedFiles].slice(0, 1);
            if (acceptedFiles.length > 0) {
                setFile(acceptedFiles[0]);
                formik.setFieldValue("fileName", acceptedFiles[0].name);
            }


            // const formFiles = [...formik.values.images, ...acceptedFiles].slice(0, 1);
            // formik.setFieldValue("images", formFiles);

            // const _images = [...images, ...newFiles].slice(0, 1);

            // formik.setFieldValue("images", acceptedFiles);

            // setImages(_images);


        }
    });

    const { createProduct } = useStoreProducts();
    const { getStoreLocations } = useStoreLocations();
    const [locationsDB, setLocationsDB] = useState<LocationInfo[]>([]);

    const init = async () => {
        const _locations = await getStoreLocations(props.store.id);
        setLocationsDB(_locations);

    }

    // useEffect(() => {
    //     init();
    //     if (opened) {
    //         setFileName("");
    //         setFile(null);
    //         setValue(0);
    //     }
    // }, [opened])

    const [error, setError] = useState("");
    const [pressed, setPressed] = useState(false);
    const [value, setValue] = useState(0);

    const handleSubmit = async () => {
        setError("");
        if (file) {
            setPressed(true);
            const rows = await readXlsxFile(file);
            console.log("rows", rows);
            setValue(20);
            let hasErrors = false;

            const itemPercent = 40 / rows.length;
            rows.map((row, index) => {
                if (index != 0) {
                    if (row.length < 3) {
                        console.log("excel-col-length:", row.length);
                        hasErrors = true;
                    }
                    if (row.length > (3 + locationsDB.length)) {
                        console.log("excel-error-num-column1:", row.length);
                        console.log("excel-error-num-column2:", (3 + locationsDB.length));
                        hasErrors = true;
                    }
                    locationsDB.map((_, index) => {
                        if ((row[3 + index] ?? "") != "" && typeof (row[3 + index]) != "number") {
                            console.log("excel-error-column", index);
                            console.log("excel-error-column", index);
                            hasErrors = true;
                        }
                    });

                    if ((row[0] ?? "").toString().trim() == "") {
                        console.log("excel-error-required");
                        hasErrors = true;
                    }

                }
                setValue(20 + (itemPercent * (index + 1)));
            });

            if (hasErrors) {
                setValue(100);
                setError("wrong format");
                return;
            }

            let _errorMessage = "";
            let index = 0;
            for (const row of rows) {

                // rows.map(async (row, index) => {
                if (index != 0) {
                    const productLocations: { locationId: string, price: number }[] = [];
                    locationsDB.map((location, index) => {
                        if ((row[3 + index] ?? "").toString().trim() != "") {
                            productLocations.push({
                                locationId: location.locationID,
                                price: Number(row[3 + index])
                            });
                        }
                    })

                    const { errorMessage } = await createProduct(props.store.id, {
                        sku: (row[2] ?? "").toString(),
                        name: (row[0] ?? "").toString(),
                        // keywords: (row[2] ?? "").toString().split(","),
                        keywords: [],
                        description: (row[1] ?? "").toString(),
                        productLocations: productLocations,
                        attachments: [],
                        isActive: true
                    });

                    if (errorMessage) {
                        _errorMessage += `row ${index}:  ${errorMessage} ,`
                    }
                }

                setValue(60 + (itemPercent * (index + 1)));
                // });
                index++;
            }

            setPressed(false);
            if (_errorMessage) {
                setValue(100);
                setError(_errorMessage);
                return;
            } else {
                setValue(100);
                toast.success(`Product have been created successfully`);
                props.handleCloseDialog(true);
                // notifications.show({
                //     title: `Success`,
                //     message: `Product have been created successfully`,
                //     color: 'teal',
                //     icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                //     position: 'top-right'
                // });
                // close(true);
            }




        }

    }

    const theme = useTheme();

    return <Dialog open={openDialog} onClose={() => props.handleCloseDialog(false)} maxWidth="xs" fullWidth>
        {/* <DialogTitle>Import Product</DialogTitle> */}
        <Box flex="1" display="flex" alignItems="center" justifyContent="space-between">
            <DialogTitle>Import Product</DialogTitle>
            <Box paddingRight={3} display="flex" gap={1}>
                <Button color="primary"
                    variant="outlined" onClick={() => { props.handleCloseDialog(false); formik.resetForm() }}>
                    Cancel
                </Button>
                <Box px="1"></Box>
                <Button
                    variant="contained"
                    disabled={pressed}
                    onClick={() => {

                        formik.submitForm();
                    }}
                >
                    Save
                </Button>
            </Box>
        </Box>
        <DialogContent>
            <Grid container rowSpacing={0} spacing={2} mb={4} marginTop={0} sx={{ paddingTop: 0 }}>
                <Box
                    fontSize="12px"
                    sx={{
                        backgroundColor: "primary.light",
                        color: "primary.main",
                        padding: "30px",
                        textAlign: "center",
                        border: `1px dashed`,
                        borderColor: "primary.main",
                        width: "100%"
                    }}
                    {...getRootProps({ className: "dropzone" })}
                >
                    <input {...getInputProps()} />
                    <p>Drag &apos;n&apos;  drop some files here, or click to select files</p>
                </Box>

                {formik.touched.fileName && formik.errors.fileName && (
                    <FormHelperText sx={{ width: "100%", color: theme.palette.error.main, mt: '10px' }}>{formik.errors.fileName}</FormHelperText>
                )}
                {error && (
                    <FormHelperText sx={{ width: "100%", color: theme.palette.error.main }}>{error}</FormHelperText>
                )}
                {file && <Box flex="1" flexDirection="row" display="flex" alignItems="center">
                    <CustomFormLabel htmlFor="bill-from">File: </CustomFormLabel>
                    <CustomFormText
                    > {file.name}</CustomFormText>
                </Box>}
                {pressed && <LinearProgress variant="determinate" value={value} />}

            </Grid >
        </DialogContent>

    </Dialog>
}

export default DialogImport;
