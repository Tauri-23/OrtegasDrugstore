import propTypes from 'prop-types';
import { useState } from 'react';
import * as Icon from "react-bootstrap-icons";

const AdminAddMedGroupModal1 = ({handeAddPost, onClose}) => {
    const [groupName, setGroupName] = useState("");

    return(
        <div className="modal1">
            <div className="modal-box3">
                <div className="d-flex gap1 mar-bottom-1 align-items-center position-relative">
                    <div className="circle-btn1 text-l1 position-absolute" onClick={onClose}>
                        <Icon.X/>
                    </div>
                    <div className="text-l3 fw-bold text-center w-100">Add Medicine Group</div>
                </div>

                <div className='d-flex flex-direction-y gap4 mar-bottom-1'>
                    <label htmlFor="grpname">Goup Name</label>
                    <input type="text" id="grpname" className="input1" onInput={(e) => setGroupName(e.target.value)}/>
                </div>

                <div className="d-flex flex-direction-y gap3">
                    <div className="primary-btn-dark-blue1 text-center" onClick={() => {handeAddPost(groupName); onClose()}}>Add</div>
                    {/* <div className="secondary-btn-black1 text-center" onClick={onClose}>Cancel</div> */}
                </div>
            </div>
        </div>
    )
}

AdminAddMedGroupModal1.propTypes = {
    onClose: propTypes.func.isRequired,
}

export default AdminAddMedGroupModal1