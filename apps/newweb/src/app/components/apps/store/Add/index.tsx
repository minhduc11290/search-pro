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
  RadioGroup,
  useTheme,
  FormControlLabel,

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
import { Category, Store, StoreRequest } from "@/@types/store-props";
import { Status } from "@/@types/enum/status";
import { StoreCreateContext } from "@/app/context/StoreCreateContext";

import * as yup from 'yup';
import { useFormik } from "formik";
import CustomRadio from "@/app/components/forms/theme-elements/CustomRadio";

const CreateStore = () => {
  const { data, addStore } = useContext(StoreCreateContext);
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();
  const [typeMessage, setTypeMessage] = React.useState('success');
  const [message, setMessage] = React.useState('');

  const validationSchema = yup.object({
    ownerstore: yup
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
    type: yup.string().required("Required information"),
  });

  const formik = useFormik({
    initialValues: {

      ownerstore: '',
      userName: '',
      phone: '',
      email: '',
      password: '',
      pw: '',
      category: '',
      confirmPassword: '',
      website: '',
      type: 'RETAIL'
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const store: StoreRequest = {
        name: values.ownerstore,
        primaryPhone: values.phone,
        password: values.password,
        email: values.email,
        isActive: true,
        categoryId: values.category,
        website: values.website,
        type: values.type,
      };
      let result = await addStore(store);
      setShowAlert(true);
      setMessage(result.errorMessage);
      if (result.statusCode == 200 || result.statusCode == 201) {

        setTypeMessage('success');
        setTimeout(() => {
          router.push(`/apps/stores/edit/${result.data.id}`);
        }, 1000);
      } else {
        setTypeMessage('error');
      }

      // addInvoice();

    },
  });


  const theme = useTheme();





  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    formik.submitForm();
    // try {
    //   await addInvoice(formData);
    //   setFormData({
    //     id: 0,
    //     billFrom: "",
    //     billTo: "",
    //     totalCost: 0,
    //     status: "Pending",
    //     billFromAddress: "",
    //     billToAddress: "",
    //     orders: [{ itemName: "", unitPrice: "", units: "", unitTotalPrice: 0 }],
    //     vat: 0,
    //     grandTotal: 0,
    //     subtotal: 0,
    //     date: new Date().toISOString().split("T")[0],
    //   });
    //   setShowAlert(true);
    //   setTimeout(() => {
    //     setShowAlert(false);
    //   }, 5000);
    //   router.push("/apps/invoice/list");
    // } catch (error) {
    //   console.error("Error adding invoice:", error);
    // }
  };

  // const parsedDate = isValid(new Date(formData.date))
  //   ? new Date(formData.date)
  //   : new Date();
  const parsedDate = new Date();
  const formattedOrderDate = format(parsedDate, "EEEE, MMMM dd, yyyy");


  return (
    <>
      {/* <form onSubmit={handleSubmit}> */}
      <Box>
        <Stack
          direction="row"
          spacing={{ xs: 1, sm: 2, md: 4 }}
          justifyContent="space-between"
          mb={3}
        >
          {/* <Typography variant="h5"># {formData.id}</Typography> */}
          <Typography variant="h5"></Typography>
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                router.push("/apps/stores/list");
              }}
            >
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={() => { formik.submitForm() }}>
              Create Store
            </Button>
          </Box>
        </Stack>
        <Divider></Divider>

        <Grid container spacing={3} mb={4} rowSpacing={0}>
          <Grid size={6}>
            <CustomFormLabel htmlFor="bill-from">Store Name <Typography color="error.main" component="span">
              *
            </Typography></CustomFormLabel>
            <CustomTextField
              id="ownerstore"
              name="ownerstore"
              value={formik.values.ownerstore}
              onChange={formik.handleChange}
              fullWidth
              helperText={formik.touched.ownerstore && formik.errors.ownerstore}
              error={formik.touched.ownerstore && Boolean(formik.errors.ownerstore)}
            />
          </Grid>
          <Grid size={6} pt={0}>
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
          <Grid size={6}>
            <CustomFormLabel htmlFor="bill-from">Category</CustomFormLabel>
            <CustomSelect
              labelId="category"
              id="category"
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              fullWidth
              displayEmpty
            >
              <MenuItem value="">Select Category</MenuItem>
              {data.map((item: Category) =>
                <MenuItem value={item.id} key={item.id}>{item.name}</MenuItem>
              )
              }
              {/* <MenuItem value={1}>One</MenuItem>
                <MenuItem value={2}>Two</MenuItem>
                <MenuItem value={3}>Three</MenuItem> */}
            </CustomSelect>
          </Grid>
          <Grid size={6} pt={0}>
            <CustomFormLabel
              htmlFor="bill-to"

            >
              Phone Number
            </CustomFormLabel>
            <CustomTextField
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              helperText={formik.touched.phone && formik.errors.phone}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              fullWidth
            />
          </Grid>

          <Grid size={6} pt={0}>
            <CustomFormLabel
              htmlFor="bill-to"
              sx={{
                mt: {
                  xs: 0,
                  sm: 3,
                },
              }}
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
          </Grid>
          <Grid size={6} pt={0}>
            <CustomFormLabel
              htmlFor="bill-to"
              sx={{
                mt: {
                  xs: 0,
                  sm: 3,
                },
              }}
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
        </Grid>



        {showAlert && (
          <Alert
            // severity="success"
            severity={typeMessage == 'success' ? 'success' : 'error'}
            sx={{ position: "fixed", top: 16, right: 16 }}
          >
            {message}
            {/* Store added successfully. */}
          </Alert>
        )}


      </Box >
      {/* </form> */}
    </>
  );
};

export default CreateStore;
