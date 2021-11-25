import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useContext } from 'react'
import { GlobalStoreContext } from '../store'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
};

export default function DeleteModal(props) {
    const { store } = useContext(GlobalStoreContext);

    const{open, setOpen, listName} = props;
    const handleClose = () => setOpen(false);

    function handleDelete(event) {
        event.stopPropagation();
        store.deleteMarkedList();
        handleClose();
    }

    return (
        <div id="delete-modal">
            <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                Delete {listName} list?
                </Typography>
                <Button onClick={handleDelete}>Confirm</Button>
                <Button onClick={handleClose}>Cancel</Button>
            </Box>
            </Modal>
        </div>
    );
}