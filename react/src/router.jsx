import {createBrowserRouter} from "react-router-dom";
import GuestDefault from "./views/Guest/guest_default";
import GuestIndex from "./views/Guest/guest_index";

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
            }
        ]
    }
]);

export default router;