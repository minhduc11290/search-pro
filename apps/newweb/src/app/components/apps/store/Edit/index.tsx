"use client";
import React, { useContext, useState, useEffect } from "react";
import { InvoiceContext } from "@/app/context/InvoiceContext/index";
import { usePathname, useRouter } from "next/navigation";
import {
  Button,
  MenuItem,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  IconButton,
  Tooltip,
  Box,
  Stack,
  Divider,

  Collapse,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
  Fab,
} from "@mui/material";
import Grid from '@mui/material/Grid2';

import { format, isValid } from "date-fns";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import { IconChevronDown, IconEdit, IconEye, IconPlus, IconSquareRoundedPlus, IconTrash } from "@tabler/icons-react";
import { UpdateStoreContext } from "@/app/context/UpdateStoreContext";
import { useFormik } from "formik";
import * as yup from 'yup';
import { Category, StoreRequest } from "@/@types/store-props";
import LocationTable from "@/app/components/ui-components/location/table";
import ProductTable from "@/app/components/ui-components/product/table";
import DialogEditStore from "./DialogEditStore";
import CustomFormText from "@/app/components/forms/theme-elements/CustomFormText";
import DialogShowPass from "./DialogShowPassword";
import DialogLocation from "./DialogLocation";
import { Product } from "@/@types/product-props";
import { LocationInfo } from "@/@types/location-props";
import DialogProduct from "./DialogProduct";

