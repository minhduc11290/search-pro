import { Category, Store, StoreRequest, UpdateStoreRequest } from "@/@types/store-props"
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import useStore from "@/hooks/stores";
import { Box, Divider, FormControlLabel, MenuItem, RadioGroup, Stack, Typography, useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid2";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from 'yup';
import toast from "react-hot-toast";
import CustomRadio from "@/app/components/forms/theme-elements/CustomRadio";

interface DialogEditProps {
    store: Store;
    categories: Category[];
    state: boolean;
    handleCloseDialog: (refresh?: Boolean) => void;
}
const DialogEditStore = (props: DialogEditProps) => {

    const [openDialog, setOpenDialog] = useState(false);
    const [pressed, setPressed] = useState(false);
    // const handleCloseDialog = () => {
    //     setOpenDialog(false);
    // }

    useEffect(() => {
        // if (!props.state) {
        //     formik.resetForm();
        // }
        setOpenDialog(props.state);
    }, [props.state]);


    const validationSchema = yup.object({
        ownerstore: yup
            .string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required Information'),
        // password: yup
        //     .string()
        //     // .min(8, 'Password should be of minimum 8 characters length')
        //     .required('Required Information'),
        email: yup.string().email().required('Required Information'),

    });

    useEffect(() => {
        formik.resetForm();
        if (props.store) {
            formik.setFieldValue('ownerstore', props.store?.ownerstore);
            formik.setFieldValue('userName', props.store?.userName);
            formik.setFieldValue('phone', props.store?.phone);
            formik.setFieldValue('email', props.store?.email);
            formik.setFieldValue('category', props.store?.category);
            formik.setFieldValue('website', props.store?.website);
            formik.setFieldValue('type', props.store?.type);
        }
    }, [props.state]);

    const { updateStore } = useStore();

    const formik = useFormik({
        initialValues: {
            ownerstore: '',
            phone: '',
            email: '',
            category: '',
            website: '',
            type: 'RETAIL',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setPressed(true);
            const store: UpdateStoreRequest = {
                name: values.ownerstore,
                primaryPhone: values.phone,
                // password: values.password,
                email: values.email,
                isActive: true,
                categoryId: values.category,
                website: values.website,
                type: values.type,
            };
            const { result, errorMessage, statusCode } = await updateStore(props.store.id, store);

            if (result) {
                toast.success("Store information have been updated successfully")
                props.handleCloseDialog(true);
                formik.resetForm();
            } else {
                if (statusCode != 409) {
                    toast.error(errorMessage);
                } else {
                    formik.setFieldError("email", errorMessage);
                }
            }
            setPressed(false);

        },
    });

    const theme = useTheme();


    return <Dialog open={openDialog} onClose={() => { props.handleCloseDialog(false); formik.resetForm() }} maxWidth="md">
        {/* <DialogTitle>Edit Store</DialogTitle> */}

        <Box flex="1" display="flex" alignItems="center" justifyContent="space-between">
            <DialogTitle>Edit Store</DialogTitle>
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
                <Grid size={12} sx={{ paddingTop: 0, marginTop: 0 }}>
                    <Divider></Divider>
                </Grid>
                <Grid size={6} sx={{ paddingTop: 0, marginTop: 0 }}>
                    <CustomFormLabel htmlFor="bill-from">Store Name <Typography color="error.main" component="span">
                        *
                    </Typography></CustomFormLabel>
                    <CustomTextField
                        id="ownerstore"
                        name="ownerstore"
                        value={formik.values.ownerstore}
                        onChange={formik.handleChange}
                        helperText={formik.touched.ownerstore && formik.errors.ownerstore}
                        error={formik.touched.ownerstore && Boolean(formik.errors.ownerstore)}
                        fullWidth
                    />
                </Grid>
                <Grid size={6} sx={{ paddingTop: 0, marginTop: 0 }}>
                    <CustomFormLabel htmlFor="bill-from">
                        Email <Typography color="error.main" component="span">
                            *
                        </Typography>
                    </CustomFormLabel>
                    <CustomTextField

                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        helperText={formik.touched.email && formik.errors.email}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        fullWidth
                    />
                </Grid>
                <Grid size={6} >
                    <CustomFormLabel htmlFor="bill-from">Category</CustomFormLabel>
                    <CustomSelect

                        labelId="category"
                        id="category"
                        name="category"
                        value={formik.values.category}
                        onChange={formik.handleChange}
                        fullWidth
                    >
                        {props.categories.map((item: Category) =>
                            <MenuItem value={item.id} key={item.id}>{item.name}</MenuItem>
                        )
                        }
                    </CustomSelect>
                </Grid >
                <Grid size={6}>
                    <CustomFormLabel
                        htmlFor="bill-to"

                    >
                        Phone Number
                    </CustomFormLabel>
                    <CustomTextField
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid size={12}>
                    <CustomFormLabel
                        htmlFor="bill-to"
                        sx={{
                            mt: {
                                xs: 0,
                                sm: 3,
                            },
                        }}
                    >
                        Store Type
                    </CustomFormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-form-control-label-placement"
                        name="type"
                        value={formik.values.type}
                        onChange={formik.handleChange}
                    >
                        <Stack
                            direction="row"
                            spacing={3}
                            width="100%"
                            useFlexGap
                            flexWrap="wrap"
                        >

                            <Box
                                px={2}
                                py={1}
                                flexGrow={1}
                                sx={{
                                    border: `1px dashed ${theme.palette.divider}`,
                                    textAlign: "center",
                                }}
                            >
                                <FormControlLabel
                                    value="RETAIL"
                                    control={<CustomRadio />}
                                    label="Retail"
                                />
                            </Box>
                            <Box
                                px={2}
                                py={1}
                                flexGrow={1}
                                sx={{
                                    border: `1px dashed ${theme.palette.divider}`,
                                    textAlign: "center",
                                }}
                            >
                                <FormControlLabel
                                    value="SERVICE"
                                    control={<CustomRadio />}
                                    label="Service"
                                />
                            </Box>
                        </Stack>
                    </RadioGroup>
                </Grid>

                <Grid size={12}>
                    <CustomFormLabel
                        htmlFor="bill-to"
                    >
                        Website
                    </CustomFormLabel>
                    <CustomTextField
                        name="website"
                        value={formik.values.website}
                        onChange={formik.handleChange}
                        fullWidth
                    />
                </Grid>


            </Grid >
        </DialogContent>
        {/* <DialogActions>
            <Button color="primary"
                variant="outlined" onClick={() => { props.handleCloseDialog(false); formik.resetForm() }}>
                Cancel
            </Button>
            <Button
                variant="contained"
                disabled={pressed}
                onClick={() => {

                    formik.submitForm();
                }}
            >
                Save
            </Button>
        </DialogActions> */}
    </Dialog>
}

export default DialogEditStore;