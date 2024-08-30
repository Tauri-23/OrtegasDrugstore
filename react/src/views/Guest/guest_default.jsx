import { Link, Outlet } from "react-router-dom";
// 

export default function GuestDefault() {
    return(
        <>
            <h1>Guset Navbar</h1>
            <Link to={'/'}>Go to Guset Index</Link><br/>
            <a href="/About">Go to Guset About</a><br/><br/>

            {/* Childrens */}
            <Outlet/>
        </>
    );
}