import { React, useState, useEffect } from 'react'

import MaterialTable from "material-table";
import HeaderForReq from "./headerForReq"
import { Modal } from "react-bootstrap";

import { getAllDrafts } from '../../services/draftsService';

import  DraftModal  from "./draftViewModal";

function RequisitionDraftList() {

    const [draftsList, setDraftsList] = useState([]);

    const [modalStateUpdate, setModalStateUpdate] = useState(false);
    const [currentOrderUpdate, setCurrentOrderUpdate] = useState();

    useEffect(() => {
        getAllDrafts().then((res) => {
            console.log("data for tableeeee", res.data)
            setDraftsList(res.data.reverse())
        })
    }, [])

    return (
        <div className="component-body">
            <HeaderForReq></HeaderForReq>
            <div className="table-emp">

                <div class="row table-head  mt-3 mb-5">
                    <i class="fa fa-check-square fa-o"></i>
                    <div class="col">

                        <h3>Drafts</h3>
                    </div>

                    
                    <a href="/placeAnOrder" className="float-right">
                        <button className="btn btn-ok white">
                            + Purchase Order
                        </button>
                    </a>
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

                        data={draftsList}
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
                                    setCurrentOrderUpdate(rowData);
                                    // console.log("modal dataaa",rawdata);
                                    setModalStateUpdate(true);
                                },
                            },
                        ]}
                    />
                </table>
            </div>
            <Modal show={modalStateUpdate}
                onHide={() => setModalStateUpdate(false)}
                size="lg"
                aria-labelledby="containeed-modal-title-vcenter"
                centered


            >
                <DraftModal
                    data={currentOrderUpdate}
                    onHide={() => setModalStateUpdate(false)}

                />

            </Modal>


        </div>
    )
}

export default RequisitionDraftList