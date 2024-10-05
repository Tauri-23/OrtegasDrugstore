import * as Icon from "react-bootstrap-icons";

export const EditMedInfo1 = ({
    title,
    oldInfo,
    setNewInfo,
    setNewInfoChecking,
    saveBtnEnabledAt,
    isEditInfo,
    setEditInfo,
}) => {
    return (
        <div className="view-medicine-box1 w-100">
            <div className="view-medicine-box1-head d-flex align-items-center justify-content-between">
                <div className="text-l3">{title}</div>
                <div 
                className={`primary-btn-dark-blue1 d-flex gap3 align-items-center text-m2 ${isEditInfo ? 'd-none' : ''}`}
                onClick={() => setEditInfo(true)}
                >
                    <Icon.Pen/> Edit
                </div>
            </div>
            <div className="hr-line1-black3"></div>
            <div
            className={`view-medicine-box1-body text-m1 ${isEditInfo ? 'editable' : ''}`}
            dangerouslySetInnerHTML={{__html: oldInfo}} 
            suppressContentEditableWarning
            contentEditable={isEditInfo}
            onInput={(e) => {setNewInfo(e.target.innerHTML); setNewInfoChecking(e.target.innerText)}}
            />

            <div className={`hr-line1-black3 ${isEditInfo ? '' : 'd-none'}`}></div>
            <div className={`d-flex gap3 ${isEditInfo ? '' : 'd-none'}`} style={{padding: '20px'}}>
                <div className={`colorless-btn1`} onClick={() => setEditInfo(false)}>Cancel</div>
                <button className={`primary-btn-dark-blue1 ${saveBtnEnabledAt ? '' : 'disabled'} `}>Save</button>
            </div>
        </div>
    )
}