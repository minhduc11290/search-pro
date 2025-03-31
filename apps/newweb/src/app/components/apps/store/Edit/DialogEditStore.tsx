import { Category, Store, StoreRequest } from "@/@types/store-props"
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import { Divider, MenuItem } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid2";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from 'yup';

interface DialogEditProps {
    store: Store;
    categories: Category[];
    state: boolean;
    handleCloseDialog: () => void;
}
const DialogEditStore = (props: DialogEditProps) => {

    const [openDialog, setOpenDialog] = useState(false);
    // const handleCloseDialog = () => {
    //     setOpenDialog(false);
    // }

    useEffect(() => {
        setOpenDialog(props.state);
    }, [props.state]);


    const validationSchema = yup.object({
        ownerstore: yup
            .string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Store name is Required'),
        userName: yup
            .string()
            // .min(8, 'Password should be of minimum 8 characters length')
            .required('Password is required'),
        email: yup.string().email(),
    });

    useEffect(() => {
        if (props.store) {
            formik.setFieldValue('ownerstore', props.store?.ownerstore);
            formik.setFieldValue('userName', props.store?.userName);
            formik.setFieldValue('phone', props.store?.phone);
            formik.setFieldValue('email', props.store?.email);
            formik.setFieldValue('category', props.store?.category);
        }
    }, [props.store]);


    const formik = useFormik({
        initialValues: {
            ownerstore: '',
            phone: '',
            email: '',
            category: '',
            website: ''
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

        },
    });



    return <Dialog open={openDialog} onClose={props.handleCloseDialog} maxWidth="md">
        <DialogTitle>Edit Store</DialogTitle>
        <DialogContent>
            <Grid container rowSpacing={0} spacing={2} mb={4} marginTop={0} sx={{ paddingTop: 0 }}>
                <Grid size={12} sx={{ paddingTop: 0, marginTop: 0 }}>
                    <Divider></Divider>
                </Grid>
                <Grid size={6} sx={{ paddingTop: 0, marginTop: 0 }}>
                    <CustomFormLabel htmlFor="bill-from">Store Name</CustomFormLabel>
                    <CustomTextField

                        id="ownerstore"
                        name="ownerstore"
                        value={formik.values.ownerstore}
                        onChange={formik.handleChange}
                        helperText={formik.touched.ownerstore && formik.errors.ownerstore}
                        error={formik.touched.ownerstore && Boolean(formik.errors.ownerstore)}s
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
                        sx={{
                            mt: {
                                xs: 0,
                                sm: 3,
                            },
                        }}
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
                <Grid size={6}>
                    <CustomFormLabel
                        htmlFor="bill-to"
                        sx={{
                            mt: {
                                xs: 0,
                                sm: 3,
                            },
                        }}
                    >
                        Email
                    </CustomFormLabel>
                    <CustomTextField

                        name="email"
                        value={formik.values.email}
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
        <DialogActions>
            <Button color="primary"
                variant="outlined" onClick={props.handleCloseDialog}>
                Cancel
            </Button>
            <Button
                variant="contained"
                onClick={props.handleCloseDialog}
            >
                Save
            </Button>
        </DialogActions>
    </Dialog>
}

export default DialogEditStore;