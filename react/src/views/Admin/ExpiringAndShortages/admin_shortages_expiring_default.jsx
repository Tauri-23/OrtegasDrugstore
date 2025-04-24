import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

export default function AdminShortagesExpiringDefault() {
    const [page, setPage] = useState("Shortage");



    /**
     * Render
     */
    return(
        <div className="content1">
            <h3 className="fw-bold mar-bottom-1">{page === "Shortage" ? "Low Stock Items" : "Expiring Items"}</h3>
            <div className="d-flex align-items-center gap3 mar-bottom-1">
                <Link to={`/OrtegaAdmin/MedicineShortageExpiring`} className={`${page === "Shortage" ? "primary" : "secondary"}-btn-dark-blue1`}>Shortages</Link>
                <Link to={`/OrtegaAdmin/MedicineShortageExpiring/Expiring`} className={`${page === "Expiring" ? "primary" : "secondary"}-btn-dark-blue1`}>Expiring</Link>
                <Link to={`/OrtegaAdmin/MedicineShortageExpiring/PurchaseRequests`} className={`${page === "Purchase Requests" ? "primary" : "secondary"}-btn-dark-blue1`}>Purchase Requests</Link>
            </div>

            <Outlet
            context={{
                setPage
            }}
            />
        </div>
    )
}