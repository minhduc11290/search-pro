import { FileInfo } from "@/@types/file-info";
import { LocationInfo } from "@/@types/location-props";
import { Attachment, LocationPrice, Product } from "@/@types/product-props";
import { Category, Store, StoreRequest } from "@/@types/store-props"
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import CustomSwitch from "@/app/components/forms/theme-elements/CustomSwitch";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import BlankCard from "@/app/components/shared/BlankCard";
import useStoreLocations from "@/hooks/store-locations";
import useStoreProducts from "@/hooks/store-products";
import { getLink } from "@/utils/image";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Autocomplete, Box, Chip, Divider, Fab, FormHelperText, IconButton, MenuItem, Switch, Tab, TextField, Tooltip, Typography, useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid2";
import { IconPlus, IconTrash, IconX } from "@tabler/icons-react";

import { Formik, FormikErrors, useFormik } from "formik";
import { useEffect, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import * as yup from 'yup';

interface DialogProductProps {
    product?: Product | null;
    state: boolean;
    store: Store;
    categories: Category[];
    handleCloseDialog: (refresh?: boolean) => void;
}

const DialogProduct = (props: DialogProductProps) => {

    const [openDialog, setOpenDialog] = useState(false);
    const [locations, setLocations] = useState<LocationInfo[]>([]);
    const { getStoreLocations } = useStoreLocations();
    const [locationDelete, setLocationDelete] = useState<string[]>([]);
    const [attachments, setAttachments] = useState<Attachment[]>([]);

    const { createProduct, updateProduct, uploadFile, updateLocation, addLocation, addAttachment, deleteAttachment, deleteLocations } = useStoreProducts();

    const _updateProduct = async () => {
        let images: FileInfo[] = [];

        // 
        const locations = formik.values.locations;
        //update locations 
        console.log("locations", locations);

        if (locationDelete && locationDelete.length > 0) {
            await deleteLocations(locationDelete);
        }

        const filterUpdateLocation = locations.filter((location) => location.status != 'ADD')
        console.log("filterUpdateLocation", filterUpdateLocation);
        if (filterUpdateLocation) {
            for (const _location of filterUpdateLocation) {
                await updateLocation(_location);
            }
        }

        const filterAddLocation = locations.filter((location) => location.status == 'ADD')
        console.log("filterAddLocation", filterAddLocation);
        if (filterAddLocation) {
            for (const _location of filterAddLocation) {
                await addLocation(props.product?.id ?? '', _location);
            }
        }

        if (imageDelete) {
            for (const _image of imageDelete) {
                await deleteAttachment(_image);
            }
        }

        if (formik.values.images && formik.values.images.length > 0) {
            const { data } = await uploadFile(formik.values.images);

            images = [...data];
            // for (const _image in data) {
            //     attachments.push({
            //         id: "",
            //         name: _image.fileName
            //     });
            // }
            const attachments: Attachment[] = images.map((image) => {
                return {
                    name: image.fileName,
                    url: image.fileName,
                }
            });
            await addAttachment(props.product?.id ?? '', attachments);
        }



        const { result, errorMessage } = await updateProduct(props.product?.id ?? '', {
            sku: formik.values.sku,
            name: formik.values.name,
            keywords: formik.values.keywords,
            description: formik.values.description,
            isActive: formik.values.status,
        });



        if (result) {
            toast.success("Product have been update successfully.");
            props.handleCloseDialog(true);
            // close(true);
        } else {
            toast.error(errorMessage);
        }
    }

    const _addProduct = async () => {
        let images: FileInfo[] = [];
        if (formik.values.images) {
            const { data } = await uploadFile(formik.values.images);

            images = [...data];
        }
        // 

        const { result, errorMessage, statusCode } = await createProduct(props.store.id, {
            sku: formik.values.sku,
            name: formik.values.name,
            keywords: formik.values.keywords,
            description: formik.values.description,
            productLocations: formik.values.locations.map((location) => {
                return {
                    locationId: location.locationID,
                    price: location.price ?? 0
                };
            }),
            attachments: images.map((image) => {
                return {
                    name: image.fileName,
                    url: image.fileName,
                }
            }),
            isActive: formik.values.status
        });

        if (result) {
            toast.success("Product have been created successfully.");
            props.handleCloseDialog(true);
            formik.resetForm();
        } else {
            if (statusCode != 409) {
                toast.error(errorMessage);
            } else {
                formik.setFieldError('sku', errorMessage);
            }
        }

    }

    useEffect(() => {
        setOpenDialog(props.state);

        _getLocation();
        // if (!props.state) {
        //     formik.resetForm();
        // }

    }, [props.state]);

    const _getLocation = async () => {
        if (props.state) {
            const _locations = await getStoreLocations(props.store.id);
            setLocations(_locations);
        }
    }

    const validationSchema = yup.object({
        name: yup
            .string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required information'),
        description: yup.string().max(1000, 'Only 1000 character'),

        email: yup.string().email(),
        locations: yup.array().of(
            yup.object({
                locationID: yup.string().required("Required information").test(
                    'unique-locationID',
                    'Location ID must be unique',
                    (value, context) => {
                        if (!value) return false; // Nếu không có giá trị, trả về false
                        const { parent, options } = context; // Lấy context của Yup
                        const locations = options?.context?.locations || []; // Lấy danh sách locations
                        const count = locations.filter((loc: any) => loc.locationID === value).length;
                        return count <= 1; // Nếu `locationID` xuất hiện nhiều hơn 1 lần, báo lỗi
                    }
                ),
                price: yup
                    .number().transform((value, originalValue) => (originalValue === '' ? undefined : value)) // ✅ Chuyển chuỗi rỗng thành undefined
                    .typeError('Price must be a number').required('Required information'),
            }))
    });

    const theme = useTheme();

    const [pressed, setPressed] = useState(false);

    const formik = useFormik<{
        sku: string,
        name: string,
        description: string,
        keywords: string[],
        locations: LocationPrice[],
        status: boolean,
        images: FileWithPath[]
    }>({
        initialValues: {
            sku: '',
            name: '',
            description: '',
            keywords: [],
            locations: [],
            status: true,
            images: [],
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            // const store: StoreRequest = {
            //     name: values.ownerstore,
            //     primaryPhone: values.phone,
            //     // password: values.password,
            //     email: values.email,
            //     isActive: true,
            //     categoryId: values.category
            // };
            setPressed(true);
            if (props.product) {
                _updateProduct();
            } else {
                _addProduct();

            }
            setPressed(false);
            // props.handleCloseDialog(true);

        },
    });

    const [tabValue, setTabValue] = useState('1');

    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

    const [tags, setTags] = useState<string[]>([]);
    const [status, setStatus] = useState(false)
    const handleChangeStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStatus(event.target.checked);
    };

    // const [prices, setPrices] = useState<string[]>([]);

    const removeLocationPrice = (index: number) => {
        const _locations = formik.values.locations;
        if (_locations[index].id) {
            setLocationDelete([...locationDelete, _locations[index].id!]);
        }
        _locations.splice(index, 1);
        formik.setFieldValue("locations", _locations);
    }

    const addPrice = () => {
        // setPrices([...prices, (prices.length + 1).toString()]);
        const _locations = formik.values.locations
        _locations.push({
            locationID: '',
            status: 'ADD'
        });
        formik.setFieldValue("locations", _locations)
    }
    const [imageDelete, setImageDelete] = useState<string[]>([]);
    const [images, setImages] = useState<Attachment[]>([]);



    useEffect(() => {

        setAttachments([]);
        setImages([]);
        formik.resetForm();
        if (props.product) {

            formik.setFieldValue('name', props.product.productName);
            formik.setFieldValue('description', props.product.description);
            formik.setFieldValue('keywords', props.product.keysword);
            formik.setFieldValue('sku', props.product.SKU);
            formik.setFieldValue('status', props.product.status);

            formik.setFieldValue('locations', props.product.locationInfo);
            setAttachments(props.product.attachments);
        } else {

        }

    }, [props.product])

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        maxFiles: 5,
        onDrop: acceptedFiles => {

            // setImages(acceptedFiles.map(file => Object.assign(file, {
            //     name: file.name,
            //     url: URL.createObjectURL(file)
            // })));
            const newFiles = acceptedFiles.map(file => {
                return {
                    name: file.name,
                    url: URL.createObjectURL(file)
                }
            });

            const formFiles = [...formik.values.images, ...acceptedFiles].slice(0, 5);
            formik.setFieldValue("images", formFiles);

            const _images = [...images, ...newFiles].slice(0, 5);

            // formik.setFieldValue("images", acceptedFiles);

            setImages(_images);

        }
    });

    const thumbs = images.map((file: any, i: number) => (
        <Grid
            size={4}
            key={i}
            position="relative"
        >
            <Box sx={{ position: 'relative', width: '100%', }}>
                <IconButton aria-label="close" onClick={() => {
                    let _images = formik.values.images;
                    _images.splice(i, 1);
                    formik.setFieldValue("images", _images);
                    setImageDelete([...imageDelete, file.id!]);

                    images.splice(i, 1);
                    setImages([...images]);
                }} sx={{ position: 'absolute', right: 0, top: 0, width: 30, height: 30 }}>
                    <IconX width={10}></IconX>
                </IconButton>
                {/* <Typography variant="body1" fontWeight="500">
                    {file.name}{" "}
                </Typography>
                <Chip color="primary" label={`${file.size} Bytes`} /> */}
                <div style={{ width: '100%', aspectRatio: '1/1' }}>
                    <img
                        src={file.url}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    // Revoke data uri after image is loaded
                    // onLoad={() => { URL.revokeObjectURL(file.preview) }}
                    />
                </div>
            </Box>
        </Grid>
    ));

    const thumbServers = attachments.map((file: Attachment, i: number) => (
        <Grid
            size={4}
            key={i}
            position="relative"
        >
            <Box sx={{ position: 'relative', width: '100%', }}>
                <IconButton aria-label="close" onClick={() => {
                    setImageDelete([...imageDelete, file.id!]);
                    attachments.splice(i, 1);
                    setAttachments([...attachments]);
                }} sx={{ position: 'absolute', right: 0, top: 0, width: 30, height: 30 }}>
                    <IconX width={10}></IconX>
                </IconButton>
                {/* <Typography variant="body1" fontWeight="500">
                    {file.name}{" "}
                </Typography>
                <Chip color="primary" label={`${file.size} Bytes`} /> */}
                <div style={{ width: '100%', aspectRatio: '1/1' }}>
                    <img
                        src={getLink(file.name)}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    // Revoke data uri after image is loaded
                    // onLoad={() => { URL.revokeObjectURL(file.preview) }}
                    />
                </div>
            </Box>
        </Grid>
    ));
    return <Dialog open={openDialog} onClose={() => { props.handleCloseDialog(false); formik.resetForm(); }
    } maxWidth="lg" fullWidth sx={{ minHeight: 350 }}>
        {/* <DialogTitle>{props.product ? 'Edit' : 'Add'} Product</DialogTitle> */}
        <Box flex="1" display="flex" alignItems="center" justifyContent="space-between">
            <DialogTitle>{props.product ? 'Edit' : 'Add'} Product</DialogTitle>
            <Box paddingRight={3} display="flex" gap={2}>
                <Button color="primary"
                    variant="outlined" onClick={() => { props.handleCloseDialog(false); formik.resetForm(); }}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    disabled={pressed}
                    onClick={() => { formik.submitForm() }}
                >
                    Save
                </Button>
            </Box>
        </Box>
        <DialogContent sx={{ paddingTop: 0, paddingBottom: 0 }}>
            <Grid container rowSpacing={0} mb={4}>
                <Grid size={12} sx={{ paddingTop: 0, marginTop: 0 }}>
                    <Divider sx={{ my: 0 }}></Divider>
                </Grid>
                <Grid size={12} mt={2}>
                    <Grid container spacing={3}>
                        <Grid size={8}>
                            <BlankCard>
                                <Box px={2} py={1}>
                                    <Box display="flex" flex="1" justifyContent="space-between" flexDirection="row">
                                        <Typography variant="h5">General Information</Typography>
                                        <Switch color="success" name="status" checked={formik.values.status} onChange={formik.handleChange} sx={{ marginLeft: 0 }} />
                                    </Box>
                                    <Divider sx={{ marginBottom: 0 }}></Divider>
                                    <Grid container mt={1} spacing={1}>
                                        {/* 1 */}
                                        <Grid size={12}>
                                            <CustomFormLabel htmlFor="addressLine1" sx={{ mt: 0 }}>
                                                Product Name{" "}
                                                <Typography color="error.main" component="span">
                                                    *
                                                </Typography>
                                            </CustomFormLabel>
                                            <CustomTextField id='productname' variant='outlined' fullWidth placeholder="Enter product name"
                                                name="name"
                                                value={formik.values.name}
                                                onChange={formik.handleChange}
                                                helperText={formik.touched.name && formik.errors.name}
                                                error={formik.touched.name && Boolean(formik.errors.name)}

                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <CustomFormLabel htmlFor="addressLine1" sx={{ mt: 0 }}>
                                                SKU{" "}
                                                <Typography color="error.main" component="span">
                                                    *
                                                </Typography>
                                            </CustomFormLabel>
                                            <CustomTextField id='productname' variant='outlined' fullWidth name="sku"
                                                value={formik.values.sku}
                                                onChange={formik.handleChange}
                                                helperText={formik.touched.sku && formik.errors.sku}
                                                error={formik.touched.sku && Boolean(formik.errors.sku)}
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <Box display="flex" flex="1" justifyContent="space-between" flexDirection="row">
                                                <Typography variant="h5">Price Information</Typography>
                                                <Fab color="primary" aria-label="send" size="small" onClick={() => addPrice()}>
                                                    <IconPlus width={14}></IconPlus>
                                                </Fab>
                                            </Box>
                                            <Divider sx={{ my: 1 }}></Divider>
                                            {
                                                formik.values.locations.map((price, index) => {

                                                    return (<Grid container spacing={3} mb={2}>
                                                        <Grid size={6}>
                                                            <CustomSelect
                                                                id="locationID"
                                                                // value={age}
                                                                // onChange={handleChange}
                                                                value={price.locationID}
                                                                name={`locations.${index}.locationID`}
                                                                placeholder="Select a location"
                                                                onChange={formik.handleChange}
                                                                fullWidth
                                                                displayEmpty
                                                            >
                                                                {/* <MenuItem value={0}>Address 1</MenuItem>
                                                        <MenuItem value={0}>Address 2</MenuItem>s
                                                        <MenuItem value={0}>Address 3</MenuItem> */}
                                                                <MenuItem value="">
                                                                    <em>Select a location</em>
                                                                </MenuItem>
                                                                {

                                                                    locations.map((location: LocationInfo) => {
                                                                        return <MenuItem value={location.locationID} >{location.address}</MenuItem>
                                                                    })
                                                                }
                                                            </CustomSelect>
                                                            {formik.touched.locations && formik.errors.locations && (
                                                                <FormHelperText sx={{ color: theme.palette.error.main }}>{(formik.errors.locations[index] as FormikErrors<{ locationID: string }> | undefined)?.locationID}</FormHelperText>
                                                            )}
                                                        </Grid>
                                                        <Grid size={5}>
                                                            <CustomTextField placeholder="Price" fullWidth
                                                                name={`locations.${index}.price`}
                                                                onChange={formik.handleChange}
                                                                value={price.price}
                                                                helperText={formik.errors.locations && formik.touched.locations && (formik.errors.locations[index] as FormikErrors<{ price: string }> | undefined)?.price}
                                                                error={formik.errors.locations && formik.touched.locations && Boolean((formik.errors.locations[index] as FormikErrors<{ price: string }> | undefined)?.price)}
                                                            />
                                                        </Grid>
                                                        <Grid size={1} alignItems="center" display="flex">
                                                            <Tooltip title="Delete">
                                                                {/* <Button color="error" aria-label="delete">
                                                                    <IconX size={21} onClick={() => { removeLocationPrice(index); }} />
                                                                </Button> */}
                                                                <IconButton size="large" color="error" onClick={() => { removeLocationPrice(index); }}>
                                                                    <IconTrash size={18}></IconTrash>
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Grid>
                                                    </Grid>)
                                                })
                                            }
                                            {/* <Button variant="text" startIcon={<IconPlus size={18} />} onClick={() => { addPrice() }}>
                                                Add another price
                                            </Button> */}
                                        </Grid>
                                        <Grid display="flex" alignItems="center" size={12}>
                                            {/* <CustomFormLabel htmlFor="addressLine1" sx={{ mt: 0 }}>
                                                Description{" "}
                                            </CustomFormLabel> */}
                                            <Typography variant="h5">Description</Typography>
                                        </Grid>
                                        <Grid size={12}>
                                            <Divider sx={{ my: 1, mt: 0 }}></Divider>
                                            <CustomTextField
                                                id="txt-message"
                                                multiline
                                                rows={4}
                                                variant="outlined"
                                                placeholder="Enter product description"
                                                fullWidth
                                                name="description"
                                                sx={{
                                                    '& .MuiInputBase-inputMultiline': {
                                                        paddingTop: '0', // Điều chỉnh khoảng cách từ trên xuống
                                                        paddingLeft: '0', // Điều chỉnh khoảng cách từ trái
                                                    },
                                                }}
                                                value={formik.values.description}
                                                onChange={formik.handleChange}
                                                helperText={formik.touched.description && formik.errors.description}
                                                error={formik.touched.description && Boolean(formik.errors.description)}
                                            />
                                        </Grid>
                                        {/* <Grid display="flex" alignItems="center" size={12}>
                                            <CustomFormLabel htmlFor="addressLine1" sx={{ mt: 0 }}>
                                                Keywords{" "}
                                            </CustomFormLabel>
                                        </Grid> */}
                                        {/* <Grid size={12}>
                                            <Autocomplete
                                                multiple
                                                freeSolo
                                                options={[]} // Không có options cố định
                                                // value={tags}
                                                // name="keywords"
                                                value={formik.values.keywords}
                                                onChange={(event, newValue) =>
                                                    formik.setFieldValue("keywords", newValue)}
                                                renderTags={(value, getTagProps) =>
                                                    value.map((option, index) => (
                                                        <Chip label={option} {...getTagProps({ index })} />
                                                    ))
                                                }
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </Grid> */}


                                    </Grid>
                                </Box>
                            </BlankCard>
                            <Box p={1}>
                            </Box>
                            {/* <BlankCard>
                                <Box p={3}>
                                    
                                </Box>
                            </BlankCard> */}
                        </Grid>
                        <Grid size={4} rowGap={2}>
                            <BlankCard>
                                <Box p={3}>
                                    <Typography variant="h5">Thumnail</Typography>
                                    <Box
                                        mt={3}
                                        fontSize="12px"
                                        sx={{
                                            backgroundColor: "primary.light",
                                            color: "primary.main",
                                            padding: "30px",
                                            textAlign: "center",
                                            border: `1px dashed`,
                                            borderColor: "primary.main",
                                        }}
                                        {...getRootProps({ className: "dropzone" })}
                                    >
                                        <input {...getInputProps()} />
                                        <p>Drag &apos;n&apos;  drop some files here, or click to select files</p>
                                    </Box>
                                    <Typography variant="body2" textAlign="center" mt={1}>
                                        Set the product thumbnail image. Only *.png, *.jpg and *.jpeg image
                                        files are accepted. Please upload images with a width greater than 300px and a ratio of 1/1
                                    </Typography>
                                    <Box mt={2}>
                                        <Typography variant="h6" fontSize="15px">
                                            Files
                                        </Typography>
                                        {/* <Typography variant="body1">{files}</Typography> */}
                                        <Grid container size={12} spacing={1}> {thumbServers}</Grid>
                                        <Grid container size={12} spacing={1}> {thumbs}</Grid>
                                    </Box>
                                </Box>
                            </BlankCard>
                        </Grid>
                    </Grid >
                </Grid>
            </Grid>
        </DialogContent>
        {/* <DialogActions>
            
        </DialogActions> */}
    </Dialog >
}



export default DialogProduct;