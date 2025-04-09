import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "antd";

export default function AdminReturnManagementDefault() {
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState("Index");



    /**
     * Render
     */
    return(
        <div className="content1">
            <h2 className="mar-bottom-l1 fw-bold">Return Management</h2>

            <div className="d-flex mar-bottom-l1 gap3">
                <Button
                size="large"
                type={activePage === "Index" ? "primary" : ""}
                onClick={() => navigate('/OrtegaAdmin/ReturnManagement')}>
                    Return an item
                </Button>

                <Button
                size="large"
                type={activePage === "History" ? "primary" : ""}
                onClick={() => navigate('/OrtegaAdmin/ReturnManagement/History')}>
                    Return history
                </Button>
            </div>
            
            <Outlet context={{ setActivePage, }}/>
        </div>
    )
}