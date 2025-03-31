'use client'
import React from "react";

import { Card, CardHeader, CardContent, Divider } from "@mui/material";

type Props = {
  title?: string;
  children: React.JSX.Element | React.JSX.Element[];
  codeModel?: React.JSX.Element | React.JSX.Element[];
};

const ChildCard = ({ title, children, codeModel }: Props) => (
  <Card
    sx={{ padding: 0, borderColor: (theme: any) => theme.palette.divider }}
    variant="outlined"
  >
    {title ? (
      <>
        <CardHeader title={title} action={codeModel} />
        <Divider />{" "}
      </>
    ) : (
      ""
    )}

    <CardContent>{children}</CardContent>
  </Card>
);

export default ChildCard;
