import { useState } from "react";
import * as Icon from "react-bootstrap-icons";
import { Link, useLocation } from "react-router-dom";
import { useStateContext } from "../../Context/ContextProvider";

const AdminSidenav = ({onLogout}) => {
    const location = useLocation();
    const {user} = useStateContext();
    const [inventoryOpen, setInventoryOpen] = useState(false);
    const [reportsOpen, setReportsOpen] = useState(false);
    const [isOptionBoxOpen, setOptionBoxOpen] = useState(false);

    return (
        <div className="admin-sidenav1">
            <div className="admin-sidenav1-head text-l3 fw-bold">
                Ortega's Drugstore
            </div>

            <div className="admin-sidenav1-user">
                <div className="d-flex align-items-center" style={{gap: 15}}>
                    <div className="admin-sidenav1-pfp">
                        Y
                    </div>
                    <div className="h-100">
                        <div className="text-m3 color-white1">
                            {user.firstname} {user.lastname}
                        </div>
                        <div className="text-m3 color-white1">
                            Admin
                        </div>
                    </div>
                </div>

                <Icon.ThreeDotsVertical className="text-l2 color-white1 cursor-pointer" onClick={() => setOptionBoxOpen(!isOptionBoxOpen)}/>

                <div className={`admin-sidenav1-action-box ${isOptionBoxOpen ? '' : 'd-none'}`}>
                    <div className="admin-sidenav1-action-box-btn">
                        <Icon.PersonCircle/>
                        Profile
                    </div>
                    <div className="hr-line1-black3"></div>
                    <div className="admin-sidenav1-action-box-btn" onClick={onLogout}>
                        <Icon.BoxArrowLeft/>
                        Logout
                    </div>
                </div>
            </div>


            {/* Links */}
            <div className="admin-sidenav1-links">
                {/* Dashboard */}
                <Link 
                to={'/OrtegaAdmin'} 
                className={`admin-sidenav1-link ${location.pathname === '/OrtegaAdmin' || location.pathname === '/OrtegaAdmin/' ? 'active' : ''}`}>
                    <div className="d-flex align-items-center" style={{gap: 15}}>
                        <img src="/src/assets/media/icons/dashboard.svg" alt="" />
                        <div>Dashboard</div>
                    </div>
                </Link>

                {/* Inventory */}
                <div 
                className={`admin-sidenav1-link ${inventoryOpen ? "opened" : ""}`} 
                onClick={() => setInventoryOpen(!inventoryOpen)}
                >
                    <div className="d-flex align-items-center" style={{gap: 15}}>
                        <img src="/src/assets/media/icons/medicine.svg" alt="" />
                        <div>Inventory</div>
                    </div>
                    {inventoryOpen
                    ? (<Icon.CaretUpFill className="text-m3"/>)
                    : (<Icon.CaretDownFill className="text-m3"/>)}
                    
                </div>
                <Link 
                to={'Medicines'} 
                className={`admin-sidenav1-link2 ${inventoryOpen ? "" : "disabled"} ${location.pathname === '/OrtegaAdmin/Medicines'? 'active' : ''}`}
                >
                    List of Medicines
                </Link>
                <Link 
                to={'MedicineGroups'} 
                className={`admin-sidenav1-link2 ${inventoryOpen ? "" : "disabled"} ${location.pathname === '/OrtegaAdmin/MedicineGroups'? 'active' : ''}`}
                >
                    Medicine Groups
                </Link>


                {/* Reports */}
                <div 
                className={`admin-sidenav1-link ${reportsOpen ? 'opened' : ''}`} 
                onClick={() => setReportsOpen(!reportsOpen)}
                >
                    <div className="d-flex align-items-center" style={{gap: 15}}>
                        <img src="/src/assets/media/icons/trend.svg" alt="" />
                        <div>Reports</div>
                    </div>
                    {reportsOpen
                    ? (<Icon.CaretUpFill className="text-m3"/>)
                    : (<Icon.CaretDownFill className="text-m3"/>)}
                    
                </div>
                <Link 
                to={"SalesReports"} 
                className={`admin-sidenav1-link2 ${reportsOpen ? "" : "disabled"} ${location.pathname === '/OrtegaAdmin/SalesReports'? 'active' : ''}`}
                >
                    Sales Report
                </Link>
                <Link 
                to={"PaymentReports"} 
                className={`admin-sidenav1-link2 ${reportsOpen ? "" : "disabled"} ${location.pathname === '/OrtegaAdmin/PaymentReports'? 'active' : ''}`}
                >
                    Payments Report
                </Link>

                <Link 
                to={"POS"}  
                className={`admin-sidenav1-link ${location.pathname === '/OrtegaAdmin/POS'? 'active' : ''}`}>
                    <div className="d-flex align-items-center" style={{gap: 15}}>
                        <img src="/src/assets/media/icons/cash-register.svg" alt="" />
                        <div>POS</div>
                    </div>
                </Link>

                <Link 
                to={"Configurations"}
                className={`admin-sidenav1-link ${location.pathname === '/OrtegaAdmin/Configurations'? 'active' : ''}`}>
                    <div className="d-flex align-items-center" style={{gap: 15}}>
                        <img src="/src/assets/media/icons/options1.svg" alt="" />
                        <div>Configurations</div>
                    </div>
                </Link>


                <div className="hr-line1-white1 mar-y-2"></div>


                <div className="admin-sidenav1-link">
                    <div className="d-flex align-items-center" style={{gap: 15}}>
                        <img src="/src/assets/media/icons/users.svg" alt="" />
                        <div>Contract Management</div>
                    </div>
                    <Icon.CaretDownFill className="text-m3"/>
                </div>

                <div className="admin-sidenav1-link">
                    <div className="d-flex align-items-center" style={{gap: 15}}>
                        <img src="/src/assets/media/icons/bell.svg" alt="" />
                        <div>Notifications</div>
                    </div>
                </div>


                <div className="hr-line1-white1 mar-y-2"></div>


                <div className="admin-sidenav1-link">
                    <div className="d-flex align-items-center" style={{gap: 15}}>
                        <img src="/src/assets/media/icons/gear.svg" alt="" />
                        <div>App Settings</div>
                    </div>
                </div>

                <div className="admin-sidenav1-link">
                    <div className="d-flex align-items-center" style={{gap: 15}}>
                        <img src="/src/assets/media/icons/info-box.svg" alt="" />
                        <div>Get Technical Help</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminSidenav;