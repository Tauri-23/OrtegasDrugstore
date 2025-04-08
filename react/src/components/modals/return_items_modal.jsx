import { Button, Select } from 'antd';
import { useEffect, useState } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { isEmptyOrSpaces, notify } from '../../assets/js/utils';

export default function ReturnItemsModal({medicines, item, handleReturnPost, onClose}) {
    const [selectedReplacement, setSelectedReplacement] = useState({id: ""});
    const [selectedQty, setSelectedQty] = useState(0);
    const [returnItem, setReturnItem] = useState({
        id: item.id,
        qty: item.qty,
        reason: ""
    });



    /**
     * Handlers
     */
    const handleInput = (e) => {
        setReturnItem({...returnItem, [e.target.name]: e.target.value});
    }


    /**
     * Debugging
     */
    useEffect(() => {
        console.log(selectedReplacement);
    }, [selectedReplacement]);



    /**
     * Render
     */
    return(
        <div className="modal1">
            <div className="modal-box2">
                <div className="d-flex gap1 mar-bottom-1 align-items-center position-relative">
                    <div className="circle-btn1 text-l1 position-absolute" onClick={onClose}>
                        <Icon.X/>
                    </div>
                    <div className="text-l3 fw-bold text-center w-100">Return Item</div>
                </div>

                {/* QTY TO RETURN */}
                <div className='mar-bottom-3'>
                    <label htmlFor="qty">Quantity to return</label>
                    <input 
                    type="number" 
                    className='input1 w-100' 
                    name="qty" 
                    id="qty"
                    max={item.qty}
                    value={returnItem.qty} 
                    onChange={handleInput} />
                </div>

                {/* Reason */}
                <div className='mar-bottom-3'>
                    <label htmlFor="reason">Reason</label>
                    <textarea
                    className='input1 w-100' 
                    name="reason" 
                    id="reason" 
                    value={returnItem.reason} 
                    onChange={handleInput}>

                    </textarea>
                </div>

                {/* Change Medicine */}
                <div className={`d-flex flex-direction-y ${selectedReplacement.id === "" ? "mar-bottom-1" : "mar-bottom-3"}`}>
                    <label htmlFor="repMed">Replacement Medicine</label>
                    <Select
                    className='w-100'
                    size='large'
                    showSearch
                    optionFilterProp="children"  // Filter based on the option text
                    filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                    }
                    options={[
                        {label: "Select replacement", value: ""},
                        ...medicines.map(medicine => ({label: `${medicine.name} (${medicine.qty - selectedQty} pcs)`, value: medicine.id}))
                    ]}
                    value={selectedReplacement.id}
                    onChange={(e) => setSelectedReplacement(e === "" ? {id: ""} : medicines.filter(x => x.id === e)[0])}
                    />
                </div>

                {/* QTY */}
                {selectedReplacement.id !== "" && (
                    <div className="d-flex flex-direction-y mar-bottom-1">
                        <label htmlFor="qty">Quantity</label>
                        <input 
                        type="number" 
                        id="qty" 
                        min={1} 
                        max={selectedReplacement.qty} 
                        className="input1" 
                        value={selectedQty}
                        onChange={(e) => setSelectedQty(e.target.value)}/>
                    </div>
                )}


                <Button
                type='primary'
                size='large'
                className='w-100'
                disabled={isEmptyOrSpaces(returnItem.reason)}
                onClick={() => {handleReturnPost(returnItem); onClose()}}>
                    Return Item
                </Button>
            </div>
        </div>
    )
}