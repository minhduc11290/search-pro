"use client";
import React, { useState, useContext, useEffect } from "react";
import { InvoiceContext } from "@/app/context/InvoiceContext";
import {
  Alert,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Box,
  Stack,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  Switch,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import { useRouter } from "next/navigation";
import { format, isValid } from "date-fns";
import {
  IconPlus,
  IconSquareRoundedPlus,
  IconTrash,
} from "@tabler/icons-react";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import { UserInfo } from "@/@types/user-props";
import * as yup from 'yup';
import { useFormik } from "formik";
import useAdmin from "@/hooks/admins";
import toast from "react-hot-toast";
import { Status } from "@/@types/enum/status";
interface AdminProps {
  state: boolean;
  user?: UserInfo;
  handleCloseDialog: (refresh?: boolean) => void;
}

const AddAdminDialog = (props: AdminProps) => {

  useEffect(() => {
    setOpenDialog(props.state);
  }, [props.state])


  const handleSubmit = async (e: React.FormEvent) => {

  };

  // name: z
  //           .string({
  //               required_error: 'Required information',
  //           }).trim()
  //           .min(1, { message: 'Required information' }),
  //       email: z.string().trim().email({ message: 'Invalid email' }).min(1, { message: 'Required information' }),
  //       // primaryPhone: z.string().regex(phoneRegex, 'Invalid phone').min(1, { message: 'Required information' }),
  //       // userName: z.string().trim().min(4).min(1, { message: 'Required information' }),
  //       password: z.string().min(4),
  //       confirmPassword: z.string().min(4),

  const createValidationSchema = yup.object({
    name: yup
      .string()
      .min(2, 'Too Short!')
      .max(255, 'Too Long! Only 255 character')
      .required('Required information'),
    password: yup
      .string()
      // .min(8, 'Password should be of minimum 8 characters length')
      .required('Required information'),
    email: yup.string().email().required("Required information"),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password'), null], 'Passwords must match').required("Required information"),
  });

  const updateValidationSchema = yup.object({
    name: yup
      .string()
      .min(2, 'Too Short!')
      .max(255, 'Too Long! Only 255 character')
      .required('Required information'),

    email: yup.string().email().required("Required information"),

  });

  const [pressed, setPressed] = useState(false);
  const { createAdmin, updateAdmin } = useAdmin();

  const formik = useFormik<{
    name: string,
    password: string,
    email: string,
    confirmPassword: string,
    status: boolean,
  }>({
    initialValues: {
      name: '',
      password: '',
      email: '',
      confirmPassword: '',
      status: true
    },
    validationSchema: props.user ? updateValidationSchema : createValidationSchema,
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
      if (props.user) {
        const { result, errorMessage } = await updateAdmin(props.user.id ?? "", {
          name: values.name,
          primaryPhone: "",
          email: values.email,
          isActive: values.status
        });
        if (result) {
          toast.success("Admin have been updated successfully")
          props.handleCloseDialog(true);
          formik.resetForm();
        } else {
          toast.error(errorMessage);
        }
      } else {
        const { result, errorMessage, statusCode } = await createAdmin({
          name: values.name,
          primaryPhone: "",
          password: values.password,
          email: values.email,
          isActive: true
        });
        if (result) {
          toast.success("Admin have been created successfully")
          props.handleCloseDialog(true);
          formik.resetForm();
        } else {
          if (statusCode != 409) {
            toast.error(errorMessage);
          } else {
            formik.setFieldError('email', errorMessage);
          }
        }
      }
      setPressed(false);
      // props.handleCloseDialog(true);

    },
  });


  useEffect(() => {
    formik.resetForm();
    console.log(props.user);
    if (props.user) {
      formik.setFieldValue('name', props.user.fullName);
      formik.setFieldValue('email', props.user.email);
      formik.setFieldValue('status', props.user.status == Status.Active);
    }
  }, [props.state])

  const [openDialog, setOpenDialog] = useState(false);

  return (<Dialog open={openDialog} onClose={() => { props.handleCloseDialog(false); formik.resetForm(); }
  } maxWidth="lg" fullWidth sx={{ minHeight: 350 }}>
    {/* <DialogTitle>{props.product ? 'Edit' : 'Add'} Product</DialogTitle> */}
    <Box flex="1" display="flex" alignItems="center" justifyContent="space-between">
      <DialogTitle>{props.user ? 'Edit' : 'Add'} Admin</DialogTitle>
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
      <Grid container rowSpacing={0} mb={4} columnSpacing={2}>
        <Grid size={12} sx={{ paddingTop: 0, marginTop: 0 }}>
          <Divider sx={{ my: 0 }}></Divider>
        </Grid>
        <Grid flex="1" alignItems="end" justifyContent="end" size={12} pt={0}>
          <Switch color="success" name="status" checked={formik.values.status} onChange={formik.handleChange} sx={{ marginLeft: 0 }} />
        </Grid>
        <Grid size={12}>
          <CustomFormLabel htmlFor="bill-from">Full Name <Typography color="error.main" component="span">
            *
          </Typography></CustomFormLabel>
          <CustomTextField
            id="ownerstore"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            fullWidth
            helperText={formik.touched.name && formik.errors.name}
            error={formik.touched.name && Boolean(formik.errors.name)}
          />
        </Grid>
        <Grid size={12} pt={0}>
          <CustomFormLabel
            htmlFor="bill-to"
          >
            Email  <Typography color="error.main" component="span">
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
        {!props.user && <Grid size={6} pt={0}>
          <CustomFormLabel
            htmlFor="bill-to"

          >
            Password  <Typography color="error.main" component="span">
              *
            </Typography>
          </CustomFormLabel>
          <CustomTextField
            id="password"
            type="password"
            variant="outlined"
            fullWidth
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}

          />
        </Grid>}
        {!props.user && <Grid size={6} pt={0}>
          <CustomFormLabel
            htmlFor="bill-to"

          >
            Confirm Password  <Typography color="error.main" component="span">
              *
            </Typography>
          </CustomFormLabel>
          <CustomTextField
            id="password"
            type="password"
            variant="outlined"
            fullWidth
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />
        </Grid>}

      </Grid>
    </DialogContent>
  </Dialog>
  );
};

export default AddAdminDialog;
