import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import React from "react";
import CreateInvoiceApp from "@/app/components/apps/invoice/Add-invoice";
import BlankCard from "@/app/components/shared/BlankCard";
import { CardContent } from "@mui/material";
import { InvoiceProvider } from "@/app/context/InvoiceContext";
import CreateStore from "@/app/components/apps/store/Add";
import { StoreCreateProvider } from "@/app/context/StoreCreateContext";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Store Create",
  },
];

const CreateInvoice = () => {
  return (
    <StoreCreateProvider>
      <PageContainer
        title="Create Store"
        description="this is Create Store"
      >
        <Breadcrumb title="Create Store" items={BCrumb} />

        <BlankCard>
          <CardContent>
            <CreateStore />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </StoreCreateProvider>
  );
};
export default CreateInvoice;
