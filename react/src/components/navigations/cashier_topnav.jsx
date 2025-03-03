const CashierTopNav = ({onLogout}) => {
    return(
        <div className="nav1">
            <h3>Ortegas Drugstore</h3>
            <button className="primary-btn-red1" onClick={onLogout}>Logout</button>
        </div>
    );
}

export default CashierTopNav;