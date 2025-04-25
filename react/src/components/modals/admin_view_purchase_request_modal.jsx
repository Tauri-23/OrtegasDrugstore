import * as Icon from 'react-bootstrap-icons';
import { formatDateTime } from '../../assets/js/utils';
import { Button } from 'antd';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export default function AdminViewPurchaseRequestModal({ purchaseReq, onClose }) {
    const printRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: `PurchaseRequest-${purchaseReq?.id || 'Unknown'}`,
    });

    return (
        <div className="modal1">
            <div className="modal-box2">
                <div className="d-flex gap1 mar-bottom-1 align-items-center position-relative">
                    <div className="circle-btn1 text-l1 position-absolute" onClick={onClose}>
                        <Icon.X />
                    </div>
                </div>

                <div ref={printRef} style={{ background: 'white', padding: 20 }}>
                    <center><h3 className='mar-bottom-1'>Purchase Request</h3></center>

                    <div className="d-flex w-100 gap3">
                        <div className="w-50">
                            <div>Request ID:</div>
                            <div>Requested Date:</div>
                            <div>Request By:</div>
                            <div>Item Name:</div>
                            <div>Quantity:</div>
                        </div>

                        <div className="w-50">
                            <div>{purchaseReq?.id}</div>
                            <div>{formatDateTime(purchaseReq?.created_at)}</div>
                            <div>{purchaseReq?.requested_by?.firstname} {purchaseReq?.requested_by?.lastname}</div>
                            <div>{purchaseReq?.medicine?.name}</div>
                            <div>{purchaseReq?.qty}</div>
                        </div>
                    </div>
                </div>

                <Button type="primary" className="mar-top-1" onClick={handlePrint}>
                    Print This Modal
                </Button>
            </div>
        </div>
    );
}
