import { Navigate, Outlet } from "react-router-dom";
import { ModalProvider } from "../../Context/ModalContext";
import ModalManager from "../../Managers/ModalManagers";
import { useStateContext } from "../../Context/ContextProvider";
import { useEffect } from "react";
import axiosClient from "../../axios-client";
import CashierTopNav from "../../components/navigations/cashier_topnav";

const CashierDefault = () => {
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

    if(!token || userType !== "cashier") {
        return <Navigate to={"/"}/>;
    }

    const onLogout = (e) => {
        axiosClient.post('/logout')
            .then(() => {
                setUser({});
                setToken(null);
                setUserType(null);
            });
    };

    return(
        <ModalProvider>
            <div className="position-relative">
                <ModalManager/>

                <CashierTopNav onLogout={onLogout}/>

                {/* Children */}
                <Outlet/>
            </div>
        </ModalProvider>
    )
}

export default CashierDefault;