import {createBrowserRouter} from "react-router-dom";
import AdminIndex from "./views/Admin";
import AdminDefault from "./views/Admin/default";
import Login from "./views/Guest/login";

const router = createBrowserRouter([
    /*
    |----------------------------------------
    | Guest 
    |----------------------------------------
    */
    {
        path: '/',
        element: <Login/>
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
            }
        ]
    }
]);

export default router;