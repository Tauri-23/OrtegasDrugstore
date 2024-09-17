import {createBrowserRouter} from "react-router-dom";
import GuestDefault from "./views/Guest/guest_default";
import GuestIndex from "./views/Guest/guest_index";
import ClientDefault from "./views/Client/client_default";
import GuestAbout from "./views/Guest/guest_about";
import ClientIndex from "./views/Client/client_index";
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
    | Client 
    |----------------------------------------
    */
    {
        path: '/Client',
        element: <ClientDefault/>,
        children: [
            {
                index: true,
                element: <ClientIndex/>
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