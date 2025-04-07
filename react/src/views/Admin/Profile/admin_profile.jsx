import "../../../assets/css/profile.css";
import { useStateContext } from "../../../Context/ContextProvider";


export default function AdminProfile() {
    const {user} = useStateContext();



    /**
     * Render
     */
    return(
        <div className="content1">
            <h3 className="fw-bold mar-bottom-1">Profile</h3>

            <div className="profile-container1">
                <div className="text-m2">Name</div>
                <h4>{user.firstname} {user.lastname}</h4>
            </div>
        </div>
    )
}