'use client'
import React from 'react';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

const CustomFormText = styled((props: any) => (
  <Typography
    variant="body1"
    fontWeight={400}
    {...props}
    component="label"
    htmlFor={props.htmlFor}
  />
))(() => ({
  marginBottom: '5px',
  marginTop: '10px',
  display: 'block',
}));

export default CustomFormText;
