import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import moment from "moment";
import Hidden from "@material-ui/core/Hidden";
import {Link} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '66%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
}));

export default function BookingExpansionPanel({booking, handleDelete, history}) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleEdit = (booking) => {
        history.push({pathname:'/bookings/'+booking.id+'/edit-booking', state:{booking:booking}})
    };

    return (
            <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleChange('panel1')} className={classes.root}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography variant='subtitle2'>{moment(booking.startDatetime.toDate()).format('LL')}</Typography>
                    <Hidden xsDown>
                        <Divider flexItem orientation='vertical' style={{marginRight:'8px', marginLeft:'8px'}}/>
                        <Typography variant='subtitle2'>{booking.trainerid} </Typography>
                    </Hidden>
                    <Hidden smDown>
                        <Divider flexItem orientation='vertical' style={{marginRight:'8px', marginLeft:'8px'}}/>
                        <Typography variant='subtitle2'> {booking.coursename}</Typography>
                    </Hidden>



                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <div>
                    <Typography variant='subtitle2' gutterBottom>Starts: {moment(booking.startDatetime.toDate()).format('MMMM Do YYYY, h:mm a')}</Typography>
                    <Typography variant='subtitle2' gutterBottom>Ends: {moment(booking.endDatetime.toDate()).format('MMMM Do YYYY, h:mm a')}</Typography>
                    <Typography variant='subtitle2' gutterBottom>Location: {booking.location}</Typography>
                    <Hidden smUp><Typography variant='subtitle2' gutterBottom>Trainer: {booking.trainerid}</Typography></Hidden>
                    </div>
                </ExpansionPanelDetails>
                <Divider />
                <ExpansionPanelActions>
                    <Button size="small" color="primary" onClick={()=>handleEdit(booking)}>
                        Edit
                    </Button>
                    <Button size="small" color="secondary" onClick={()=>handleDelete(booking.id, booking.trainerid)}>
                        Delete
                    </Button>
                </ExpansionPanelActions>
            </ExpansionPanel>
    );
}