import { createBrowserRouter } from "react-router-dom"
import LoginPage from "../pages/login";
import ProtectedRoute from "../components/ProtectedRoute";
import { PATH } from "../constants/paths";

const router = createBrowserRouter([
    {
        path: PATH.LOGIN,
        element: <LoginPage></LoginPage>,
    },
    {
        path: PATH.HOME,
        element:
            <ProtectedRoute redirectTo="/login">
                <div></div>
            </ProtectedRoute >

    }
]);
export default router;