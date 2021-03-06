import React, { useState, useEffect } from "react";

import MaterialTable from "material-table";
import { Modal } from "react-bootstrap";
import moment from 'moment';
import { getAllRequisition } from "../../services/requisitionService"

import PrUpdateModal from "../modals/prUpdate"

import Header from "../../Header";

export default function PrList() {


    const [modalStateUpdate, setModalStateUpdate] = useState(false);
    const [currentProductUpdate, setCurrentProductUpdate] = useState();
    const [prList, setPrList] = useState([]);

    useEffect(() => {
        getAllRequisition().then((res) => {
            console.log("data for tableeeee", res.data.reverse())
            setPrList(res.data.reverse())
        })
    }, [])



    return (
        <div className="page-component-body " >

            <Header></Header>

            <div className="table-emp">

                <div class="row table-head  mt-3 mb-5">
                    <i class="fa fa-check-square fa-o"></i>
                    <div class="col">

                        <h3>Purchase Requisitions</h3>
                    </div>
                    <div className="float-right">
                        <button class="btn btn-ok white">
                            Add Requisition
                        </button>
                    </div>
                </div>
                <table class="table table-hover">
                    <MaterialTable
                        title=""
                        columns={[
                            { title: "Requisition", field: "requisitionid", type: "string" },
                            { title: "Date", field: "requisiondate", type: "string" },
                            { title: "Supplier", field: "suppliername", type: "string" },
                            { title: "Title", field: "title", type: "string" },
                            { title: "Ship to Address", field: "shipto", type: "string" },
                            { title: "Status", field: "status", type: "string" },
                            { title: "Amount", field: "total", type: Number },
                            { title: "Comment", field: "comment", type: "string" },
                        ]}

                        data={prList}
                        options={{
                            sorting: true,
                            actionsColumnIndex: -1,
                            exportButton: true,
                        }}
                        actions={[
                            {
                                icon: () => (
                                    <button class="btn btn-sm btn-warning">view</button>
                                ),
                                onClick: (event, rowData) => {
                                    setCurrentProductUpdate(rowData);
                                    setModalStateUpdate(true);
                                },
                            },
                        ]}
                    />
                </table>
            </div>
            {/* modal for view purchase requisition */}
            <Modal show={modalStateUpdate}
                onHide={() => setModalStateUpdate(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <PrUpdateModal
                    data={currentProductUpdate}
                    onHide={() => setModalStateUpdate(false)}
                />
            </Modal>
        </div >
    );
}