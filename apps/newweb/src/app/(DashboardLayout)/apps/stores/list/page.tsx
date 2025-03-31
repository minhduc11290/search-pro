import React from "react";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import InvoiceList from "@/app/components/apps/invoice/Invoice-list/index";
import { InvoiceProvider } from "@/app/context/InvoiceContext/index";
import BlankCard from "@/app/components/shared/BlankCard";
import { CardContent } from "@mui/material";
import { StoreProvider } from "@/app/context/StoreContext";
import StoreList from "@/app/components/apps/store/List";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Store Management",
  },
];

const StoreListing = () => {
  return (
    <StoreProvider>
      <PageContainer title="Store List" description="this is Store List">
        <Breadcrumb title="Store Management" items={BCrumb} />
        <BlankCard>
          <CardContent>
            <StoreList />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </StoreProvider>
  );
}
export default StoreListing;
