import React from "react";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import BlankCard from "@/app/components/shared/BlankCard";
import { CardContent } from "@mui/material";
import AdminList from "@/app/components/apps/admin/Admin-list";
import { AdminProvider } from "@/app/context/AdminContext";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Admin List",
  },
];

const InvoiceListing = () => {
  return (
    <AdminProvider>
      <PageContainer title="Admin List" description="this is Admin List">
        <Breadcrumb title="Admin List" items={BCrumb} />
        <BlankCard>
          <CardContent>
            <AdminList />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </AdminProvider>
  );
}
export default InvoiceListing;
