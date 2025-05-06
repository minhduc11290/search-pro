import React from "react";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import BlankCard from "@/app/components/shared/BlankCard";
import { CardContent } from "@mui/material";
import { UserProvider } from "@/app/context/UserContext";
import UserList from "@/app/components/apps/user/List";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "User List",
  },
];

const UserListing = () => {
  return (
    <UserProvider>
      <PageContainer title="User Management" description="this is User List">
        <Breadcrumb title="User Management" items={BCrumb} />
        <BlankCard>
          <CardContent>
            <UserList />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </UserProvider>
  );
}
export default UserListing;
