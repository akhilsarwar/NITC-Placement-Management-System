import React, { forwardRef, useImperativeHandle} from "react";
import { Modal, Button } from "react-bootstrap";
import { useState } from "react";

function ConfirmationDialog(props, ref) {

    const openDialog = function (){
        setShow(true);
    }

    const closeDialog = function (){
        setShow(false);
    }

    useImperativeHandle(ref, () => ({
        openDialog: openDialog,
        closeDialog: closeDialog
    }));

    const title = props.title;
    const dialogBody = props.dialogBody
    const onModalConfirm = props.onModalConfirm;
    const [show, setShow] = useState(false);
    

    return (
        <Modal show={show} onHide={closeDialog} dialogClassName="modal-width">
                        <Modal.Header closeButton>
                        <Modal.Title>Change Placement Status</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {dialogBody}
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant='primary' onClick={onModalConfirm}>Confirm</Button>
                        <Button variant="secondary" onClick={closeDialog}>
                            Close
                        </Button>
                        </Modal.Footer>
                </Modal>        
    );
}




ConfirmationDialog = forwardRef(ConfirmationDialog)
export default ConfirmationDialog