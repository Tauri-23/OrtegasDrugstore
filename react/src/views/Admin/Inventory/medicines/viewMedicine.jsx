import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Icon from "react-bootstrap-icons";
import { fetchMedicineFullInfoById } from "../../../../Services/GeneralMedicineService";
import '../../../../assets/css/medicines.css';
import { useModal } from "../../../../Context/ModalContext";
import axiosClient from "../../../../axios-client";
import { formatDateTime, isEmptyOrSpaces, notify } from "../../../../assets/js/utils";
import { EditMedInfo1 } from "../../../../components/admin/edit_med_info1";
import { fetchAllForecastWhereMedicine } from "../../../../Services/ForecastServices";
import LineChart1 from "../../../../components/charts/LineChart1";

export default function AdminViewMedicine() {
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
        showModal('AdminAddMedItemModal1', {handleAddPost: (expiration, sku) => {
            /**
             * TODO::Cheker if id(SKU) is already exist
             */

            const formData = new FormData();
            formData.append('sku', sku);
            formData.append('medicine', medicine.id);
            formData.append('expiration', expiration);

            axiosClient.post('/add-medicine-item', formData)
            .then(({data}) => {
                setMedicine(data.medicine);
                notify(data.status === 200 ? 'success' : 'error', data.message, 'top-center', 3000);
            }).catch(error => console.error(error));
        }});
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
                    ? (<img src={`/src/assets/media/medicines/${medicine.pic}`}/>)
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
                            </div>
                        )
                        : (
                            <>Loading Monthly Forecast</>
                        )}                        
                    </div>                    
                </div>

                <div className="d-flex gap1 mar-bottom-1">

                    <div className="view-medicine-box1 w-50">
                        <div className="view-medicine-box1-head">
                            <div className="text-l3">Medicine</div>
                        </div>
                        <div className="hr-line1-black3"></div>
                        <div className="view-medicine-box1-body d-flex gapl1">
                            <div className="d-flex flex-direction-y w-50">
                                <div className="text-m1 fw-bold">{medicine.medicine_id}</div>
                                <div className="text-m3">Medicine ID</div>
                            </div>
                            <div className="d-flex flex-direction-y w-50">
                                <div className="text-m1 fw-bold">{medicine.group.group_name}</div>
                                <div className="text-m3">Medicine Goup</div>
                            </div>
                        </div>
                    </div>

                    {/* Inventory */}
                    <div className="view-medicine-box1 w-50" style={{height: '300px', overflow: 'auto'}}>
                        <div 
                        className="view-medicine-box1-head d-flex align-items-center justify-content-between"
                        style={{position: 'sticky', top: 0, background: 'white', filter: 'drop-shadow(0 0 1px #555555)'}}>
                            <div className="text-l3">Inventory</div>
                            <button 
                            className={`primary-btn-dark-blue1 d-flex gap3 align-items-center text-m2`}
                            onClick={handleAddMedicineItem}
                            >
                                <Icon.Capsule/> Add Item
                            </button>
                        </div>
                        <div className="view-medicine-box1-body d-flex gapl1">
                            <div className="d-flex flex-direction-y w-100">
                                <div className="d-flex justify-content-between w-100 fw-bold">
                                    <p>SKU</p>
                                    <p>Expiration Date</p>
                                    <p>Added Date</p>
                                </div>
                                {medicine.medicine_items.length > 0
                                ? medicine.medicine_items.map(item => (
                                    <div key={item.id} className="d-flex justify-content-between w-100">
                                        <p>{item.id}</p>
                                        <p>{item.expiration_date}</p>
                                        <p>{formatDateTime(item.created_at)}</p>
                                    </div>
                                ))
                                : (
                                    <>No Items</>
                                )}              
                            </div>
                        </div>
                    </div>

                </div>

                {/* Directions */}
                <div className="d-flex mar-bottom-1">
                    <EditMedInfo1
                    title={"How to use"}
                    oldInfo={medicine.directions}
                    setNewInfo={setNewDirections}
                    setNewInfoChecking={setNewDirectionsForCheck}
                    saveBtnEnabledAt={!isEmptyOrSpaces(newDirectionsForCheck) && newDirections !== medicine.directions}
                    isEditInfo={isEditDirection}
                    setEditInfo={setEditDirection}
                    handleEditPost={() => handleEditPost('directions')}
                    />
                </div>

                {/* Side Effects */}
                <div className="d-flex mar-bottom-1">
                    <EditMedInfo1
                    title={"Side effects"}
                    oldInfo={medicine.side_effects}
                    setNewInfo={setNewSideFx}
                    setNewInfoChecking={setNewSideFxForCheck}
                    saveBtnEnabledAt={!isEmptyOrSpaces(newSideFxForCheck) && newSideFx !== medicine.side_effects}
                    isEditInfo={isEditSideFx}
                    setEditInfo={setEditSideFx}
                    handleEditPost={() => handleEditPost('sidefx')}
                    />
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