import { Outlet } from "react-router-dom";

export default function ClientDefault() {
    return(
        <>
            Client Default

            {/* Children */}
            <Outlet/>
        </>
    );
}