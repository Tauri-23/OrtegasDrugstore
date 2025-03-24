import { Link, Outlet, useLocation } from "react-router-dom";

export default function AdminLogsDefault() {
    const location = useLocation();
    
    

    /**
     * Render
     */
    return(
        <div className="content1">
            <div className="text-l1 fw-bolder mar-bottom-1">Logs</div>

            <div className="d-flex align-items-center gap3 mar-bottom-1">
                <Link 
                to={'/OrtegaAdmin/Logs'}
                className={`${location.pathname === "/OrtegaAdmin/Logs" ? "primary" : "secondary"}-btn-dark-blue1`}>
                    Inventory
                </Link>
                <Link 
                to={'/OrtegaAdmin/Logs/Sales'}
                className={`${location.pathname === "/OrtegaAdmin/Logs/Sales" ? "primary" : "secondary"}-btn-dark-blue1`}>
                    Sales
                </Link>
                <Link 
                to={'/OrtegaAdmin/Logs/Settings'}
                className={`${location.pathname === "/OrtegaAdmin/Logs/Settings" ? "primary" : "secondary"}-btn-dark-blue1`}>
                    Settings
                </Link>
            </div>
            
            <Outlet/>
        </div>
    );
}