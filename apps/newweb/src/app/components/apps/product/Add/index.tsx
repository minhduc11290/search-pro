"use client";
import React, { useState, useContext, useEffect } from "react";
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
  Grid,
  Stepper,
  FormControlLabel,
  StepLabel,
  Step,
  TextField,
  Autocomplete,
  Chip,
} from "@mui/material";
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
import ParentCard from "@/app/components/shared/ParentCard";
import CustomCheckbox from "@/app/components/forms/theme-elements/CustomCheckbox";
import { LocationCreateContext } from "@/app/context/LocationCreateContext";
import { LocationInfo } from "@/@types/location-props";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { margin } from "@mui/system";
import CustomSwitch from "@/app/components/forms/theme-elements/CustomSwitch";
import { ProductCreateContext } from "@/app/context/ProductCreateContext";

const steps = ['Basic Information', 'Open Time']
const CreateProductApp = () => {
  const { data, addStore } = useContext(ProductCreateContext);
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();
  const [typeMessage, setTypeMessage] = React.useState('success');
  const [message, setMessage] = React.useState('');

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
      zipCode: '',
      state: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // alert(JSON.stringify(values, null, 2));
      // if (values.username === "admin" && values.password === "12345678") {
      //   // console.log("vô đây")
      //   // document.cookie = `authToken=fake-jwt-token; path=/; max-age=86400;`;
      //   // router.push("/");
      //   await login({
      //     email: values.username,
      //     password: values.password
      //   })
      // } else {
      // }
      // const cookieStore = await cookies()
      // // const theme = cookieStore.get('theme')
      // await login({
      //   email: values.username,
      //   password: values.password
      // })


      // const handleLogin = async () => {



      // }
      const store: StoreRequest = {
        name: values.ownerstore,
        primaryPhone: values.phone,
        password: values.password,
        email: values.email,
        isActive: true,
        categoryId: values.category
      };
      let result = await addStore(store);
      setShowAlert(true);
      setMessage(result.errorMessage);
      if (result.statusCode == 200 || result.statusCode == 201) {

        setTypeMessage('success');
        setTimeout(() => {
          router.push("/apps/stores/list");
        }, 1000);
      } else {
        setTypeMessage('error');
      }

      // addInvoice();

    },
  });

  const [formData, setFormData] = useState<LocationInfo>({
    // id: 0,
    // billFrom: "",
    // billTo: "",
    // totalCost: 0,
    // status: "Pending",
    // billFromAddress: "",
    // billToAddress: "",
    // orders: [{ itemName: "", unitPrice: "", units: "", unitTotalPrice: 0 }],
    // vat: 0,
    // grandTotal: 0,
    // subtotal: 0,
    // date: new Date().toISOString().split("T")[0],
    no: 0,
    // id: '',
    // ownerstore: '',
    // userName: '',
    // phone: '',
    // email: '',
    // status: Status.Active,
    // password: '',
    // pw: '',
    state: '',
    zipCode: '',
    locationID: '',
    address: '',

    openAt: '',
    closeAt: '',
    status: Status.Active,
    phone: '',
    attachments: [],


    addressLine1: '',
    addressLine2: '',
    city: '',
    fax: '',
    isOpenMon: false,
    openTimeMon: '',
    closeTimeMon: '',

    isOpenTue: false,
    openTimeTue: '',
    closeTimeTue: '',

    isOpenWed: false,
    openTimeWed: '',
    closeTimeWed: '',

    isOpenThu: false,
    openTimeThu: '',
    closeTimeThu: '',

    isOpenFri: false,
    openTimeFri: '',
    closeTimeFri: '',

    isOpenSat: false,
    openTimeSat: '',
    closeTimeSat: '',

    isOpenSun: false,
    openTimeSun: '',
    closeTimeSun: '',

    latitude: 0,
    longitude: 0,
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    console.log("handleChange");
    setFormData((prevData) => {
      const newFormData = { ...prevData, [name]: value };
      // const totals = calculateTotals(newFormData.orders);
      console.log("newFormData", newFormData);
      return {
        ...newFormData,
        // ...totals,
      };
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set())

  // const isStepOptional = (step: any) => step === 1

  // const isStepSkipped = (step: any) => skipped.has(step)

  const handleNext = () => {
    let newSkipped = skipped
    // if (isStepSkipped(activeStep)) {
    //   newSkipped = new Set(newSkipped.values())
    //   newSkipped.delete(activeStep)
    // }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped(newSkipped)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleSkip = () => {
    // if (!isStepOptional(activeStep)) {
    //   // You probably want to guard against something like this,
    //   // it should never occur unless someone's actively trying to break something.
    //   throw new Error("You can't skip a step that isn't optional.")
    // }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values())
      newSkipped.add(activeStep)

      return newSkipped
    })
  }
  const [status, setStatus] = React.useState(false)
  const handleChangeStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.checked);
  };
  // eslint-disable-next-line consistent-return


  const [tags, setTags] = useState<string[]>([]);

  return (
    // <ParentCard title='Form Wizard'>
    <form onSubmit={handleSubmit}>
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
            <Button type="submit" variant="contained" color="primary">
              Create Product
            </Button>
          </Box>
        </Stack>
        <Box width='100%'>
          <CustomFormLabel htmlFor='Name'>Product Name</CustomFormLabel>
          <CustomTextField id='productname' variant='outlined' fullWidth />
          <CustomFormLabel htmlFor="txt-message" sx={{ mt: 0 }}>
            Description
          </CustomFormLabel>
          <CustomTextField
            id="txt-message"
            multiline
            rows={4}
            variant="outlined"
            placeholder="Write your description here..."
            fullWidth
          />
          <CustomFormLabel htmlFor='Name'>Keywords</CustomFormLabel>
          <CustomTextField id='addressline1' variant='outlined' fullWidth />
          <CustomFormLabel htmlFor='Name'>SKU</CustomFormLabel>
          <Autocomplete
            multiple
            freeSolo
            options={[]} // Không có options cố định
            value={tags}
            onChange={(event, newValue) => setTags(newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => <TextField {...params} />}
          />
          <CustomFormLabel htmlFor='Name'>Status</CustomFormLabel>
          <CustomSwitch checked={status} onChange={handleChangeStatus} />
          <CustomFormLabel htmlFor='Name'>Image</CustomFormLabel>
          <TextField
            type="file"
            autoFocus
            id="upload-text"
            fullWidth
            size="small"
            variant="outlined"
          />
        </Box>
      </Box>
    </form>
  )
  // return (
  //   <>
  //     <form onSubmit={handleSubmit}>
  //       {/* <Box>
  //         <Stack
  //           direction="row"
  //           spacing={{ xs: 1, sm: 2, md: 4 }}
  //           justifyContent="space-between"
  //           mb={3}
  //         >
  //           {/* <Typography variant="h5"># {formData.id}</Typography> */}
  //           <Typography variant="h5"></Typography>
  //           <Box display="flex" gap={1}>
  //             <Button
  //               variant="outlined"
  //               color="error"
  //               onClick={() => {
  //                 router.push("/apps/store/list");
  //               }}
  //             >
  //               Cancel
  //             </Button>
  //             <Button type="submit" variant="contained" color="primary">
  //               Create Store
  //             </Button>
  //           </Box>
  //         </Stack>
  //         <Divider></Divider>

  //         <Grid container spacing={3} mb={4}>
  //           <Grid item xs={12} sm={6}>
  //             <CustomFormLabel htmlFor="bill-from">Address</CustomFormLabel>
  //             <CustomTextField
  //               id="addressline1"
  //               name="addressline1"
  //               value={formData.ownerstore}
  //               onChange={formik.handleChange}
  //               fullWidth
  //             />
  //           </Grid>
  //           <Grid item xs={12} sm={6}>
  //             <CustomFormLabel htmlFor="bill-from">Category</CustomFormLabel>
  //             <CustomSelect
  //               labelId="category"
  //               id="category"
  //               name="category"
  //               value={formik.values.category}
  //               onChange={formik.handleChange}
  //               fullWidth
  //             >
  //               {data.map((item: Category) =>
  //                 <MenuItem value={item.id} key={item.id}>{item.name}</MenuItem>
  //               )
  //               }
  //               {/* <MenuItem value={1}>One</MenuItem>
  //               <MenuItem value={2}>Two</MenuItem>
  //               <MenuItem value={3}>Three</MenuItem> */}
  //             </CustomSelect>
  //           </Grid>
  //           <Grid item xs={12} sm={6}>
  //             <CustomFormLabel
  //               htmlFor="bill-to"
  //               sx={{
  //                 mt: {
  //                   xs: 0,
  //                   sm: 3,
  //                 },
  //               }}
  //             >
  //               Phone Number
  //             </CustomFormLabel>
  //             <CustomTextField
  //               name="phone"
  //               value={formData.phone}
  //               onChange={formik.handleChange}
  //               fullWidth
  //             />
  //           </Grid>
  //           <Grid item xs={12} sm={6}>
  //             <CustomFormLabel
  //               htmlFor="bill-to"
  //               sx={{
  //                 mt: {
  //                   xs: 0,
  //                   sm: 3,
  //                 },
  //               }}
  //             >
  //               Email
  //             </CustomFormLabel>
  //             <CustomTextField
  //               name="email"
  //               value={formData.email}
  //               onChange={formik.handleChange}
  //               fullWidth
  //             />
  //           </Grid>
  //           <Grid item xs={12} sm={6}>
  //             <CustomFormLabel
  //               htmlFor="bill-to"
  //               sx={{
  //                 mt: {
  //                   xs: 0,
  //                   sm: 3,
  //                 },
  //               }}
  //             >
  //               Password
  //             </CustomFormLabel>
  //             <CustomTextField
  //               id="password"
  //               type="password"
  //               variant="outlined"
  //               fullWidth
  //               name="password"
  //               value={formik.values.password}
  //               onChange={formik.handleChange}
  //               error={formik.touched.password && Boolean(formik.errors.password)}
  //               helperText={formik.touched.password && formik.errors.password}

  //             />
  //           </Grid>
  //           <Grid item xs={12} sm={6}>
  //             <CustomFormLabel
  //               htmlFor="bill-to"
  //               sx={{
  //                 mt: {
  //                   xs: 0,
  //                   sm: 3,
  //                 },
  //               }}
  //             >
  //               Confirm Password
  //             </CustomFormLabel>
  //             <CustomTextField
  //               id="password"
  //               type="password"
  //               variant="outlined"
  //               fullWidth
  //               name="password"
  //               value={formik.values.confirmPassword}
  //               onChange={formik.handleChange}
  //               error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
  //               helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}

  //             />
  //           </Grid>
  //         </Grid>



  //         {showAlert && (
  //           <Alert
  //             // severity="success"
  //             severity={typeMessage == 'success' ? 'success' : 'error'}
  //             sx={{ position: "fixed", top: 16, right: 16 }}
  //           >
  //             {message}
  //             {/* Store added successfully. */}
  //           </Alert>
  //         )}


  //       </Box> */}
  //     </form>
  //   </>
  // );
};

export default CreateProductApp;
