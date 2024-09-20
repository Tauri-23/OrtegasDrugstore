import {createBrowserRouter} from "react-router-dom";
import GuestDefault from "./views/Guest/guest_default";
import GuestIndex from "./views/Guest/guest_index";
import GuestAbout from "./views/Guest/guest_about";
import AdminIndex from "./views/Admin";
import AdminDefault from "./views/Admin/default";

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
                element: <GuestIndex/>
            },
            {
                path: 'About',
                element: <GuestAbout/>
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
            }
        ]
    }
]);

export default router;