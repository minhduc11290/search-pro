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
import { FormikErrors, useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from 'yup';
import { useDropzone } from "react-dropzone";
import useStoreProducts from "@/hooks/store-products";
import readXlsxFile from 'read-excel-file'
import useStoreLocations from "@/hooks/store-locations";
import { LocationInfo } from "@/@types/location-props";
import toast from "react-hot-toast";
import { zip } from "lodash";
import ProductAvgSales from "../../ecommerce/productEdit/ProductAvgSales";
import { sk } from "date-fns/locale";
import useStore from "@/hooks/stores";
import useGeoRef from "@/hooks/georef";
import { GeoProps } from "@/@types/geo-props";


interface DialogShowPassProps {
    state: boolean;
    categories: Category[];

    handleCloseDialog: (refresh: boolean) => void;
}

interface StoreProductData {
    storeName: string;
    email: string;
    password: string;
    category: string;
    phoneNumber: string;
    website: string;
    addressLine1: string;
    addressLine2: string;
    state: string;
    zipCode: string;
    city: string;
    productName: string;
    productDescription: string;
    sku: string;
    price: number;
    geo: string;
}

const DialogImportStore = (props: DialogShowPassProps) => {

    useEffect(() => {
        if (props.state) {
            formData.resetForm();
            formik.resetForm();
            setFile(null);
            setError("");
            setValue(0);
            setPressed(false);

        }
    }, [props.state]);

    const [openDialog, setOpenDialog] = useState(false);
    // const handleCloseDialog = () => {
    //     setOpenDialog(false);
    // }
    useStoreLocations();

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

    const dataSchema = yup.object({
        data: yup.array().of(
            yup.object({
                storeName: yup.string().required("Required information"),
                email: yup.string().email("Invalid email format"),
                // price: yup.string().email("Invalid email format"),
                password: yup.string().required("Required information"),
                addressLine1: yup.string().required("Required information"),
                state: yup.string().required("Required information"),
                zipCode: yup.string().required("Required information"),
                city: yup.string().required("Required information"),
                geo: yup.string().required("Location not found"),
            }))
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

    const formData = useFormik<{
        data: StoreProductData[]
    }>({
        initialValues: {
            data: [],
        },
        validationSchema: dataSchema,
        onSubmit: async (values) => {
            // handleSubmit();
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

    const { getGeoRef } = useGeoRef();
    const [geos, setGeos] = useState<GeoProps[]>([]);
    const init = async () => {
        // const _locations = await getStoreLocations(props.store.id);
        // setLocationsDB(_locations);
        const _geos = await getGeoRef();
        setGeos(_geos);
    }


    useEffect(() => {
        if (props.state) {
            init();
        }


    }, [props.state])

    const [error, setError] = useState("");
    const [pressed, setPressed] = useState(false);
    const [value, setValue] = useState(0);

    const { createStore } = useStore();
    const { createLocation, createLocationSearchable } = useStoreLocations();


    const handleSubmit = async () => {
        setError("");
        if (file) {
            setPressed(true);
            const rows = await readXlsxFile(file);
            console.log("rows", rows);
            setValue(20);

            const itemPercent = 40 / rows.length;
            let _data: StoreProductData[] = [];
            rows.map((row, index) => {
                if (index != 0) {
                    let categoryId = props.categories.find((item) => item.name == row[4].toString().trim())?.id;
                    if (!categoryId) {
                        formData.setFieldError(`data[${index}].category`, "Category not found");
                    }
                    let geoId = geos.find((item) => item.steName == row[9].toString().trim()
                        && item.zipCode == row[10].toString().trim()
                        && item.city == row[11].toString().trim())?.id;
                    if (!geoId) {
                        formData.setFieldError(`data[${index}].state`, "Geo not found");
                    }
                    _data.push({
                        storeName: row[1].toString(),
                        email: String(row[2]),
                        password: String(row[3]),
                        category: categoryId ?? "",
                        phoneNumber: String(row[5]),
                        website: String(row[6]),
                        addressLine1: String(row[7]),
                        addressLine2: String(row[8] ?? ""),
                        state: String(row[9]),
                        zipCode: String(row[10]),
                        city: String(row[11]),
                        productName: String(row[12]),
                        productDescription: String(row[13]),
                        sku: String(row[14]),
                        price: Number(row[15]),
                        geo: geoId ?? "",
                    });
                }
                setValue(20 + (itemPercent * (index + 1)));
            });
            const errors = await formData.setFieldValue("data", _data, true);
            // const errors = await formData.validateForm();
            console.log("formData-errors", errors);
            if (errors && errors.data) {
                setValue(100);
                setPressed(false);
                setError("wrong format");
                return;
            }
            let index = 0;
            let hasError = false;
            for (const item of _data) {
                const store: StoreRequest = {
                    name: item.storeName,
                    primaryPhone: item.phoneNumber,
                    password: item.password,
                    email: item.email,
                    isActive: true,
                    categoryId: item.category,
                    website: item.website,
                };
                let result = await createStore(store);

                if (result.statusCode == 200 || result.statusCode == 201) {
                    const newStore: any = result.data;
                    const { data: dataLocation, result: resultLocation, errorMessage } = await createLocation(newStore.id, {
                        // name: formik.values.address,
                        name: (item.addressLine1 ?? '') + (item.addressLine2 ?? '') + (item.city ?? ''),
                        address: (item.addressLine1 ?? '') + (item.addressLine2 ?? '') + (item.city ?? ''),
                        openTime: '08:00',
                        closeTime: '17:00',
                        geoRefId: item.geo,
                        isActive: true,
                        phone: item.phoneNumber,
                        attachments: [],
                        addressLine1: item.addressLine1,
                        addressLine2: item.addressLine2,
                        city: item.city,
                        fax: '',
                        isOpenMon: true,
                        openTimeMon: '09:00',
                        closeTimeMon: '22:00',
                        isOpenTue: true,
                        openTimeTue: '09:00',
                        closeTimeTue: '22:00',

                        isOpenWed: true,
                        openTimeWed: '09:00',
                        closeTimeWed: '22:00',

                        isOpenThu: true,
                        openTimeThu: '09:00',
                        closeTimeThu: '22:00',
                        isOpenFri: true,

                        openTimeFri: '09:00',
                        closeTimeFri: '22:00',
                        isOpenSat: true,
                        openTimeSat: '09:00',
                        closeTimeSat: '22:00',
                        isOpenSun: false,
                        openTimeSun: '12:00',
                        closeTimeSun: '19:00',

                        latitude: 0,
                        longitude: 0,
                        cities: [{
                            state: item.state,
                            city: [item.city],
                        }],
                    });

                    if (resultLocation && dataLocation) {
                        await createLocationSearchable(newStore.id, {
                            state: item.state,
                            cities: [item.city],
                        });

                        await createProduct(newStore.id, {
                            sku: item.sku,
                            name: item.productName,
                            keywords: [],
                            description: item.productDescription,
                            productLocations: [{
                                locationId: dataLocation.id,
                                price: item.price
                            }],
                            attachments: [],
                            isActive: true,
                        });


                    }
                } else {
                    if (result.statusCode == 409) {
                        formData.setFieldError(`data[${index}].email`, "Store name already exists");
                        hasError = true;
                    }

                }
                setValue(value + (itemPercent * (index + 1)));
                index++;
            }
            if (hasError) {
                setValue(100);
                setPressed(false);
                return;
            }
            toast.success(`Store have been created successfully`);
            setValue(100);
            setPressed(false);
            props.handleCloseDialog(true);


            // let _errorMessage = "";
            // let index = 0;
            // for (const row of rows) {

            //     // rows.map(async (row, index) => {
            //     if (index != 0) {
            //         const productLocations: { locationId: string, price: number }[] = [];
            //         locationsDB.map((location, index) => {
            //             if ((row[3 + index] ?? "").toString().trim() != "") {
            //                 productLocations.push({
            //                     locationId: location.locationID,
            //                     price: Number(row[3 + index])
            //                 });
            //             }
            //         })

            //         const { errorMessage } = await createProduct(props.store.id, {
            //             sku: (row[2] ?? "").toString(),
            //             name: (row[0] ?? "").toString(),
            //             // keywords: (row[2] ?? "").toString().split(","),
            //             keywords: [],
            //             description: (row[1] ?? "").toString(),
            //             productLocations: productLocations,
            //             attachments: [],
            //             isActive: true
            //         });

            //         if (errorMessage) {
            //             _errorMessage += `row ${index}:  ${errorMessage} ,`
            //         }
            //     }

            //     setValue(60 + (itemPercent * (index + 1)));
            //     // });
            //     index++;
            // }

            // setPressed(false);
            // if (_errorMessage) {
            //     setValue(100);
            //     setError(_errorMessage);
            //     return;
            // } else {
            //     setValue(100);
            //     toast.success(`Product have been created successfully`);
            //     props.handleCloseDialog(true);
            //     // notifications.show({
            //     //     title: `Success`,
            //     //     message: `Product have been created successfully`,
            //     //     color: 'teal',
            //     //     icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
            //     //     position: 'top-right'
            //     // });
            //     // close(true);
            // }




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
                {Array.isArray(formData.errors.data) && <FormHelperText sx={{ width: "100%", color: theme.palette.error.main, mt: '10px' }}>Process import failed.</FormHelperText>}
                {Array.isArray(formData.errors.data) &&
                    formData.errors.data.map((item: any, index: number) => (
                        <Box key={index} sx={{ width: "100%" }}>
                            <FormHelperText
                                sx={{ width: "100%", color: theme.palette.error.main }}
                            > {"Row " + (index + 1) + ":"}</FormHelperText>
                            {Object.entries(item || {}).map(([key, value]) => (
                                <FormHelperText
                                    key={key}
                                    sx={{ width: "100%", color: theme.palette.error.main }}
                                >
                                    {key} : {value as string}
                                </FormHelperText>
                            ))}
                        </Box>
                    ))}

                {file && <Box flex="1" flexDirection="row" display="flex" alignItems="center">
                    <CustomFormLabel htmlFor="bill-from">File: </CustomFormLabel>
                    <CustomFormText
                    > {file.name}</CustomFormText>
                </Box>}
                {/* <LinearProgress variant="determinate" value={50} sx={{ width: '100%', }} /> */}
                {value > 0 && <LinearProgress variant="determinate" value={value} sx={{ width: '100%', marginTop: 1 }} />}

            </Grid >
        </DialogContent>

    </Dialog>
}

export default DialogImportStore;


