'use client'
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import Link from "next/link";
import { loginType } from "@/app/(DashboardLayout)/types/auth/auth";
import CustomCheckbox from "@/app/components/forms/theme-elements/CustomCheckbox";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import AuthSocialButtons from "./AuthSocialButtons";
import * as yup from 'yup';
// import { useRouter } from "next/router";
import { useFormik } from "formik";
import useAuth from "@/hooks/auth";
// import { cookies } from 'next/headers'
import { useState } from "react";
import { useRouter } from 'next/navigation'
import { PATH } from "@/constants/paths";


const validationSchema = yup.object({
  username: yup
    .string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Username is Required'),
  password: yup
    .string()
    // .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
});

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const [pressed, setPressed] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
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
      if (!pressed) {
        setPressed(true);
        // const result = form.validate();
        // if (!result.hasErrors) {
        const { status, token } = await login({
          email: values.username,
          password: values.password
        });
        // const cookieStore = await cookies()

        if (status) {
          // navigate(PATH.STOREMANAGEMENT);
          // cookieStore.set("authToken", token);
          router.push(PATH.STOREMANAGEMENT);
        } else {
          formik.setErrors({ username: 'User not found!' });

        }
        setPressed(false);
        // }

      }


      // }

    },
  });
  return (

    <>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      {/* <AuthSocialButtons title="Sign in with" /> */}
      {/* <Box mt={3}>
      <Divider>
        <Typography
          component="span"
          color="textSecondary"
          variant="h6"
          fontWeight="400"
          position="relative"
          px={2}
        >
          or sign in with
        </Typography>
      </Divider>
    </Box> */}
      <form onSubmit={formik.handleSubmit}>
        <Stack sx={{ width: '100%' }}>
          <Box>
            <CustomFormLabel htmlFor="username">Username</CustomFormLabel>
            <CustomTextField id="username" variant="outlined" fullWidth
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
          </Box>
          <Box>
            <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
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
          </Box>
          <Stack
            justifyContent="space-between"
            direction="row"
            alignItems="center"
            my={2}
          >
            {/* <FormGroup>
          <FormControlLabel
            control={<CustomCheckbox defaultChecked />}
            label="Remeber this Device"
          />
        </FormGroup>
        <Typography
          component={Link}
          href="/auth/auth1/forgot-password"
          fontWeight="500"
          sx={{
            textDecoration: "none",
            color: "primary.main",
          }}
        >
          Forgot Password ?
        </Typography> */}
          </Stack>
        </Stack>
        <Box>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            // component={Link}
            // href="/"
            type="submit"
            onClick={() => { formik.submitForm() }}
          >
            Sign In
          </Button>
        </Box>
      </form>
      {subtitle}
    </>
  );
}

export default AuthLogin;