const EditStorePage = () => {
  const { data, categories, locations, products, loading } = useContext(UpdateStoreContext);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [editedInvoice, setEditedInvoice]: any = useState(null);

  const pathName = usePathname();
  const getTitle = pathName.split("/").pop();
  console.log(data, "data");
  const [showInfo, setShowInfo] = useState(true);
  const [showLocations, setShowLocations] = useState(true);
  const [showProducts, setShowProducts] = useState(true);
  const router = useRouter();
  const [isOpenEditStore, setIsOpenEditStore] = useState(false);
  const [isOpenShowPassStore, setIsOpenShowPassStore] = useState(false);
  const [isOpenProduct, setIsOpenProduct] = useState(false);
  const [isOpenLocation, setIsOpenLocation] = useState(false);
  const [productSelected, setProductSelected] = useState<Product | null>(null);
  const [locationSelected, setLocationSelected] = useState<LocationInfo | null>(null);

  const handleSave = async () => {
    // try {
    //   await updateInvoice(editedInvoice);
    //   setSelectedInvoice({ ...editedInvoice });
    //   setEditing(false); // Exit editing mode
    //   setShowAlert(true);

    //   // Navigate to the list page
    //   router.push("/apps/invoice/list");
    // } catch (error) {
    //   console.error("Error updating invoice:", error);
    // }

    // setTimeout(() => {
    //   setShowAlert(false);
    // }, 5000);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const validationSchema = yup.object({
    ownerstore: yup
      .string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('ownerstore is Required'),
    userName: yup
      .string()
      // .min(8, 'Password should be of minimum 8 characters length')
      .required('Password is required'),
    email: yup.string().email(),
  });


  useEffect(() => {
    if (data) {
      formik.setFieldValue('ownerstore', data?.ownerstore);
      formik.setFieldValue('userName', data?.userName);
      formik.setFieldValue('phone', data?.phone);
      formik.setFieldValue('email', data?.email);
      formik.setFieldValue('category', data?.category);
    }
  }, [data]);


  const formik = useFormik({
    initialValues: {

      ownerstore: '',
      userName: '',
      phone: '',
      email: '',
      password: '',
      pw: '',
      category: '',
      confirmPassword: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const store: StoreRequest = {
        name: values.ownerstore,
        primaryPhone: values.phone,
        password: values.password,
        email: values.email,
        isActive: true,
        categoryId: values.category
      };

    },
  });


  const moveToAddLocation = () => {
    setLocationSelected(null);
    setIsOpenLocation(true);
  }

  const moveToAddProduct = () => {
    setProductSelected(null);
    setIsOpenProduct(true);
  }

  if (!data) {
    return <div>Please select an store.</div>;
  }



  // const orderDate = selectedInvoice.orderDate;
  // const parsedDate = isValid(new Date(orderDate))
  //   ? new Date(orderDate)
  //   : new Date();
  // const formattedOrderDate = format(parsedDate, "EEEE, MMMM dd, yyyy");
  console.log(data);
  return (
    <Box>

      <Accordion elevation={9} sx={{ mb: 2 }} expanded={showInfo}>
        <AccordionSummary
          onClick={(_) => { console.log("clicked"); setShowInfo(true); }}
          expandIcon={<IconChevronDown size="20" onClick={(event) => {
            event.stopPropagation();
            console.log("clicked Icon"); setShowInfo(!showInfo);
          }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{
            paddingTop: 0,
            paddingBottom: 0,
          }}
        // sx={{
        //   borderBottom: "1px solid #e5eaef", // Thêm border
        //   // borderRadius: "4px", // Bo góc (tuỳ chọn)
        //   // padding: "10px", // Thêm padding để đẹp hơn
        // }}
        >
          <Box sx={{
            alignItems: 'center',
            display: 'flex',
            gap: 2
          }}>
            <Typography variant="h6">Store Information</Typography>
            {/* <Button
              variant="contained"
              color="primary"
              onClick={() => setIsOpenEditStore(true)}
            >
              Edit Store
            </Button> */}
            <Tooltip title="Edit Store">
              <Fab color="primary" aria-label="send" size="small" onClick={() => setIsOpenEditStore(true)}>
                <IconEdit width={14}></IconEdit>
              </Fab>
            </Tooltip>
            <Tooltip title="Show password">
              <Fab color="primary" aria-label="send" size="small" onClick={() => setIsOpenShowPassStore(true)}>
                <IconEye width={14}></IconEye>
              </Fab>
            </Tooltip>
            {/* <Button variant="contained" color="primary" onClick={() => setIsOpenShowPassStore(true)}>
              Show password
            </Button> */}
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ paddingTop: 0, paddingBottom: 0 }}>
          <Grid container rowSpacing={0} spacing={2} mb={4} marginTop={0} sx={{ paddingTop: 0 }} columns={5}>
            {/* <Grid size={5} sx={{ paddingTop: 0, marginTop: 0 }}>
              <Divider></Divider>
            </Grid> */}
            <Grid size={1} sx={{ paddingTop: 0, marginTop: 0 }}>
              <CustomFormLabel htmlFor="bill-from">Store Name</CustomFormLabel>
              <CustomFormText
                // disabled
                // id="ownerstore"
                // name="ownerstore"
                // value={formik.values.ownerstore}
                // onChange={formik.handleChange}
                fullWidth
              >{data?.ownerstore}</CustomFormText>
            </Grid>
            <Grid size={1} >
              <CustomFormLabel htmlFor="bill-from">Category</CustomFormLabel>
              {/* <CustomSelect
                disabled
                labelId="category"
                id="category"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                fullWidth
              >
                {categories.map((item: Category) =>
                  <MenuItem value={item.id} key={item.id}>{item.name}</MenuItem>
                )
                }
              </CustomSelect> */}
              <CustomFormText
                fullWidth
              >{categories.find((category: any) => category.id == data.category)?.name}</CustomFormText>
            </Grid >
            <Grid size={1}>
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
              <CustomFormText
                fullWidth
              >{data?.phone}</CustomFormText>
            </Grid>
            <Grid size={1}>
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
              <CustomFormText
                fullWidth
              >{data?.email}</CustomFormText>
            </Grid>
            <Grid size={1}>
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
              <CustomFormText
                fullWidth
              >{data?.website}</CustomFormText>
            </Grid>
          </Grid >

        </AccordionDetails>
      </Accordion>
      <Accordion elevation={9} sx={{ mb: 2 }} expanded={showLocations}>
        <AccordionSummary
          onClick={(event) => { event.stopPropagation(); console.log("clicked"); setShowLocations(true); }}
          expandIcon={<IconChevronDown size="20" onClick={(event) => {
            event.stopPropagation();
            console.log("clicked Icon"); setShowLocations(!showLocations);
          }} />}
          // expandIcon={<IconChevronDown size="20" />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          disableRipple
        >
          <Box sx={{
            alignItems: 'center',
            display: 'flex',
            gap: 2
          }}>
            <Typography variant="h6">Location Information</Typography>
            {/* <Button variant="contained" color="primary" onClick={moveToAddLocation}>
              Add Location
            </Button> */}
            <Tooltip title="Add Location">
              <Fab color="primary" aria-label="send" size="small" onClick={moveToAddLocation}>
                <IconPlus width={14}></IconPlus>
              </Fab>
            </Tooltip>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {/* <Grid size={12} paddingBottom={2}>
            <Divider></Divider>
          </Grid> */}

          <Grid spacing={3} mb={4} size={12} sx={{ width: '100%' }}>
            <LocationTable data={locations} onEditLocation={(location) => {
              setLocationSelected(location);
              setIsOpenLocation(true);
            }}></LocationTable>
          </Grid >
        </AccordionDetails>
      </Accordion>

      <Accordion elevation={9} sx={{ mb: 2 }} expanded={showProducts}>
        <AccordionSummary
          disableRipple
          onClick={(event) => { event.stopPropagation(); console.log("clicked"); setShowProducts(true); }}
          expandIcon={<IconChevronDown size="20" onClick={(event) => {
            event.stopPropagation();
            console.log("clicked Icon"); setShowProducts(!showProducts);
          }} />}
          // expandIcon={<IconChevronDown size="20" />}
          aria-controls="panel1a-content"
          id="panel1a-header"

        >
          <Box sx={{
            alignItems: 'center',
            display: 'flex',
            gap: 2
          }}>
            <Typography variant="h6">Product Information</Typography>
            {/* <Button variant="contained" color="primary" onClick={moveToAddProduct}>
              Add Product
            </Button> */}
            <Tooltip title="Add Product">
              <Fab color="primary" aria-label="send" size="small" onClick={moveToAddProduct}>
                <IconPlus width={14}></IconPlus>
              </Fab>
            </Tooltip>
            {/* <Tooltip title="Bell">
              <IconButton color="secondary" aria-label="secondary-bell">
                <IconBell width={18} />
              </IconButton>
            </Tooltip> */}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {/* <Grid size={12} paddingBottom={2}>
            <Divider></Divider>
          </Grid> */}
          {/* <Stack
            direction="row"
            spacing={{ xs: 1, sm: 2, md: 4 }}
            justifyContent="end"
            alignItems="center"
            mb={3}
          >
            <Button variant="contained" color="primary" onClick={moveToAddLocation}>
              Add Product
            </Button>
          </Stack> */}
          <Grid spacing={3} mb={4} size={12}>
            <ProductTable data={products} onEditProduct={(product) => {
              setProductSelected(product);
              setIsOpenProduct(true);
            }}></ProductTable>
          </Grid >
        </AccordionDetails>
      </Accordion>

      <DialogEditStore store={data} categories={categories} state={isOpenEditStore} handleCloseDialog={() => { setIsOpenEditStore(false) }}>
      </DialogEditStore>
      <DialogShowPass store={data} state={isOpenShowPassStore} handleCloseDialog={() => { setIsOpenShowPassStore(false) }}></DialogShowPass>
      <DialogLocation store={data} location={locationSelected} state={isOpenLocation} handleCloseDialog={() => { setIsOpenLocation(false) }} ></DialogLocation>
      <DialogProduct store={data} product={productSelected} state={isOpenProduct} handleCloseDialog={() => { setIsOpenProduct(false) }} ></DialogProduct>

      {
        showAlert && (
          <Alert
            severity="success"
            sx={{ position: "fixed", top: 16, right: 16 }}
          >
            Invoice data updated successfully.
          </Alert>
        )
      }
    </Box >
  );
};

export default EditStorePage;
