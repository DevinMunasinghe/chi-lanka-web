import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap';
import DatePicker from 'react-datetime';
import { useHistory } from "react-router";
import Swal from 'sweetalert2';
import { createReceiptService } from '../../services/billsService';

import { getOrderItemsforOrder } from "../../services/purchaseOrderItemsService"
import { updatePurchaseOrderStatus, deletePurchaseOrderRecord } from "../../services/purchaseOrderService"
import BillRecModal from './BillRec';

function POrderUpdate(payload) {

    let history = useHistory();

    const [orderData, setOrderData] = useState([])
    const [order, setOrder] = useState("");
    const [orderID, setOrderID] = useState("");
    const [Date, setDate] = useState("");
    const [supplier, setSupplier] = useState("");
    const [POTitle, setPOTitle] = useState("");
    const [status, setStatus] = useState("");
    const [comment, setComment] = useState("");
    const [total, setTotal] = useState("");
    const [ShipAddress, setAddress] = useState("");

    const [itemsList, setItemsList] = useState([])

    const [tableLoading, setTableLoading] = useState(false);

    const [modalStateUpdate, setModalStateUpdate] = useState(false);
    const [currentOrderUpdate, setCurrentOrderUpdate] = useState();




    useEffect(() => {
        try {

            setOrderData(payload.data);
            setStatusBorder(payload.data.status);
            setOrder(payload.data.requisitionname)
            setOrderID(payload.data.orderid)
            setDate(payload.data.orderdate)
            setSupplier(payload.data.suppliername)
            setPOTitle(payload.data.title)
            setComment(payload.data.comment)
            setStatus(payload.data.status)
            setTotal(payload.data.total)
            setAddress(payload.data.shipto)

        } catch (error) {
            console.log(error)
        }

        setItemsListData();
    }, [payload.data])

    useEffect(() => {
        switch (status) {
            case 'Approved':
                document.getElementById('btn-removeReceipt').disabled = false;
                document.getElementById('btn-getReciept').disabled = false;
                document.getElementById("btn-getReciept").style.cursor = "pointer";
                document.getElementById("btn-removeReceipt").style.cursor = "pointer";
                break;
            case 'Pending':
                document.getElementById("btn-getReciept").style.cursor = "not-allowed";
                document.getElementById('btn-getReciept').disabled = true;
                document.getElementById('btn-removeReceipt').disabled = true;
                document.getElementById("btn-removeReceipt").style.cursor = "not-allowed";
                break;
            case 'Declined':
                document.getElementById("btn-getReciept").style.cursor = "not-allowed";
                document.getElementById('btn-getReciept').disabled = true;
                document.getElementById('btn-removeReceipt').disabled = true;
                document.getElementById("btn-removeReceipt").style.cursor = "not-allowed";
                break;

            default:
                break;
        }
    }, [status])

    // if(status)

    //to retrieve data for items list
    const setItemsListData = async () => {
        try {
            await getOrderItemsforOrder(payload.data.orderid).then((response) => {
                console.log("data for table items", response.data);
                setItemsList(response.data)
            })

        } catch (error) { }

    }


    const sendData = (e) => {
        e.preventDefault();

        const newPurchaseOrder = {
            orderid: orderID,
            orderdate: Date,
            suppliername: supplier,
            title: POTitle,
            shipto: ShipAddress,
            status,
            total,
            comment,
        }


        const newReq = {
            orderID: orderID,
            Reason: comment
        }

        updatePurchaseOrderStatus(orderID, newPurchaseOrder, newReq).then((res) => {
            if (res.ok) {

                // window.alert("success!");
                // window.location.reload();
                    Swal.fire({
                        title: "Success! ",
                        text: `${"Update Purchased order status !"}`,
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 2500

                    })

                    history.push("/pOrders")
                    window.location.reload();
                
            }
        })

    }

    //when click remove 

    const removeFromList = () => {
        const newRemoveReq = {
            orderno: orderID,
            receiptdate: Date,
            tax: 10,
            totammount: total,
            shipto: ShipAddress
        }


        createReceiptService(newRemoveReq).then(() => {
           // window.alert("successfully removed!")
            // console.log("successfully removed!")
            Swal.fire({
                title: "Success! ",
                text: `${"Successfully removed!"}`,
                icon: 'success',
                showConfirmButton: true,
                confirmButtonText: "Ok",
                confirmButtonColor: "#1fc191",
                //timer: 2500

            
        }).then((result) => {
            if (result.isConfirmed) {
            deletePurchaseOrderRecord(orderID);           
            window.location.reload();
            history.push("/pOrders")
            }
           
        })
    })
    }

    const setStatusBorder = (event) => {
        switch (event) {
            case 'Approved':
                document.getElementById('btn-approved').style.border = "solid #000000";
                break;
            case 'Pending':
                document.getElementById('btn-pending').style.border = "solid #000000";
                break;
            case 'Declined':
                document.getElementById('btn-declined').style.border = "solid #000000";
                break;

            default:
                break;
        }

    }

    const setBorderOnClick = (event) => {
        setStatus(event);
        console.log("clickedddd on function", event)
        switch (event) {
            case 'Approved':
                document.getElementById('btn-approved').style.border = "solid #000000";
                document.getElementById('btn-declined').style.border = "none";
                document.getElementById('btn-pending').style.border = "none";
                break;
            case 'Pending':
                document.getElementById('btn-approved').style.border = "none";
                document.getElementById('btn-declined').style.border = "none";
                document.getElementById('btn-pending').style.border = "solid #000000";
                break;
            case 'Declined':
                document.getElementById('btn-approved').style.border = "none";
                document.getElementById('btn-declined').style.border = "solid #000000";
                document.getElementById('btn-pending').style.border = "none";
                break;

            default:
                break;
        }
    }

    const openModalRecipet = () => {

        // console.log("request came for modal updateeeeeee", data);
        setCurrentOrderUpdate();
        setModalStateUpdate(true);

    }

    //combine two objects
    const dataForBillModal = Object.assign(itemsList, orderData)



    return (
        <div>
            <Modal.Header closeButton>

            </Modal.Header>
            <Modal.Body className="px-4">
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <form id="addpayload-form" action="post" className="form"
                            onSubmit={sendData}
                        >
                            <div className="row justify-content-end">
                                <div className="form-group col-9 ">
                                    <h3>Purchase Order</h3>
                                </div>
                                <div className="form-group col-3">
                                    <input
                                        required
                                        // value={requisition}
                                        id="requisition"
                                        type="text"
                                        className="form-control "
                                        placeholder="Order No"
                                        value={orderID}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="row justify-content-end">
                                <div className="form-group col-6 col-sm-3 float-right">

                                </div>
                                <div className="form-group col-3">
                                    <input
                                        required
                                        value={Date}
                                        id="requisition"
                                        type="text"
                                        className="form-control "
                                        placeholder="Date"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group col-md-4 ">
                                    <label className="form-label" for="fName">Supplier:</label>
                                </div>
                                <div className="form-group col-md-8 ">
                                    <input
                                        required
                                        value={supplier}
                                        id="requisition"
                                        type="text"
                                        className="form-control "
                                        placeholder="Supplier Name"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group col-md-4">
                                    <label className="form-label-payload " for="gender">PO Title:</label>
                                </div>

                                <div className="form-group col-md-8">
                                    <input
                                        required
                                        id="supplier"
                                        type="text"
                                        className="form-control "
                                        placeholder="Purchase Order Title"
                                        value={POTitle}
                                        disabled
                                    />

                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group col-md-4">
                                    <label className="form-label-payload" for="dob">Ship To :</label>
                                </div>
                                <div className="form-group col-md-8">
                                    <input
                                        required
                                        id="supplier"
                                        type="text"
                                        className="form-control "
                                        placeholder="Shipping Address"
                                        value={ShipAddress}
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="row">

                                <div className="form-group col">



                                    <table class="table table-hover border border-secondary mt-3 ">
                                        <thead class="thead-dark">
                                            <tr>
                                                <th class="text-center">Item Code</th>
                                                <th class="text-center">Item Name</th>
                                                <th class="text-center">Quantity</th>
                                                <th class="text-right"> Unit Price</th>
                                            </tr>

                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td class="text-center">{itemsList.item01}</td>
                                                <td class="text-center">{itemsList.itemName01}</td>
                                                <td class="text-center">{itemsList.qty01}</td>
                                                <td class="text-right">{itemsList.unitPrice01}</td>
                                            </tr>
                                            <tr>
                                                <td class="text-center">{itemsList.item02}</td>
                                                <td class="text-center">{itemsList.itemName02}</td>
                                                <td class="text-center">{itemsList.qty02}</td>
                                                <td class="text-right">{itemsList.unitPrice02}</td>
                                            </tr>
                                            <tr>
                                                <td class="text-center">{itemsList.item03}</td>
                                                <td class="text-center">{itemsList.itemName03}</td>
                                                <td class="text-center">{itemsList.qty03}</td>
                                                <td class="text-right">{itemsList.unitPrice03}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="form-group col-md-8">

                                </div>
                                <div className="col-md-4">
                                    <div className="row">

                                        <div className="col text-right">
                                            <label className="form-label-payload mt-2" for="dob">Total  :</label>

                                        </div>

                                        <div className="col">
                                            <input
                                                required
                                                value={total}
                                                id="requisition"
                                                type="text"
                                                className="form-control "
                                                placeholder="0.00"
                                                disabled
                                            />
                                        </div>


                                    </div>

                                </div>
                            </div>



                            <div className="row mb-3">
                                <div className="col-4">
                                    <div className="form-group">
                                        <label className="form-label-payload" for="dob">Status :</label>
                                    </div>

                                </div>
                                <div className="col">
                                    <button type="button" class="btn btn-success btn-sm btn-block" id="btn-approved" value="Approved"

                                        onClick={(e) => { setBorderOnClick(e.target.value) }}
                                    >Approved</button>

                                </div>
                                <div className="col">
                                    <button type="button" class="btn btn-danger btn-sm btn-block" id="btn-declined" value="Declined"
                                        onClick={(e) => { setBorderOnClick(e.target.value) }}
                                    >Declined</button>
                                </div>
                                <div className="col">
                                    <button type="button" class="btn btn-warning btn-sm btn-block" id="btn-pending" value="Pending"
                                        onClick={(e) => { setBorderOnClick(e.target.value) }}
                                    >Pending</button>
                                </div>
                            </div>


                            <div className="row">
                                <div className="form-group col-md-4">
                                    <label className="form-label" for="CurrAdd">Comment:</label>
                                </div>
                                <div className="form-group col-md-8">
                                    <input
                                        required
                                        id="comment"
                                        type="textarea"
                                        className="form-control "
                                        placeholder="comment"
                                        value={comment}
                                        onChange={(e) => {
                                            setComment(e.target.value);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col py-3 text-center">
                                    <button type="submit" className="btn btn-ok-rec btn-lg btn-block ml-3">
                                        Submit
                                    </button>
                                </div>
                                {/* <div className="col py-3 text-center">
                                    <button  className="btn btn-reset" onClick={() => openModalRecipet()
                                        
                                    }>
                                        Get Reciept
                                    </button>
                                </div> */}




                            </div>
                        </form>

                        <div className="col  text-center ">
                            <button className="btn btn-reset-rec btn-lg btn-block" id="btn-getReciept" onClick={() => openModalRecipet()

                            }>
                                Get Reciept
                            </button>
                        </div>
                        <div className="col  text-center mt-3">
                            <button className="btn btn-danger-rec btn-lg btn-block" id="btn-removeReceipt" onClick={() => removeFromList()

                            }>
                                Remove From List
                            </button>
                        </div>
                    </div>
                </div>

            </Modal.Body >

            <Modal show={modalStateUpdate}
                onHide={() => setModalStateUpdate(false)}
                size="lg"
                aria-labelledby="containeed-modal-title-vcenter"
                centered


            >
                <BillRecModal
                    data={dataForBillModal}
                    onHide={() => setModalStateUpdate(false)}

                />

            </Modal>
        </div >
    )
}

export default POrderUpdate
