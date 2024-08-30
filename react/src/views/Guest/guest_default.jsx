import { Outlet } from "react-router-dom";

export default function GuestDefault() {
    return(
        <>
            <h1>Guset Navbar</h1>
            <Outlet/>
        </>
    );
}