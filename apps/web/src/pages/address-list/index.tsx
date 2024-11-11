import { AuthLayout } from "../../components/auth-layout";
import { Header } from "../../components/header";
import { PATH } from "../../constants/paths";

const AddressListPage = () => {
    return <AuthLayout currentLink={PATH.STOREMANAGEMENT} >
        <Header title="Location list"></Header>
        <div className="px-2">
            <span>Address List Page</span>
        </div>

    </AuthLayout>

}

export default AddressListPage;