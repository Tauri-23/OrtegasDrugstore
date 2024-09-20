import { useState } from "react";
import axiosClient from "../../axios-client";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("asdasd");

        const formData = new FormData();
        formData.append("uname", username);
        formData.append("pass", password);
        
        axiosClient.post('/login', formData)
        .then(({data}) => {
            console.log(data);
            if(data.status === 200) {
                alert("login successfully");
            }
            else {
                alert("Credentials doesn't match.")
            }
        }).catch((error) => console.error(error));

    }

    return(
        <div className="d-flex w-100 justify-content-center align-items-center" style={{height: "100vh"}}>
            <form onSubmit={(e) => handleSubmit(e)}>
                <h1>Login</h1>

                <label htmlFor="uname">Username</label>
                <input type="text" id="uname" onInput={(e) => setUsername(e.target.value)}/> <br/>

                <label htmlFor="pword">Password</label>
                <input type="password" id="pword" onInput={(e) => setPassword(e.target.value)}/> <br/>
                <button>Login</button>
            </form>
        </div>
    );
}