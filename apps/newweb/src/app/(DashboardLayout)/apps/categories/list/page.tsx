import React from "react";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import BlankCard from "@/app/components/shared/BlankCard";
import { CardContent } from "@mui/material";
import { UserProvider } from "@/app/context/UserContext";
import UserList from "@/app/components/apps/user/List";
import { CategoryProvider } from "@/app/context/CategoryContext";
import CategoryList from "@/app/components/apps/category/List";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Category management",
  },
];

const UserListing = () => {
  return (
    <CategoryProvider>
      <PageContainer title="Category Management" description="this is User List">
        <Breadcrumb title="Category Management" items={BCrumb} />
        <BlankCard>
          <CardContent>
            <CategoryList />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </CategoryProvider>
  );
}
export default UserListing;
