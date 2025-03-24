import {createBrowserRouter} from "react-router-dom";
import AdminIndex from "./views/Admin";
import AdminDefault from "./views/Admin/default";
import Login from "./views/Guest/login";
import GuestDefault from "./views/Guest/default";
import AdminSalesReports from "./views/Admin/Reports/salesReport";
import AdminPaymentReports from "./views/Admin/Reports/paymentReports";
import AdminAddMedicines from "./views/Admin/Inventory/addMedicines";
import AdminMedicines from "./views/Admin/Inventory/medicines/medicines";
import AdminViewMedicine from "./views/Admin/Inventory/medicines/viewMedicine";
import AdminMedicineGroups from "./views/Admin/Inventory/medicine_groups/medicineGroups";
import AdminViewMedicineGroup from "./views/Admin/Inventory/medicine_groups/viewMedicineGroup";
import AdminPOSDefault from "./views/Admin/POS/admin_pos_default";
import AdminPOSIndex from "./views/Admin/POS/admin_pos_index";
import AdminConfigDefault from "./views/Admin/ConfigPages/config_default";
import AdminConfigIndex from "./views/Admin/ConfigPages/config_index";
import Prophet from "./views/AlgoModels/prophet";
import ViewShortage from "./views/Admin/viewShortage";
import CashierDefault from "./views/Cashier/default";
import CashierPOSIndex from "./views/Cashier/POS/cashier_pos_index";
import AdminLogsDefault from "./views/Admin/AdminLogs/admin_logs_default";
import AdminLogsInventory from "./views/Admin/AdminLogs/admin_logs_inventory";
import AdminLogsSettings from "./views/Admin/AdminLogs/admin_logs_settings";
import AdminLogsSale from "./views/Admin/AdminLogs/admin_logs_Sale";

const router = createBrowserRouter([
    /*
    |----------------------------------------
    | Algo 
    |----------------------------------------
    */
    {
        path: 'Prophet',
        element: <Prophet/>
    },


    

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
            {
                path: 'MedicineShortage',
                element: <ViewShortage/>
            },

            /**
             * Inventory
             */

            // Medicines
            {
                path: 'Medicines',
                element: <AdminMedicines/>
            },
            {
                path: 'ViewMedicines/:medId',
                element: <AdminViewMedicine/>
            },

            // Medicine Group
            {
                path: 'AddMedicine',
                element: <AdminAddMedicines/>
            },
            {
                path: 'MedicineGroups',
                element: <AdminMedicineGroups/>
            },
            {
                path: 'ViewMedicineGroup/:medGpId',
                element: <AdminViewMedicineGroup/>
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

            // LOGS
            {
                path: 'Logs',
                element: <AdminLogsDefault/>,
                children: [
                    {
                        index: true,
                        element: <AdminLogsInventory/>
                    },
                    {
                        path: "Sales",
                        element: <AdminLogsSale/>
                    },
                    {
                        path: "Settings",
                        element: <AdminLogsSettings/>
                    }
                ]
            },

            // POS
            {
                path: 'POS',
                element: <AdminPOSDefault/>,
                children: [
                    {
                        index: true,
                        element: <AdminPOSIndex/>
                    }
                ]
            },

            // Configurations
            {
                path: 'Configurations',
                element: <AdminConfigDefault/>,
                children: [
                    {
                        index: true,
                        element: <AdminConfigIndex/>
                    }
                ]
            }
        ]
    },





    /*
    |----------------------------------------
    | Client 
    |----------------------------------------
    */
    {
        path: "OrtegaCashier",
        element: <CashierDefault/>,
        children: [
            {
                index: true,
                element: <CashierPOSIndex/>
            }
        ]
        
    }
]);

export default router;