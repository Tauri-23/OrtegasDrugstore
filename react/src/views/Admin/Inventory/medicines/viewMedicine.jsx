import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Icon from "react-bootstrap-icons";
import { fetchMedicineFullInfoById } from "../../../../Services/GeneralMedicineService";
import '../../../../assets/css/medicines.css';
import { useModal } from "../../../../Context/ModalContext";
import axiosClient from "../../../../axios-client";
import { formatDate, formatDateTime, getInterpretation, isEmptyOrSpaces, notify } from "../../../../assets/js/utils";
import { EditMedInfo1 } from "../../../../components/admin/edit_med_info1";
import { fetchAllForecastWhereMedicine } from "../../../../Services/ForecastServices";
import LineChart1 from "../../../../components/charts/LineChart1";
import { useStateContext } from "../../../../Context/ContextProvider";
import { Table } from "antd";

export default function AdminViewMedicine() {
    const {user} = useStateContext();
    const {showModal} = useModal();
    const {medId} = useParams();
    const navigate = useNavigate();


    const [medicine, setMedicine] = useState(null);
    const [newDirections, setNewDirections] = useState('');
    const [newDirectionsForCheck, setNewDirectionsForCheck] = useState('');
    const [newSideFx, setNewSideFx] = useState('');
    const [newSideFxForCheck, setNewSideFxForCheck] = useState('');
    const [newQty, setNewQty] = useState(0);

    const [isEditDirection, setEditDirection] = useState(false);
    const [isEditSideFx, setEditSideFx] = useState(false);
    const [isEditQty, setEditQty] = useState(false);

    const [newMedPic, setNewMedPic] = useState(null);

    const [forecastWeek, setForecastWeek] = useState(null);
    const [forecastMonth, setForecastMonth] = useState(null);

    const [weekChartData, setWeekChartData] = useState(null);
    const [monthChartData, setMonthChartData] = useState(null);

    const [metrics, setMetrics] = useState();



    useEffect(() => {

        const getAll = async() => {
            try {
                const [medicineDb, forecastDb] = await Promise.all([
                    fetchMedicineFullInfoById(medId),
                    fetchAllForecastWhereMedicine(medId)
                ]);
                setMedicine(medicineDb);
                setNewQty(medicineDb.qty);
                setForecastWeek(forecastDb.forecast.forecast_week);
                setForecastMonth(forecastDb.forecast.forecast_month);
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
                        data: forecastWeek.map((entry) => entry.yhat),
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                    },
                ],
            })
        }
    }, [forecastWeek]);

    useEffect(() => {
        if(forecastWeek) {
            setWeekChartData({
                labels: forecastWeek.map((entry) => entry.ds),
                datasets: [
                    {
                        label: 'Weekly Forecast',
                        data: forecastWeek.map((entry) => entry.yhat),
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
                        data: forecastMonth.map((entry) => entry.yhat),
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
     * Handle Edit Med Info
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

    const handleEditPost = (editType) => {
        const formData = new FormData();
        formData.append('medId', medicine.id);
        formData.append('editType', editType);

        switch(editType) {
            case 'directions':
                formData.append('directions', newDirections);
                break;
            case 'sidefx':
                formData.append('sideFx', newSideFx);
                break;
            case 'qty':
                formData.append('qty', newQty);
                break;
            default:
                notify('error', 'Invalid Edit Type', 'top-center', 3000);
                return;
        }

        axiosClient.post('/update-medicine', formData)
        .then(({data}) => {
            if(data.status === 200) {
                notify('success', data.message, 'top-center', 3000);
                setMedicine(data.medicine);

                setEditDirection(false);
                setEditSideFx(false);
                setEditQty(false);
            } else {
                notify('error', data.message, 'top-center', 3000);
            }
        }).catch(error => console.error(error));
        
    }


    /**
     * Handle Edit Med Info
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
    if(medicine) {
        return(
            <div className="content1">
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
                                <div className="mar-top-1 text-align-justify">
                                    {getInterpretation(forecastWeek)?.join(" ")}
                                </div>
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
                                <div className="mar-top-1 text-align-justify">
                                    {getInterpretation(forecastMonth)?.join(" ")}
                                </div>
                            </div>
                        )
                        : (
                            <>Loading Monthly Forecast</>
                        )}                        
                    </div>                    
                </div>

                <div className="view-medicine-box1 w-100 mar-bottom-1">
                    <div className="view-medicine-box1-head">
                        <div className="text-l3">Medicine</div>
                    </div>
                    <div className="hr-line1-black3"></div>
                    <div className="view-medicine-box1-body d-flex gapl1">
                        <div className="d-flex flex-direction-y w-50">
                            <div className="text-m1 fw-bold">{medicine.id}</div>
                            <div className="text-m3">Medicine ID</div>
                        </div>
                        <div className="d-flex flex-direction-y w-50">
                            <div className="text-m1 fw-bold">{medicine.group.group_name}</div>
                            <div className="text-m3">Medicine Goup</div>
                        </div>
                        <div className="d-flex flex-direction-y w-50">
                            <div className="text-m1 fw-bold">{medicine.type}</div>
                            <div className="text-m3">Medicine Type</div>
                        </div>
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
            </div>
        )
    }
    else {
        return(
            <div className="content1">
                Loading...
            </div>
        );
    }
}