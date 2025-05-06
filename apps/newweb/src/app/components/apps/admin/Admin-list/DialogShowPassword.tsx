import { Category, Store, StoreRequest } from "@/@types/store-props"
import { UserInfo } from "@/@types/user-props";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomFormText from "@/app/components/forms/theme-elements/CustomFormText";
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

interface DialogShowPassProps {
    user?: UserInfo;
    state: boolean;
    handleCloseDialog: () => void;
}
const DialogShowPass = (props: DialogShowPassProps) => {

    const [openDialog, setOpenDialog] = useState(false);
    // const handleCloseDialog = () => {
    //     setOpenDialog(false);
    // }

    useEffect(() => {
        setOpenDialog(props.state);
    }, [props.state]);




    return <Dialog open={openDialog} onClose={props.handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Show password</DialogTitle>
        <DialogContent>
            <Grid container rowSpacing={0} spacing={2} mb={4} marginTop={0} sx={{ paddingTop: 0 }}>
                <Grid size={12} sx={{ paddingTop: 0, marginTop: 0 }}>
                    <Divider></Divider>
                </Grid>
                <Grid size={6} sx={{ paddingTop: 0, marginTop: 0 }}>
                    <CustomFormLabel htmlFor="bill-from">Password</CustomFormLabel>
                    <CustomFormText
                    > {props.user?.pw} </CustomFormText>
                </Grid>
            </Grid >
        </DialogContent>
        <DialogActions>
            <Button variant="contained" onClick={props.handleCloseDialog}>
                Close
            </Button>

        </DialogActions>
    </Dialog>
}

export default DialogShowPass;