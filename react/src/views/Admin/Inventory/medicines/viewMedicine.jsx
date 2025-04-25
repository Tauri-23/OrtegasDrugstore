import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Icon from "react-bootstrap-icons";
import { fetchMedicineFullInfoById } from "../../../../Services/GeneralMedicineService";
import '../../../../assets/css/medicines.css';
import { useModal } from "../../../../Context/ModalContext";
import axiosClient from "../../../../axios-client";
import { formatDate, formatDateTime, formatToPhilPeso, getInterpretationSummary, isEmptyOrSpaces, notify } from "../../../../assets/js/utils";
import { EditMedInfo1 } from "../../../../components/admin/edit_med_info1";
import { fetchAllForecastWhereMedicine } from "../../../../Services/ForecastServices";
import LineChart1 from "../../../../components/charts/LineChart1";
import { useStateContext } from "../../../../Context/ContextProvider";
import { Button, Input, Select, Spin, Table } from "antd";
import { fetchAllMedGroups } from "../../../../Services/GeneralMedicineGroupService";

export default function AdminViewMedicine() {
    const {user} = useStateContext();
    const {showModal} = useModal();
    const {medId} = useParams();
    const navigate = useNavigate();


    const [medicine, setMedicine] = useState(null);
    const [groups, setGroups] = useState(null);

    const [newMedPic, setNewMedPic] = useState(null);

    const [forecastWeek, setForecastWeek] = useState(null);
    const [forecastMonth, setForecastMonth] = useState(null);

    const [weekChartData, setWeekChartData] = useState(null);
    const [monthChartData, setMonthChartData] = useState(null);

    /**
     * For Edit Medicine
     */
    const [isEditMedicine, setIsEditMedicine] = useState(false);
    const [editMedicine, setEditMedicine] = useState({
        name: "",
        group: "",
        type: "",
        prescription: false,
        discountable: false
    });



    /**
     * Onmount
     */
    useEffect(() => {

        const getAll = async() => {
            try {
                const [medicineDb, forecastDb, groupsDb] = await Promise.all([
                    fetchMedicineFullInfoById(medId),
                    fetchAllForecastWhereMedicine(medId),
                    fetchAllMedGroups()
                ]);
                setMedicine(medicineDb);
                setForecastWeek(forecastDb.forecast.forecast_week);
                setForecastMonth(forecastDb.forecast.forecast_month);
                setGroups(groupsDb);
                setEditMedicine({
                    name: medicineDb.name,
                    group: medicineDb.group.id,
                    type: medicineDb.type,
                    prescription: medicineDb.prescription ? true : false,
                    discountable: medicineDb.discountable ? true : false
                });
            } catch (error) {
                console.error(error);
            }
        }

        getAll();
    }, []);



    /**
     * Prep Data for Charts
     */
    useEffect(() => {
        if(forecastWeek) {
            setWeekChartData({
                labels: forecastWeek.map((entry) => entry.ds),
                datasets: [
                    {
                        label: 'Weekly Forecast',
                        data: forecastWeek.map((entry) => Math.round(Number(entry.yhat))),
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                    },
                ],
            })
        }
    }, [forecastWeek]);

    useEffect(() => {
        if(forecastMonth) {
            setMonthChartData({
                labels: forecastMonth.map((entry) => entry.ds),
                datasets: [
                    {
                        label: 'Monthly Forecast',
                        data: forecastMonth.map((entry) => Math.round(Number(entry.yhat))),
                        borderColor: 'rgba(153, 102, 255, 1)',
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        fill: true,
                    },
                ],
            })
        }
    }, [forecastMonth]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Sales Forecast',
            },
        },
        tension: .2
    };



    /**
     * Setup Table Columns
     */
    const inventoryColumns = [
        {
            title: "Batch Number",
            dataIndex: "id"
        },
        {
            title: "Expiration Date",
            render: (_, item) => formatDate(item.expiration_date)
        },
        {
            title: "Quantity",
            dataIndex: "qty"
        },
        {
            title: "Added Date",
            render: (_, item) => formatDateTime(item.created_at)
        },
    ]



    /**
     * Handle Edit Med Pic
     */
    const handleUploadClick = () => {
        document.getElementById('fileInput').click();
    }

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        setNewMedPic(...imageFiles);
    }

    const handleChangePfp = () => {
        const formData = new FormData();
        formData.append('medicine_id', medicine.id);
        formData.append('pic', newMedPic);
        formData.append('admin', user.id);

        axiosClient.post('/update-medicine-pic', formData)
        .then(({data}) => {
            if(data.status === 200) {
                setMedicine(data.medicine);
            }
            notify(data.status === 200 ? "success" : "error", data.message, 'top-center', 3000);
        });
    }

    useEffect(() => {
        if(newMedPic !== null && newMedPic !== undefined) {
            console.log(newMedPic);
            showModal('AdminEditMedPicPreviewModal1', {pic: newMedPic, handleUpdatePost: handleChangePfp});
        }
    }, [newMedPic])

    
    /**
     * Handle Delete Medicine
     */
    const handleDelPost = (id) => {
        const formData = new FormData();
        formData.append('medId', id);

        axiosClient.post('/del-medicine', formData)
        .then(({data}) => {
            if(data.status === 200) {
                notify('success', data.message, 'top-center', 3000);
                navigate('/OrtegaAdmin/Medicines');
            } else {
                notify('success', data.message, 'top-center', 3000);
            }
        }).catch(error => console.error(error))
    }

    const handleDelBtn = () => {
        showModal('AdminDelMedConfirmationModal1', {medicine,handleDelPost})
    }



    /**
     * Handle Edit Medicine
     */
    const handleEditMedClick = () => {
        if (!isEditMedicine) {
            // We're entering edit mode – prefill the state
            setEditMedicine({
                name: medicine.name,
                group: medicine.group.id,
                type: medicine.type,
                prescription: medicine.prescription ? true : false,
                discountable: medicine.discountable ? true : false,
                price: medicine.price,
                cost_price: medicine.cost_price
            });
        }
        setIsEditMedicine(prev => !prev);
    };

    const handleEditMedInput = (e) => {
        setEditMedicine(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    const handleEditMedSave = () => {
        const formData = new FormData();
        formData.append("medId", medicine.id);
        formData.append("editMed", JSON.stringify(editMedicine));

        axiosClient.post("/update-medicine", formData)
        .then(({data}) => {
            if(data.status === 200) {
                setMedicine(data.medicine);
                setIsEditMedicine(false);
            }
            notify(data.status === 200 ? "success" : "error", data.message, "top-center", 3000);
        })
        .catch((error) => {
            notify("error", "Server error (Check Console)", "top-center", 3000);
            console.error(error);
        })
    }


    /**
     * Handle Add Medicine Item
     */
    const handleAddMedicineItem = () => {
        showModal('AdminAddMedItemModal1', {
            handleAddPost: (expiration, qty) => {
                const formData = new FormData();
                formData.append('medicine', medicine.id);
                formData.append('expiration', expiration);
                formData.append('qty', qty);
                formData.append('admin', user.id);

                axiosClient.post('/add-medicine-item', formData)
                .then(({data}) => {
                    notify(data.status === 200 ? 'success' : 'error', data.message, 'top-center', 3000);
                    if(data.status === 200) {                    
                        setMedicine(data.medicine);
                    }
                }).catch(error => console.error(error));
            }
        });
    }
    


    /**
     * Render
     */
    return(
        <div className="content1">
            {medicine && groups
            ? (
                <>
                    <div className="d-flex justify-content-start mar-bottom-3">
                        <Link to={'/OrtegaAdmin/Medicines'} className="d-flex gap4 align-items-center color-black1"><Icon.ArrowLeft className="text-m1"/> Back</Link>
                    </div>

                    <div className="d-flex mar-bottom-l1 align-items-center justify-content-between">
                        <div className="text-l1 fw-bolder">{medicine.name}</div>
                    </div>

                    {/* Photo */}
                    <div className="view-medicine-photo-box mar-bottom-1">
                            {medicine.pic
                            ? (<img src={`/media/medicines/${medicine.pic}`}/>)
                            : (<>{medicine.name[0]}</>)}

                            <div className="view-medicine-photo-box-overlay">
                                <Icon.PenFill onClick={handleUploadClick}/>
                                <input 
                                    type="file" 
                                    id="fileInput"
                                    className='d-none'
                                    multiple 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                    </div>

                    <div className="d-flex gap1 mar-bottom-1">
                            <div className="view-medicine-box1 w-50">
                                {(weekChartData)
                                ? (
                                    <div className="view-medicine-box1-body">
                                        <LineChart1
                                            title="Weekly Forecast"
                                            data={weekChartData}
                                            options={chartOptions}
                                        />
                                        <div 
                                        className="mar-top-1 text-align-justify" 
                                        style={{ whiteSpace: "pre-line" }} 
                                        dangerouslySetInnerHTML={{__html: getInterpretationSummary(forecastWeek, "Weekly")}}/>
                                    </div>
                                )
                                : (
                                    <>Loading Weekly Forecast</>
                                )}
                            </div>

                            <div className="view-medicine-box1 w-50">
                                {(monthChartData)
                                ? (
                                    <div className="view-medicine-box1-body">
                                        <LineChart1
                                            title="Monthly Forecast"
                                            data={monthChartData}
                                            options={chartOptions}
                                        />
                                        <div 
                                        className="mar-top-1 text-align-justify" 
                                        style={{ whiteSpace: "pre-line" }} 
                                        dangerouslySetInnerHTML={{__html: getInterpretationSummary(forecastMonth, "Monthly")}}/>
                                    </div>
                                )
                                : (
                                    <>Loading Monthly Forecast</>
                                )}                        
                            </div>                    
                    </div>

                    {/**
                     * Medicine Information
                     */}
                    <div className="view-medicine-box1 w-100 mar-bottom-1">
                        <div className="view-medicine-box1-head d-flex justify-content-between align-items-center">
                            <div className="text-l3">Medicine</div>
                            {!isEditMedicine && (
                                <Button
                                type="primary"
                                onClick={handleEditMedClick}>Edit Medicine</Button>
                            )}
                        </div>
                        <div className="hr-line1-black3"></div>
                        <div className="view-medicine-box1-body">
                            <div className="d-flex gapl1 mar-bottom-3">
                                {/* Name */}
                                <div className="d-flex flex-direction-y w-50">
                                    {isEditMedicine
                                    ? (
                                        <Input
                                        name="name"
                                        size="large"
                                        value={editMedicine.name}
                                        onChange={handleEditMedInput}/>
                                    )
                                    : (
                                        <div className="text-m1 fw-bold">{medicine.name}</div>
                                    )}
                                    <div className="text-m3">Medicine Name</div>
                                </div>

                                {/* Group */}
                                <div className="d-flex flex-direction-y w-50">
                                    {isEditMedicine
                                    ? (
                                        <Select
                                        name="group"
                                        size="large"
                                        style={{width: 300}}
                                        value={editMedicine.group}
                                        options={[
                                            {label: "Select Medicine Groups", value: ""},
                                            ...groups.map((group) => ({label: group.group_name, value: group.id}))
                                        ]}
                                        onChange={(value) => handleEditMedInput({target: {name: "group", value: value}})}/>
                                    )
                                    : (
                                        <div className="text-m1 fw-bold">{medicine.group.group_name}</div>
                                    )}
                                    <div className="text-m3">Medicine Goup</div>
                                </div>
                            </div>

                            <div className="d-flex gapl1 mar-bottom-3">
                                {/* Type */}
                                <div className="d-flex flex-direction-y w-50">
                                    {isEditMedicine
                                    ? (
                                        <Select
                                        name="type"
                                        size="large"
                                        value={editMedicine.type}
                                        options={[
                                            {label: "Select Types", value: ""},
                                            {label: "Generic", value: "Generic"},
                                            {label: "Branded", value: "Branded"},
                                        ]}
                                        onChange={(value) => handleEditMedInput({target: {name: "type", value}})}/>
                                    )
                                    : (
                                        <div className="text-m1 fw-bold">{medicine.type}</div>
                                    )}
                                    <div className="text-m3">Medicine Type</div>
                                </div>

                                {/* Prescription */}
                                <div className="d-flex flex-direction-y w-50">
                                    {isEditMedicine
                                    ? (
                                        <Select
                                        name="prescription"
                                        size="large"
                                        value={editMedicine.prescription}
                                        options={[
                                            {label: "Does prescription needed", value: ""},
                                            {label: "Yes", value: true},
                                            {label: "No", value: false},
                                        ]}
                                        onChange={(value) => handleEditMedInput({target: {name: "prescription", value}})}/>
                                    )
                                    : (
                                        <div className="text-m1 fw-bold">{medicine.prescription ? "Yes" : "No"}</div>
                                    )}
                                    <div className="text-m3">Prescription Needed</div>
                                </div>
                            </div>

                            <div className="d-flex gapl1 mar-bottom-3">
                                {/* Discountable */}
                                <div className="d-flex flex-direction-y w-50">
                                    {isEditMedicine
                                    ? (
                                        <Select
                                        name="discountable"
                                        size="large"
                                        value={editMedicine.discountable}
                                        options={[
                                            {label: "Discountable", value: ""},
                                            {label: "Yes", value: true},
                                            {label: "No", value: false},
                                        ]}
                                        onChange={(value) => handleEditMedInput({target: {name: "discountable", value}})}/>
                                    )
                                    : (
                                        <div className="text-m1 fw-bold">{medicine.discountable ? "Yes" : "No"}</div>
                                    )}
                                    <div className="text-m3">Discountable</div>
                                </div>
                            </div>

                            <div className="d-flex gapl1 mar-bottom-2">
                                {/* Cost Price */}
                                <div className="d-flex flex-direction-y w-50">
                                    {isEditMedicine
                                    ? (
                                        <Input
                                        name="cost_price"
                                        size="large"
                                        value={editMedicine.cost_price}
                                        onChange={(e) => !isNaN(e.target.value) ? handleEditMedInput(e) : null}/>
                                    )
                                    : (
                                        <div className="text-m1 fw-bold">{formatToPhilPeso(medicine.cost_price)}</div>
                                    )}
                                    <div className="text-m3">Cost Price</div>
                                </div>

                                {/* Prescription */}
                                <div className="d-flex flex-direction-y w-50">
                                    {isEditMedicine
                                    ? (
                                        <Input
                                        name="price"
                                        size="large"
                                        value={editMedicine.price}
                                        onChange={(e) => !isNaN(e.target.value) ? handleEditMedInput(e) : null}/>
                                    )
                                    : (
                                        <div className="text-m1 fw-bold">{formatToPhilPeso(medicine.price)}</div>
                                    )}
                                    <div className="text-m3">Selling Price</div>
                                </div>
                            </div>
                            
                            {/* Buttons */}
                            {isEditMedicine && (
                                <div className="d-flex justify-content-end gap3">
                                    <Button
                                    onClick={handleEditMedClick}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                    type="primary"
                                    disabled={isEmptyOrSpaces(editMedicine.name) || editMedicine.group === "" || editMedicine.type === "" || 
                                        editMedicine.prescription === "" || editMedicine.discountable === "" || !editMedicine.price > 0 || !editMedicine.cost_price > 0}
                                    onClick={handleEditMedSave}
                                    >
                                        Save
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Inventory */}
                    <div className="mar-bottom-1">
                        <div className="d-flex align-items-center justify-content-between mar-bottom-2">
                            <div className="text-l3">Inventory</div>

                            <button 
                            className={`primary-btn-dark-blue1 d-flex gap3 align-items-center text-m2`}
                            onClick={handleAddMedicineItem}
                            >
                                <Icon.Capsule/> Add Item
                            </button>
                        </div>

                        <Table
                        columns={inventoryColumns}
                        dataSource={medicine.medicine_items}
                        bordered
                        pagination={{pageSize: 10}}/>
                    </div>

                    

                    <div className="d-flex justify-content-start">
                        <div onClick={handleDelBtn} className="primary-btn-red1 text-m1 d-flex align-items-center gap3"><Icon.Trash/>Delete Medicine</div>
                    </div>        
                </>
            )
            : (
                <Spin size="large"/>
            )}
            
        </div>
    )
}