import * as Icon from "react-bootstrap-icons";

export default function AdminMedicines() {
    const medicines = [
        {
            id: "D06ID232435454",
            name: "Augmentin 625 Duo Tablet",
            group: "Generic Medicine",
            stock: 350
        },
        {
            id: "D06ID232435451",
            name: "Azithral 500 Tablet",
            group: "Generic Medicine",
            stock: 20
        },
        {
            id: "D06ID232435452",
            name: "Ascoril LS Syrup",
            group: "Diabetes ",
            stock: 85
        }
    ]

    return(
        <div className="content1">
            <div className="d-flex justify-content-between align-items-center mar-bottom-l1">
                <div>
                    <div className="text-l1 fw-bolder">Medicines</div>
                    <div className="text-m1">List of medicines available for sales.</div>
                </div>
                
                <div className="primary-btn-dark-blue1 d-flex gap3 align-items-center"><Icon.PlusLg className="text-l3"/> Add Medicine</div>
            </div>

            <div className="d-flex justify-content-between mar-bottom-1">
                <div className="d-flex position-relative align-items-center">
                    <input type="text" className="search-box1 text-m1" placeholder="Search Medicine Inventory.."/>
                    <div className="search-box1-icon"><Icon.Search className="text-l3"/></div>
                </div>

                <select className="input1">
                    <option value="">- Select Group -</option>
                </select>
                
            </div>

            <table className="table1">
                <thead className="table1-thead">
                    <tr>
                        <th>Medicine Name</th>
                        <th>Medicine ID</th>
                        <th>Group Name</th>
                        <th>Stock in Qty</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody className="table1-tbody">
                    {medicines.map((meds, index) => (
                        <tr key={index}>
                            <td>{meds.name}</td>
                            <td>{meds.id}</td>
                            <td>{meds.group}</td>
                            <td>{meds.stock}</td>
                            <td>
                                <div className="d-flex gap1 align-items-center">
                                    <div className="text-m2">
                                        View Full Details
                                    </div>
                                    <Icon.ChevronDoubleRight/>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}