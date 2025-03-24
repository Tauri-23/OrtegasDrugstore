import { useState } from "react";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../Context/ContextProvider";
import "../../assets/css/signin.css";
import { Input } from "antd";

export default function Login() {
    const {setUser, setToken, setUserType} = useStateContext();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const formData = new FormData();
        formData.append("uname", username);
        formData.append("pass", password);
        
        axiosClient.post('/login', formData)
        .then(({data}) => {
            console.log(data);
            if(data.status === 200) {
                setUser(data.user);
                setToken(data.token);
                setUserType(data.user_type);
            }
            else {
                alert("Credentials doesn't match.");
            }
        }).catch((error) => console.error(error));

    }

    return(
        <div className="d-flex w-100 justify-content-center align-items-center" style={{height: "100vh"}}>
            <form 
            className="sign-in-box"
            onSubmit={(e) => handleSubmit(e)}>
                <h1 className="text-center">Login</h1>

                <fieldset>
                    <label htmlFor="uname" className="mar-bottom-4">Username</label>
                    <Input 
                    className="mar-bottom-3"
                    size="large" 
                    id="uname" 
                    onInput={(e) => setUsername(e.target.value)}/>

                    <label htmlFor="pword" className="mar-bottom-4">Password</label>
                    <Input.Password
                    size="large"
                    id="pword" 
                    onInput={(e) => setPassword(e.target.value)}
                    />
                </fieldset>
                
                <input type="submit" value="Login" className="primary-btn-dark-blue1" />
            </form>
        </div>
    );
}