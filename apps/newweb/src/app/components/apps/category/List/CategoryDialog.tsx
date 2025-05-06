import { Category, Store, StoreRequest } from "@/@types/store-props"
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomFormText from "@/app/components/forms/theme-elements/CustomFormText";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import { Box, Divider, FormHelperText, IconButton, LinearProgress, MenuItem, Typography, useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid2";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from 'yup';
import { FileWithPath, useDropzone } from "react-dropzone";
import useStoreProducts from "@/hooks/store-products";
import readXlsxFile from 'read-excel-file'
import useStoreLocations from "@/hooks/store-locations";
import { LocationInfo } from "@/@types/location-props";
import toast from "react-hot-toast";
import { CategoryInfo } from "@/@types/category-props";
import { IconX } from "@tabler/icons-react";
import { getLink } from "@/utils/image";
import { Attachment } from "@/@types/product-props";
import useCategories from "@/hooks/categories";


interface DialogCategoryProps {
    category?: CategoryInfo;
    state: boolean;
    handleCloseDialog: (refresh: boolean) => void;
}
const CategoryDialog = (props: DialogCategoryProps) => {

    const [openDialog, setOpenDialog] = useState(false);
    // const handleCloseDialog = () => {
    //     setOpenDialog(false);
    // }

    useEffect(() => {
        setOpenDialog(props.state);
        if (props.state) {
            formik.resetForm();
            setPressed(false);
            if (props.category) {
                formik.setFieldValue("name", props.category.name);
                formik.setFieldValue("url", props.category.url);
                formik.setFieldValue("productUrl", props.category.productUrl)
            }
        }
    }, [props.state]);

    const validationSchema = yup.object({
        name: yup.string()
            .required('Required Information'),
        url: yup.mixed<FileWithPath | string>().required('Required Information'),
        productUrl: yup.mixed<FileWithPath | string>().required('Required Information')

    });

    const formik = useFormik<{
        name: string,
        url: FileWithPath | string | undefined,
        productUrl: FileWithPath | string | undefined
    }>({
        initialValues: {
            name: '',
            url: undefined,
            productUrl: undefined,
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
                formik.setFieldValue("url", acceptedFiles[0]);
            }


            // const formFiles = [...formik.values.images, ...acceptedFiles].slice(0, 1);
            // formik.setFieldValue("images", formFiles);

            // const _images = [...images, ...newFiles].slice(0, 1);

            // formik.setFieldValue("images", acceptedFiles);

            // setImages(_images);


        }
    });

    const { acceptedFiles: acceptedProductFiles, getRootProps: getRootPropsProduct, getInputProps: getInputPropsProduct } = useDropzone({
        maxFiles: 1,
        onDrop: acceptedProductFiles => {

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
            if (acceptedProductFiles.length > 0) {
                // setFile(acceptedProductFiles[0]);
                formik.setFieldValue("productUrl", acceptedProductFiles[0]);
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
        // const _locations = await getStoreLocations(props.store.id);
        // setLocationsDB(_locations);
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
    const { uploadFile } = useStoreProducts();
    const { createCategory, updateCategory } = useCategories();

    const handleSubmit = async () => {
        setError("");

        console.log("debug", typeof formik.values.url);
        let url = "";
        if (formik.values.url instanceof File) {
            const { data } = await uploadFile([formik.values.url]);

            if (data.length > 0) {
                url = data[0].fileName
            }

        } else if ((typeof formik.values.url) === "string") {
            url = formik.values.url ?? "";
        }


        let productUrl = "";
        console.log("debug-productUrl", formik.values.productUrl);
        if (formik.values.productUrl instanceof File) {
            const { data } = await uploadFile([formik.values.productUrl]);

            if (data.length > 0) {
                productUrl = data[0].fileName
            }

        } else if ((typeof formik.values.productUrl) === "string") {
            productUrl = formik.values.productUrl ?? "";
        }
        console.log("debug-productUrl", productUrl);
        if (props.category) {
            const { result, errorMessage } = await updateCategory(props.category.id, {
                name: formik.values.name,
                url: (url == "" ? props.category.url : url),
                productUrl: (productUrl == "" ? props.category.productUrl : productUrl),
            })

            if (result) {
                toast.success("Category have been update successfully.");
                props.handleCloseDialog(true);
                // close(true);
            } else {
                toast.error(errorMessage);
            }
        } else {

            const { result, errorMessage } = await createCategory({
                name: formik.values.name,
                url: url,
                productUrl: productUrl
            })

            if (result) {
                toast.success("Category have been created successfully.");
                props.handleCloseDialog(true);
                // close(true);
            } else {
                toast.error(errorMessage);
            }
        }

    }

    const theme = useTheme();



    return <Dialog open={openDialog} onClose={() => props.handleCloseDialog(false)} maxWidth="xs" fullWidth>
        {/* <DialogTitle>Import Product</DialogTitle> */}
        <Box flex="1" display="flex" alignItems="center" justifyContent="space-between">
            <DialogTitle>{props.category ? 'Edit' : 'Add'} Category</DialogTitle>
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
            <Grid container rowSpacing={1} spacing={2} mb={4} marginTop={0} sx={{ paddingTop: 0 }}>

                {/* 1 */}
                <Grid display="flex" alignItems="center" size={12}>
                    <CustomFormLabel htmlFor="name" sx={{ mt: 0 }}>
                        Name{" "}
                        <Typography color="error.main" component="span">
                            *
                        </Typography>
                    </CustomFormLabel>
                </Grid>
                <Grid size={12}>
                    <CustomTextField id="name"
                        name="name"
                        placeholder="Name" fullWidth
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helpertext={formik.touched.name && formik.errors.name}
                        value={formik.values.name}
                        onChange={formik.handleChange} />
                </Grid>
                <Grid display="flex" alignItems="center" size={12}>
                    <CustomFormLabel htmlFor="name" sx={{ mt: 0 }}>
                        Category Image{" "}
                        <Typography color="error.main" component="span">
                            *
                        </Typography>
                    </CustomFormLabel>
                </Grid>
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
                {formik.values.url && (
                    <Grid
                        size={12}
                        position="relative"
                    >
                        <Box sx={{ position: 'relative', width: '100%', }}>
                            <IconButton aria-label="close" onClick={() => {
                                formik.setFieldValue("url", null);
                            }} sx={{ position: 'absolute', right: 0, top: 0, width: 30, height: 30 }}>
                                <IconX width={10}></IconX>
                            </IconButton>
                            {/* <Typography variant="body1" fontWeight="500">
                          {file.name}{" "}
                      </Typography>
                      <Chip color="primary" label={`${file.size} Bytes`} /> */}
                            <div style={{ width: '100%', aspectRatio: '16/9' }}>
                                <img
                                    src={(formik.values.url instanceof File) ? URL.createObjectURL(formik.values.url) : getLink(formik.values.url ?? "")}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                // Revoke data uri after image is loaded
                                // onLoad={() => { URL.revokeObjectURL(file.preview) }}
                                />
                            </div>
                        </Box>
                    </Grid>)}

                {formik.touched.url && formik.errors.url && (
                    <FormHelperText sx={{ width: "100%", color: theme.palette.error.main, mt: '10px' }}>{formik.errors.url}</FormHelperText>
                )}

                <Grid display="flex" alignItems="center" size={12}>
                    <CustomFormLabel htmlFor="name" sx={{ mt: 0 }}>
                        Product Image{" "}
                        <Typography color="error.main" component="span">
                            *
                        </Typography>
                    </CustomFormLabel>
                </Grid>
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
                    {...getRootPropsProduct({ className: "dropzone" })}
                >
                    <input {...getInputPropsProduct()} />
                    <p>Drag &apos;n&apos;  drop some files here, or click to select files</p>
                </Box>
                {formik.values.productUrl && (
                    <Grid
                        size={12}
                        position="relative"
                    >
                        <Box sx={{ position: 'relative', width: '100%', }}>
                            <IconButton aria-label="close" onClick={() => {
                                formik.setFieldValue("productUrl", null);
                            }} sx={{ position: 'absolute', right: 0, top: 0, width: 30, height: 30 }}>
                                <IconX width={10}></IconX>
                            </IconButton>
                            <div style={{ width: '100%', aspectRatio: '1/1' }}>
                                <img
                                    src={(formik.values.productUrl instanceof File) ? URL.createObjectURL(formik.values.productUrl) : getLink(formik.values.productUrl ?? "")}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                // Revoke data uri after image is loaded
                                // onLoad={() => { URL.revokeObjectURL(file.preview) }}
                                />
                            </div>
                        </Box>
                    </Grid>)}

                {formik.touched.productUrl && formik.errors.productUrl && (
                    <FormHelperText sx={{ width: "100%", color: theme.palette.error.main, mt: '10px' }}>{formik.errors.productUrl}</FormHelperText>
                )}

                {error && (
                    <FormHelperText sx={{ width: "100%", color: theme.palette.error.main }}>{error}</FormHelperText>
                )}
                {pressed && <LinearProgress variant="determinate" value={value} />}

            </Grid >
        </DialogContent>

    </Dialog>
}

export default CategoryDialog;
