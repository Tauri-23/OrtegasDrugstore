import { useState } from "react";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return(
        <div className="d-flex w-100 bg-info" style={{height: "100vh"}}>
            <form method="post">
                <label htmlFor="uname">Username</label>
                <input type="text" id="uname" onInput={(e) => setUsername(e.target.value)}/> <br/>

                <label htmlFor="pword">Password</label>
                <input type="text" id="pword" onInput={(e) => setPassword(e.target.value)}/> <br/>
            </form>
        </div>
    );
}