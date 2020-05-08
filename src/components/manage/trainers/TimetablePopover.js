import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FiberManualRecord from "@material-ui/core/SvgIcon/SvgIcon";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
    typography: {
        padding: theme.spacing(2),
    },
}));

export default function TimetablePopover({date, listEvents, eventsdata}) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    let displayListEvents = eventsdata.length>0 ? eventsdata.map(event=>{
        // console.log('UFFFFF', new Date(event.startDatetime));
        if (event.startDatetime){
            return ( <div style={{padding:'12px'}} key={Math.random()}>
                    <Typography variant='caption' gutterBottom>{(new Date(event.startDatetime.seconds*1000).getHours())}:00 - {(new Date(event.endDatetime.seconds*1000).getHours())}:00 </Typography>
                    <Typography variant='caption' gutterBottom> {event.coursename}</Typography>
                    <Typography gutterBottom></Typography>
                </div>)}
        else {return <div></div>}
    }) : (<div></div>);


    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div>
            <Paper elevation={1} style={{minHeight:"60px", maxHeight:"120px", padding:"4px"}}>
                <p onClick={handleClick}>{date}</p>
                {listEvents}
            </Paper>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <div>
                <Typography className={classes.typography} gutterBottom>Bookings of the day</Typography>
                {displayListEvents}
                </div>
            </Popover>
        </div>
    );
}