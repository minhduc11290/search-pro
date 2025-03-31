import React from "react";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import EditInvoicePage from "@/app/components/apps/invoice/Edit-invoice/index";
import { InvoiceProvider } from "@/app/context/InvoiceContext/index";
import BlankCard from "@/app/components/shared/BlankCard";
import { CardContent } from "@mui/material";
import { UpdateStoreProvider } from "@/app/context/UpdateStoreContext";
import { useRouter } from "next/navigation";
import EditStorePage from "@/app/components/apps/store/Edit";
type Params = Promise<{ slug: string }>
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Store Edit",
  },
];


const StoreEdit = async (props: {
  params: Params
}) => {
  const params = await props.params;
  // const router = useRouter();
  // const { slug } = router.query;
  // const params = useParams();
  const slug = params.slug as string;

  return (
    <UpdateStoreProvider id={slug}>
      <PageContainer title="Store detail" description="this is Edit Store">
        <Breadcrumb title="Store detail" items={BCrumb} />
        {/* <BlankCard>
          <CardContent> */}
        <EditStorePage />
        {/* </CardContent>
        </BlankCard> */}
      </PageContainer>
    </UpdateStoreProvider>
  );
};

export default StoreEdit;
