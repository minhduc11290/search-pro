import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import React from "react";
import CreateInvoiceApp from "@/app/components/apps/invoice/Add-invoice";
import BlankCard from "@/app/components/shared/BlankCard";
import { CardContent } from "@mui/material";
import { InvoiceProvider } from "@/app/context/InvoiceContext";
import { LocationCreateProvider } from "@/app/context/LocationCreateContext";
import CreateLocationApp from "@/app/components/apps/location/Add";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Location Create",
  },
];

const CreateLocation = () => {
  return (
    <LocationCreateProvider>
      <PageContainer
        title="Create Location"
        description="this is Create Location"
      >
        <Breadcrumb title="Create Location" items={BCrumb} />

        <BlankCard>
          <CardContent>
            <CreateLocationApp />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </LocationCreateProvider>
  );
};
export default CreateLocation;
