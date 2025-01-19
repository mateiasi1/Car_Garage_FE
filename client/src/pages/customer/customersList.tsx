import AddNewCustomer from "../../components/new-customer/AddNewCustomer";
import CustomersList from "../../components/new-customer/CustomersList";
import Layout from "../layout/layout";

const CustomersListPage = () => {
    return (
        <Layout >
            <CustomersList />
        </Layout>
    );
};

export default CustomersListPage;