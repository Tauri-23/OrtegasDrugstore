import { Outlet } from "react-router-dom";
import AdminSidenav from "../../components/admin_sidenav";

export default function AdminDefault() {
    return(
        <div>
            <AdminSidenav/>
            <Outlet/>
        </div>
    );
}