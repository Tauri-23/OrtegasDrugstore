import {Navigate, Outlet} from "react-router-dom";
import { useStateContext } from "../../Context/ContextProvider";
import { useEffect } from "react";
import axiosClient from "../../axios-client";

export default function GuestDefault() {
    const {user, token, userType, setUser, setToken, setUserType} = useStateContext();

    useEffect(() => {
        if(token) {
            axiosClient.get('/user')
            .then(({data}) => {
                setUserType(data.user_type);
                setUser(data.user);
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    setUser({});
                    setToken(null);
                    setUserType(null);
                }
            })
        }
    }, []);


    // Redirect
    if(token) {
        console.log(userType);
        if(userType === 'admin') {
            return <Navigate to={"/OrtegaAdmin"}/>
        }
    }

    return(
        <Outlet/>
    )
}