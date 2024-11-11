import { AuthLayout } from "../../components/auth-layout";
import { PATH } from "../../constants/paths";

const ProductsPage = () => {
    return <AuthLayout currentLink={PATH.PRODUCT}>
        <span>Product Page</span>
    </AuthLayout>
}

export default ProductsPage;