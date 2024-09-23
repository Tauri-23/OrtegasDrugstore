import { Navigate, Outlet } from "react-router-dom";
import AdminSidenav from "../../components/admin_sidenav";
import { useStateContext } from "../../Context/ContextProvider";
import { useEffect } from "react";
import axiosClient from "../../axios-client";

export default function AdminDefault() {
    const {user, userType, token, setUser, setUserType, setToken} = useStateContext();

    useEffect(() => {
        if(token) {
            axiosClient.get('/user')
            .then(({data}) => {
                setUser(data.user);
            })
            .catch((error) => {
                if(error.response && error.response.status === 401) {
                    setUser({});
                    setToken(null);
                }
            })
        }
    }, []);

    const onLogout = (e) => {
        axiosClient.post('/logout')
            .then(() => {
                setUser({});
                setToken(null);
                setUserType(null);
            });
    };

    if(!token || userType !== "admin") {
        return <Navigate to={"/"}/>;
    }

    return(
        <div>
            <AdminSidenav/>
            <Outlet/>
        </div>
    );
}