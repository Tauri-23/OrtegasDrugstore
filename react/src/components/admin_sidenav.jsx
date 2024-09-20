import * as Icon from "react-bootstrap-icons";

const AdminSidenav = () => {
    return (
        <div className="admin-sidenav1">
            <div className="admin-sidenav1-head text-l3 fw-bold">
                Ortega's Drug store
            </div>

            <div className="admin-sidenav1-user">
                <div className="d-flex align-items-center" style={{gap: 15}}>
                    <div className="admin-sidenav1-pfp">
                        Y
                    </div>
                    <div className="h-100">
                        <div className="text-m3 color-white1">
                            Yuma Wakayama
                        </div>
                        <div className="text-m3 color-white1">
                            Admin
                        </div>
                    </div>
                </div>

                <Icon.ThreeDotsVertical className="text-l2 color-white1"/>
            </div>

            <div className="admin-sidenav1-links">
                <div className="admin-sidenav1-link active">
                    <div className="d-flex align-items-center" style={{gap: 15}}>
                        <img src="/src/assets/media/icons/dashboard.svg" alt="" />
                        <div>Dashboard</div>
                    </div>
                </div>

                <div className="admin-sidenav1-link">
                    <div className="d-flex align-items-center" style={{gap: 15}}>
                        <img src="/src/assets/media/icons/medicine.svg" alt="" />
                        <div>Inventory</div>
                    </div>
                    <Icon.CaretDownFill className="text-m3"/>
                </div>

                <div className="admin-sidenav1-link">
                    <div className="d-flex align-items-center" style={{gap: 15}}>
                        <img src="/src/assets/media/icons/trend.svg" alt="" />
                        <div>Reports</div>
                    </div>
                    <Icon.CaretDownFill className="text-m3"/>
                </div>

                <div className="admin-sidenav1-link">
                    <div className="d-flex align-items-center" style={{gap: 15}}>
                        <img src="/src/assets/media/icons/options1.svg" alt="" />
                        <div>Configurations</div>
                    </div>
                </div>


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