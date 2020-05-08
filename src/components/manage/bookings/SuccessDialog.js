import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialog({trainerid, location, coursename, startDatetime, endDatetime, duration, handleClickOpen, handleClose, open, type}) {
    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>Booking {type}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Course: {coursename}
                    </DialogContentText>
                    <DialogContentText>
                        Trainer: {trainerid}
                    </DialogContentText>
                    <DialogContentText>
                        Location: {location}
                    </DialogContentText>
                    <DialogContentText>
                        From: {String(startDatetime)}
                    </DialogContentText>
                    <DialogContentText>
                        To: {String(endDatetime)}
                    </DialogContentText>
                    <DialogContentText>
                        Duration: {duration} min
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}