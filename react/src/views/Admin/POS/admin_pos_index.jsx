import { useCallback, useEffect, useState } from "react";
import * as Icon from 'react-bootstrap-icons';
import "../../../assets/css/pos.css";
import { fetchAllMedGroups } from "../../../Services/GeneralMedicineGroupService";
import { fetchAllMedicinesFull } from "../../../Services/GeneralMedicineService";
import { formatToPhilPeso, isEmptyOrSpaces } from "../../../assets/js/utils";
import { fetchAllDiscounts } from "../../../Services/GeneralDiscountService";
import { useModal } from "../../../Context/ModalContext";

export default function AdminPOSIndex() {
    const {showModal} = useModal();

    const [medGroups, setMedGroups] = useState(null);
    const [medicines, setMedicines] = useState(null);
    const [discounts, setDiscounts] = useState(null);
    const [cash, setCash] = useState(0);

    const [selectedCategory, setSelectedCategory] = useState("");

    const [selectedMeds, setSelectedMeds] = useState([]);
    const [selectedDiscounts, setSelectedDiscounts] = useState([]);

    const [customer, setCustomer] = useState(null);



    /**
     * Get All
     */
    useEffect(() => {
        const getAll = async() => {
            const [medGpDb, medsDb, discountsDb] = await Promise.all([
                fetchAllMedGroups(),
                fetchAllMedicinesFull(),
                fetchAllDiscounts()
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
                    : [...prev, { id: medicine.id, name: medicine.name, qty: 1, price: medicine.price }] // Add new medicine with qty 1
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

    const calculateGrandTotal = useCallback(() => {
        let total = calculateSubTotal();
        selectedDiscounts.forEach(seldis => {
            seldis.discount_type === "Amount"
                ? total = total - seldis.discount_value
                : total = (total - (seldis.discount_value * total / 100))
        });
        return total;
    }, [selectedMeds, selectedDiscounts]);



    /**
     * Discounts Handler
     */
    const handleAddDiscountClick = () => {
        showModal('AdminApplyDiscountModal1', {discounts, selectedDiscounts, setSelectedDiscounts});
    }



    /**
     * Customer Info Handler
     */
    const handleAddCustomerInfoClick = () => {
        showModal('AdminAddCustomerInfoModal1', {
            customer, setCustomer
        });
    }



    /**
     * Receipt Handler
     */
    const handleCheckout = () => {
        showModal('AdminPayCashModal1', {cash, setCash, amountDue: calculateGrandTotal()});
        // const data = {
        //     meds: selectedMeds,
        //     subtotal: calculateSubTotal(),
        //     selectedDiscounts: selectedDiscounts,
        //     total: calculateGrandTotal()
        // }
        // showModal('AdminViewReceiptModal1', {data});
    }



    /**
     * Render
     */
    return(
        <div className="content1 d-flex">
            {medGroups && medicines && discounts
            ? (
                <>
                    {/* Left */}
                    <div className="pos-left-cont">
                        <div className="d-flex mar-bottom-l1">
                            <div className="d-flex position-relative align-items-center">
                                <input type="text" className="search-box1 text-m1" placeholder="Search Medicine Inventory.."/>
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
                                onClick={() => setSelectedCategory(group.id)}
                                className={`pos-cat-box ${selectedCategory === group.id ? 'active' : ''}`}>
                                    {group.group_name}
                                </div>
                            ))}
                        </div>

                        {/* Medicines */}
                        <div className="pos-medicines-cont">
                            {medicines.map(med => (
                                <div 
                                key={med.id} 
                                className={`pos-medicine ${selectedMeds.some(selmed => selmed.id === med.id) ? 'active' : ''} ${med.qty < 1 ? 'disabled' : ''}`}
                                onClick={() => handleSelectMed(med)}>
                                    <div className="pos-medicine-pic">
                                    </div>
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

                        {selectedDiscounts.length > 0 && (
                            <div className="d-flex justify-content-between text-m1">
                                <div className="color-black2">Sub-total</div>
                                <div className="color-blue2">{formatToPhilPeso(calculateSubTotal())}</div>
                            </div>
                        )}

                        {selectedDiscounts.length > 0 && (
                            <div>
                                <div className="color-black2 text-m1">Discounts</div>
                                {selectedDiscounts.map(seldis => (
                                    <div key={seldis.id} className="d-flex justify-content-between text-m3 mar-start-3">
                                        <div className="color-black2">{seldis.discount_name}</div>
                                        <div className="color-blue2">
                                            {seldis.discount_type === "Amount" ? ` - ${formatToPhilPeso(seldis.discount_value)}` : `- ${seldis.discount_value}%`}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="d-flex justify-content-between text-m1 mar-bottom-3">
                            <div className="color-black2">Total</div>
                            <div className="color-blue2">
                                {formatToPhilPeso(calculateGrandTotal())}
                            </div>
                        </div>

                        <div className="secondary-btn-black1 text-center" onClick={handleAddDiscountClick}>Add Discount {selectedDiscounts.length > 0 && selectedDiscounts.length}</div>
                        <div className="secondary-btn-black1 text-center" onClick={handleAddCustomerInfoClick}>
                            {customer ? 'Edit Customer Information' : 'Add Customer Information'}
                        </div>
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