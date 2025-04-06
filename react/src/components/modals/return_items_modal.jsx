import { Button } from 'antd';
import { useState } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { isEmptyOrSpaces, notify } from '../../assets/js/utils';

export default function ReturnItemsModal({item, handleReturnPost, onClose}) {
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
                <div className='mar-bottom-1'>
                    <label htmlFor="reason">Reason</label>
                    <textarea
                    className='input1 w-100' 
                    name="reason" 
                    id="reason" 
                    value={returnItem.reason} 
                    onChange={handleInput}>

                    </textarea>
                </div>

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