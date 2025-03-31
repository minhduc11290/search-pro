import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import React from "react";
import CreateInvoiceApp from "@/app/components/apps/invoice/Add-invoice";
import BlankCard from "@/app/components/shared/BlankCard";
import { CardContent } from "@mui/material";
import { InvoiceProvider } from "@/app/context/InvoiceContext";
import { ProductCreateProvider } from "@/app/context/ProductCreateContext";
import CreateProductApp from "@/app/components/apps/product/Add";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Product Create",
  },
];

const CreateProduct = () => {
  return (
    <ProductCreateProvider>
      <PageContainer
        title="Create Product"
        description="this is Create Product"
      >
        <Breadcrumb title="Create Product" items={BCrumb} />

        <BlankCard>
          <CardContent>
            <CreateProductApp />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </ProductCreateProvider>
  );
};
export default CreateProduct;
