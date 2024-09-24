import {createBrowserRouter} from "react-router-dom";
import AdminIndex from "./views/Admin";
import AdminDefault from "./views/Admin/default";
import Login from "./views/Guest/login";
import GuestDefault from "./views/Guest/default";
import AdminMedicines from "./views/Admin/Inventory/medicines";
import AdminMedicineGroups from "./views/Admin/Inventory/medicineGroups";
import AdminSalesReports from "./views/Admin/Reports/salesReport";
import AdminPaymentReports from "./views/Admin/Reports/paymentReports";
import AdminAddMedicines from "./views/Admin/Inventory/addMedicines";

const router = createBrowserRouter([
    /*
    |----------------------------------------
    | Guest 
    |----------------------------------------
    */
    {
        path: '/',
        element: <GuestDefault/>,
        children: [
            {
                index: true,
                element: <Login/>
            }
        ]
    },





    /*
    |----------------------------------------
    | Admin 
    |----------------------------------------
    */
    {
        path: '/OrtegaAdmin',
        element: <AdminDefault/>,
        children: [
            {
                index: true,
                element: <AdminIndex/>
            },

            // Inventory
            {
                path: 'Medicines',
                element: <AdminMedicines/>
            },
            {
                path: 'AddMedicine',
                element: <AdminAddMedicines/>
            },
            {
                path: 'MedicineGroups',
                element: <AdminMedicineGroups/>
            },

            // Reports
            {
                path: 'SalesReports',
                element: <AdminSalesReports/>
            },
            {
                path: 'PaymentReports',
                element: <AdminPaymentReports/>
            },
        ]
    }
]);

export default router;