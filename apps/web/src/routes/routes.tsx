import { createBrowserRouter } from "react-router-dom"
import LoginPage from "../pages/login";
import ProtectedRoute from "../components/protected-route";
import { PATH } from "../constants/paths";
import StoreManagementPage from "../pages/store-management";
import AddressListPage from "../pages/address-list";
import ProductsPage from "../pages/products";
import HomePage from "../pages/home";
import UserManagementPage from "../pages/user-management";

const router = createBrowserRouter([
    {
        path: PATH.LOGIN,
        element: <LoginPage></LoginPage>,
    },
    {
        path: PATH.HOME,
        element: <HomePage></HomePage>

    },
    {
        path: PATH.PRODUCT,
        element:
            <ProtectedRoute>
                <ProductsPage></ProductsPage>
            </ProtectedRoute >

    },
    {
        path: PATH.ADDRESSLIST,
        element:
            <ProtectedRoute>
                <AddressListPage></AddressListPage>
            </ProtectedRoute >

    },
    {
        path: PATH.STOREMANAGEMENT,
        element:
            <ProtectedRoute>
                <StoreManagementPage></StoreManagementPage>
            </ProtectedRoute >

    },
    {
        path: PATH.USERS,
        element:
            <ProtectedRoute>
                <UserManagementPage></UserManagementPage>
            </ProtectedRoute >

    },
]);
export default router;