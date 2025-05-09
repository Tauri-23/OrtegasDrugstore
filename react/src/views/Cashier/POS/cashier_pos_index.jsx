import { useCallback, useEffect, useState } from "react";
import * as Icon from 'react-bootstrap-icons';
import "../../../assets/css/pos.css";
import { fetchAllMedGroups } from "../../../Services/GeneralMedicineGroupService";
import { fetchAllMedicinesFull } from "../../../Services/GeneralMedicineService";
import { formatToPhilPeso, isEmptyOrSpaces, notify } from "../../../assets/js/utils";
import { fetchAllDiscounts, fetchAllEnabledDiscounts } from "../../../Services/GeneralDiscountService";
import { useModal } from "../../../Context/ModalContext";
import axiosClient from "../../../axios-client";
import { useStateContext } from "../../../Context/ContextProvider";

export default function CashierPOSIndex() {
    const {showModal} = useModal();
    const {user} = useStateContext();

    const [medGroups, setMedGroups] = useState(null);
    const [medicines, setMedicines] = useState(null);
    const [discounts, setDiscounts] = useState(null);

    const [medicineTemp, setMedicineTemp] = useState([]);

    const [cash, setCash] = useState(0);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchValue, setSearchValue] = useState("");

    const [selectedMeds, setSelectedMeds] = useState([]);
    const [selectedDiscounts, setSelectedDiscounts] = useState(null);

    const [customer, setCustomer] = useState(null);



    /**
     * Get All
     */
    useEffect(() => {
        const getAll = async() => {
            const [medGpDb, medsDb, discountsDb] = await Promise.all([
                fetchAllMedGroups(),
                fetchAllMedicinesFull(),
                fetchAllEnabledDiscounts()
            ]);
            setMedGroups(medGpDb);
            setMedicines(medsDb);
            setDiscounts(discountsDb);
        }

        getAll();
    }, []);



    /**
     * Handle select med
     */
    const handleSelectMed = (medicine) => {
        if(medicine.qty > 0) {
            setSelectedMeds(prev =>
                prev.find(selmed => selmed.id === medicine.id)
                    ? prev.map(selmed => 
                        selmed.id === medicine.id 
                            ? { ...selmed, qty: selmed.qty + 1 }  // Increment QTY
                            : selmed
                      )
                    : [...prev, { id: medicine.id, pic: medicine.pic, name: medicine.name, qty: 1, price: medicine.price, discountable: medicine.discountable ? true : false }] // Add new medicine with qty 1
            );
            setMedicines(prev => 
                prev.map(med => 
                    med.id === medicine.id 
                        ? { ...med, qty: med.qty - 1 }  // Increment QTY
                        : med
                  )
            )
        }
    };
    const removeFromSelectedMed = (medId, medQty) => {
        setSelectedMeds(prev => prev.filter(selmed => selmed.id !== medId));

        setMedicines(prev => 
            prev.map(med => 
                med.id === medId 
                    ? { ...med, qty: med.qty + medQty }  // Increment QTY
                    : med
              )
        )
    }
    const decrementSelectedMed = (medicine) => {
        if (medicine.qty === 1) {
            // If the quantity is 1, remove it from selected meds
            removeFromSelectedMed(medicine.id, 1);
        } else {
            // Otherwise, just decrement the quantity
            setSelectedMeds(prev =>
                prev.map(selmed => 
                    selmed.id === medicine.id 
                        ? { ...selmed, qty: selmed.qty - 1 }  // Decrement QTY
                        : selmed
                )
            );
    
            // Return 1 to the general medicines list since we decreased the selected quantity
            setMedicines(prev => 
                prev.map(med => 
                    med.id === medicine.id 
                        ? { ...med, qty: med.qty + 1 }  // Increment QTY
                        : med
                )
            );
        }
    };
    const incrementMed = (selectedMedicine) => {
        const medQty = medicines.find(med => med.id === selectedMedicine.id).qty
        if(medQty > 0) {
            setSelectedMeds(prev =>
                prev.find(selmed => selmed.id === selectedMedicine.id)
                    ? prev.map(selmed => 
                        selmed.id === selectedMedicine.id 
                            ? { ...selmed, qty: selmed.qty + 1 }  // Increment QTY
                            : selmed
                      )
                    : [...prev, { id: selectedMedicine.id, name: selectedMedicine.name, qty: 1, price: selectedMedicine.price }] // Add new medicine with qty 1
            );
            setMedicines(prev => 
                prev.map(med => 
                    med.id === selectedMedicine.id 
                        ? { ...med, qty: med.qty - 1 }  // Increment QTY
                        : med
                  )
            )
        }
    };



    /**
     * Calculate
     */
    const calculateSubTotal = useCallback(() => {
        return selectedMeds.reduce((acc, med) => acc + med.price * med.qty, 0);
    }, [selectedMeds]);

    const calculateSubTotalDiscountable = useCallback(() => {
        return selectedMeds.filter(x => x.discountable === true).reduce((acc, med) => acc + med.price * med.qty, 0);
    }, [selectedMeds]);

    const calculateVatable = useCallback(() => {
        return selectedDiscounts === null ? selectedMeds.reduce((acc, med) => acc + med.price * med.qty, 0) : 0;
    }, [selectedMeds, selectedDiscounts]);

    const calculateGrandTotal = useCallback(() => {
        let subtotal = calculateSubTotal();
        let totalDiscountVal = calculateDiscountDeduction();
        return subtotal - totalDiscountVal + (calculateVatable() * .12);
    }, [selectedMeds, selectedDiscounts]);

    const calculateDiscountDeduction = useCallback(() => {
        let totalDiscount
        if(selectedDiscounts !== null) {
            totalDiscount = selectedDiscounts?.discount_type === "Amount" ? selectedDiscounts?.discount_value : calculateSubTotalDiscountable() * selectedDiscounts?.discount_value / 100;
        } else {
            totalDiscount = 0;
        }

        return totalDiscount;
    }, [selectedMeds, selectedDiscounts]);



    /**
     * Discounts Handler
     */
    const handleAddDiscountClick = () => {
        showModal('AdminApplyDiscountModal1', {
            discounts, 
            selectedDiscounts, 
            setSelectedDiscounts,
            customer, setCustomer,
        });
    }



    /**
     * Receipt Handler
     */
    const handleCheckout = () => {
        showModal("CashierCheckountItemsPreviewodal", {
            items: selectedMeds,
            subTotal: calculateSubTotal(), 
            discount: selectedDiscounts,
            discountDeduction: calculateDiscountDeduction(), 
            vatable: calculateVatable(),
            total: calculateGrandTotal(),
            handleProceedPayment: () => {
                showModal('AdminPayCashModal1', {cash, setCash, amountDue: calculateGrandTotal(), handlePayPost});
            }
        });
        
    }

    const handlePayPost = (cash) => {
        const formData = new FormData();
        // for customer
        formData.append('hasCustomer', customer ? true : false)
        if(customer) {
            formData.append('id_number', customer.id_number);
            formData.append('name', customer.name);
        }

        // For Transaction
        formData.append('subtotal', calculateSubTotal());
        formData.append('discount_deduction', calculateDiscountDeduction());
        formData.append('discount_name', selectedDiscounts?.discount_name);
        formData.append('discount_type', selectedDiscounts?.discount_type);
        formData.append('discount_value', selectedDiscounts?.discount_value);
        formData.append('vatable', calculateVatable());
        formData.append('vat_additional', calculateVatable() * .12);
        formData.append('total', calculateGrandTotal());
        formData.append('cash', cash);
        formData.append('change', cash - calculateGrandTotal());
        formData.append('cashier', user.id);

        // For Discounts
        formData.append('hasDiscount', selectedDiscounts !== null ? true : false)

        // For Discounts
        selectedMeds.forEach((med, index) => {
            formData.append('items[]', med.id);
            formData.append('qty[]', med.qty);
        });

        axiosClient.post('/add-purchase-transaction', formData)
        .then(({data}) => {
            console.log(data);
            if(data.status === 200) {
                showModal('AdminViewReceiptModal1', {data: data.transaction, handleDoneTransaction, handleVoid});
            }
            console.log(data.transaction[0]);
        }).catch(error => {
            notify("error", "Server Error", "top-center", 3000);
            console.error(error);
        });
    }

    const handleDoneTransaction = () => {
        // TODO::Make a function that will print the receipt in the receipt printer.

        setSelectedMeds([]);
        setSelectedDiscounts(null);
        setCustomer(null);
        setCash(0);
    }

    const handleVoid = (transactionId) => {
        showModal('GeneralConfirmationModal1', {
            title: "Void Transaction", 
            text: "Do you want to void this transaction?", 
            btnTitle: "Void", 
            handleBtnClick: () => {
                const formData = new FormData();
                formData.append('transactionId', transactionId);
                formData.append('cashier', user.id)

                axiosClient.post('/void-purchase-transaction', formData)
                .then(({data}) => {
                    console.log(data);
                    if(data.status === 200) {
                        setSelectedMeds([]);
                        setSelectedDiscounts([]);
                        setCustomer(null);
                        setMedicines(data.medicines);
                        setCash(0);
                    }
                    notify(data.status === 200 ? 'success' : 'error', data.message, 'top-center', 3000);
                }).catch(error => console.error(error));
            }
        });
    }



    /**
     * For Search and Filter by group
     */
    useEffect(() => {
        if(medicines == null && medicineTemp.length < 1) {
            return
        }
    
        if (!isEmptyOrSpaces(searchValue)) {
            if (medicineTemp.length === 0) {
                // Save the original list and filter medicines
                setMedicineTemp(medicines);
                setMedicines(
                    medicines.filter(med =>
                        med.name.toLowerCase().includes(searchValue.toLowerCase()) &&
                        (isEmptyOrSpaces(selectedCategory) ? true : String(med.group.id) == selectedCategory)
                    )
                );
            } else {
                // Use the temporary storage for filtering
                setMedicines(
                    medicineTemp.filter(med =>
                        med.name.toLowerCase().includes(searchValue.toLowerCase()) &&
                        (isEmptyOrSpaces(selectedCategory) ? true : String(med.group.id) == selectedCategory)
                    )
                );
            }
        } else {
            if(!isEmptyOrSpaces(selectedCategory)) {
                setMedicines(medicineTemp.filter(med => String(med.group.id) == selectedCategory));
            }
            else {
                setMedicines(medicineTemp);
                setMedicineTemp([]);
            }  
        }
    }, [searchValue]);

    useEffect(() => {
        if(medicines == null && medicineTemp.length < 1) {
            return
        }
    
        if (!isEmptyOrSpaces(selectedCategory)) {
            if (medicineTemp.length === 0) {
                // Save the original list and filter medicines
                setMedicineTemp(medicines);
                setMedicines(
                    medicines.filter(med =>
                        String(med.group.id) == selectedCategory && 
                        (isEmptyOrSpaces(searchValue) ? true : med.name.toLowerCase().includes(searchValue.toLowerCase()))
                    )
                );
            } else {
                // Use the temporary storage for filtering
                setMedicines(
                    medicineTemp.filter(med =>
                        String(med.group.id) == selectedCategory && 
                        (isEmptyOrSpaces(searchValue) ? true : med.name.toLowerCase().includes(searchValue.toLowerCase()))
                    )
                );
            }
        } else {
            if(!isEmptyOrSpaces(searchValue)) {
                setMedicines(medicineTemp.filter(med => med.name.toLowerCase().includes(searchValue.toLowerCase())));
            }
            else {
                setMedicines(medicineTemp);
                setMedicineTemp([]);
            } 
        }
    }, [selectedCategory]);
    


    /**
     * Render
     */
    return(
        <div className="content1-v2 d-flex">
            {medGroups && medicines && discounts
            ? (
                <>
                    {/* Left */}
                    <div className="pos-left-cont">
                        <div className="d-flex mar-bottom-l1">
                            <div className="d-flex position-relative align-items-center">
                                <input 
                                type="text" 
                                className="search-box1 text-m1" 
                                placeholder="Search Medicine Inventory.."
                                onInput={(e) => setSearchValue(e.target.value)}
                                value={searchValue}/>
                                <div className="search-box1-icon"><Icon.Search className="text-l3"/></div>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="text-l3 fw-bold mar-bottom-2">Categories</div>
                        <div className="pos-cat-cont mar-bottom-1">
                            <div 
                            onClick={() => setSelectedCategory("")}
                            className={`pos-cat-box ${selectedCategory === "" ? 'active' : ''}`}>All</div>
                            {medGroups.map(group => (
                                <div 
                                key={group.id} 
                                onClick={() => setSelectedCategory(String(group.id))}
                                className={`pos-cat-box ${selectedCategory === String(group.id) ? 'active' : ''}`}>
                                    {group.group_name}
                                </div>
                            ))}
                        </div>

                        {/* Medicines */}
                        <div className="pos-medicines-cont">
                            {medicines.length < 1 && (
                                <>No Items</>
                            )}
                            {medicines.length > 0 && medicines.map(med => (
                                <div 
                                key={med.id} 
                                className={`position-relative pos-medicine ${selectedMeds.some(selmed => selmed.id === med.id) ? 'active' : ''} ${med.qty < 1 ? 'disabled' : ''}`}
                                onClick={() => handleSelectMed(med)}>
                                    <div className="pos-medicine-pic">
                                        {med.pic
                                        ? (<img src={`/media/medicines/${med.pic}`}/>)
                                        : (<>{med.name[0]}</>)}
                                    </div>
                                    {(med.discountable === 1) && (
                                        <div className="position-absolute bg-green1 color-white1" style={{padding: 5, top: 5, right: 5, borderRadius: 5}}>
                                            Discountable
                                        </div>
                                    )}
                                    <div className="text-m1">{med.name}</div>
                                    <div className="text-m3">{med.group.group_name}</div>
                                    <div className="text-m3">Qty: {med.qty}</div>
                                    <div className="text-m2 mar-top-3">{formatToPhilPeso(med.price)}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right */}
                    <div className="pos-rigth-cont">
                        <div className="text-l1">Order Details</div>

                        <div className="hr-line1-black3 mar-top-3 mar-bottom-3"></div>

                        <div className={`pos-orders-cont d-flex ${selectedMeds.length > 0 ? 'flex-direction-y gap3': 'justify-content-center align-items-center'}`}>
                            {selectedMeds.length > 0
                            ? selectedMeds.map(selectedMed => (
                                <div key={selectedMed.id} className="pos-order-box">
                                    <div className="pos-order-box-x" onClick={() => removeFromSelectedMed(selectedMed.id, selectedMed.qty)}><Icon.XLg/></div>
                                    <div className="pos-order-box-pic">
                                        {selectedMed.pic
                                            ? (<img src={`/media/medicines/${selectedMed.pic}`}/>)
                                            : (<>{selectedMed.name[0]}</>)}
                                    </div>
                                    <div className="pos-order-box-content">
                                        <div className="text-m1 fw-bold">{selectedMed.name}</div>
                                        
                                        <div>{formatToPhilPeso(selectedMed.price * selectedMed.qty)}</div>
                                        <div className="d-flex justify-content-between align-items-center w-100">
                                            <div className="text-m2">
                                                {selectedMed.qty}x
                                            </div>
                                            <div className="d-flex align-items-center gap3">
                                                <Icon.DashLg className="cursor-pointer text-m1" onClick={() => decrementSelectedMed(selectedMed)}/> 
                                                <Icon.PlusLg className="cursor-pointer text-m1" onClick={() => incrementMed(selectedMed)}/>
                                            </div>
                                        </div>
                                    </div>                                    
                                </div>
                            ))
                            : (
                                <div className="text-l3">
                                    No Orders
                                </div>
                            )}
                        </div>

                        <div className="hr-line1-dashed-black3 mar-top-3 mar-bottom-3"></div>

                        {customer !== null && (
                            <div>
                                <div className="text-m1">Customer Information</div>
                                <div className="text-m3">name: {customer.name}</div>
                                <div className="text-m3">ID: {customer.id_number}</div>
                            </div>
                        )}

                        <div className="d-flex justify-content-between text-m1">
                            <div className="color-black2">Sub-total</div>
                            <div className="color-blue2">{formatToPhilPeso(calculateSubTotal())}</div>
                        </div>

                        {selectedDiscounts !== null && (
                            <div>
                                <div className="color-black2 text-m1">Discounts</div>
                                <div className="d-flex justify-content-between text-m3 mar-start-3">
                                    <div className="color-black2">{selectedDiscounts.discount_name}</div>
                                    <div className="color-blue2">
                                        {selectedDiscounts.discount_type === "Amount" ? ` - ${formatToPhilPeso(selectedDiscounts.discount_value)}` : `- ${selectedDiscounts.discount_value}%`}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mar-bottom-3">
                            <div className="text-m1">VAT (+12%)</div>
                            <div className="d-flex justify-content-between text-m3">
                                <div className="color-black2">Vatable</div>
                                <div className="color-blue2">
                                    {formatToPhilPeso(calculateVatable())}
                                </div>
                            </div>

                            <div className="d-flex justify-content-between text-m3">
                                <div className="color-black2">Vat additional</div>
                                <div className="color-blue2">
                                    {formatToPhilPeso(calculateVatable() * .12)}
                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-between text-m1 mar-bottom-3">
                            <div className="color-black2">Total</div>
                            <div className="color-blue2">
                                {formatToPhilPeso(calculateGrandTotal())}
                            </div>
                        </div>

                        <button className="secondary-btn-black1 text-center" onClick={handleAddDiscountClick}>Add Discount {selectedDiscounts !== null ? 1 : ""}</button>
                        {/* <div className="secondary-btn-black1 text-center" onClick={handleAddCustomerInfoClick}>
                            {customer ? 'Edit Customer Information' : 'Add Customer Information'}
                        </div> */}
                        <button 
                        className="primary-btn-dark-blue1 text-center" onClick={handleCheckout}>
                            Check out
                        </button>
                    </div>
                </>
            )
            : (<>Loading...</>)}
        </div>
    );
}