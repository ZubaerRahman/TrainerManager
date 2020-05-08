import React from "react";
import {db} from "../../../firebase/firebase";
import firebase from 'firebase';
import { connect } from "react-redux";
import {Link} from 'react-router-dom';
import UnavailablePopover from "./UnavailablePopover";
import moment from "moment";

//UI COMPONENTS
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import DateRangeIcon from '@material-ui/icons/DateRange';
import ScheduleIcon from '@material-ui/icons/Schedule';
import {IconButton} from "@material-ui/core";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import Hidden from "@material-ui/core/Hidden";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from "@material-ui/core/Snackbar";
import Tooltip from "@material-ui/core/Tooltip";
import Zoom from "@material-ui/core/Zoom";


class Trainer extends React.Component{
    state = {
        details:'',
        bookings: [],
        timetable: {},
        unavailabilities: [],
        loadingBookings: false,
        loadingUnavailabilities: false,
        snackbaropen:false,
        snackbarmessage:'',
    };
    componentDidMount() {
        // console.log(this.props, 'PROFILE');
        if(!this.props.location.state){
            this.props.history.push('/trainers')
        }
        else {
            this.setState({
                details: this.props.location.state.details,
                loadingBookings: true,
                loadingUnavailabilities: true,
            });
            db.collection('timetables').doc(this.props.location.state.details.timetable).get().then(timetable => {
                // !timetable.exists ? console.log('Timetable not found.') : this.setState({events:timetable.data().events});
                if (timetable.exists) {
                    // console.log(timetable.data());
                    if (timetable.data().bookings.length < 1) {
                        this.setState({
                            loadingBookings: false,
                            bookings: [],
                        })
                    } else {
                        timetable.data().bookings.forEach((bookingid) => {
                            db.collection('bookings').doc(bookingid).get().then((bookingref) => {
                                // console.log(bookingref.data());
                                const booking = bookingref.data();
                                // console.log(booking.bookingData.endDatetime.toDate(), 'AHAH')
                                booking.date = booking.endDatetime.toDate();
                                booking.id = bookingref.id;
                                this.setState({
                                    bookings: [
                                        ...this.state.bookings,
                                        booking,
                                    ],
                                    loadingBookings: false,
                                })
                            })
                        });
                    }
                } else {
                    // console.log('Timetable not found.');
                }
            }).catch(err => console.log(err));

            //get unavailabilities
            // console.log(this.props.location);
            db.collection('unavailabilities').where('trainerid', '==', this.props.location.state.details.id).onSnapshot(snapshot => {
                let unavailabilities = snapshot.docs.map(doc => {
                    const unavailability = doc.data();
                    return {
                        id: doc.id,
                        weekday: unavailability.weekday,
                        start: unavailability.start,
                        end: unavailability.end,
                    }
                });
                this.setState({
                    unavailabilities: unavailabilities,
                    loadingUnavailabilities: false,
                })
            })
        }
    }

    handleDelete (id){
        db.collection('trainers').doc(id).get().then(trainerref=>{
            const trainer = trainerref.data();
            db.collection('timetables').doc(trainer.timetable).get().then(timetableref=>{
                const timetable = timetableref.data();

                Promise.all(
                    timetable.bookings.map(booking=>
                        db.collection('bookings').doc(booking).delete().then(()=>{
                            // console.log('Booking deleted from Bookings doc');
                        }).catch(err=>console.log(err))
                    )
                ).then(()=>{
                    db.collection('timetables').doc(trainer.timetable).delete().then(()=>{
                        // console.log('Timetable deleted!');
                        db.collection('trainers').doc(id).delete().then(()=>{
                            // console.log('Trainer finally deleted!');
                            this.props.history.push({pathname:'/trainers'});
                        }).catch(err=>console.log(err));
                    }).catch(err=>console.log(err));
                })
            })
        })
    }

    handleUnavailabilityDelete (id) {
        db.collection('unavailabilities').doc(id).delete()
            .then(()=>{
                // console.log('Success! Unavailability deleted.');
                this.handleSnackbarOpen('Unavailability removed')
            })
            .catch(err=>console.log(err));
    }

    handleBookingEdit = (booking) => {
        this.props.history.push({pathname:'/bookings/'+booking.id+'/edit-booking', state:{booking:booking}})
    };

    handleBookingDelete (id, trainerid, completed) {
        db.collection('trainers').doc(trainerid).get().then(trainerref=>{
            const timetable = trainerref.data().timetable;
            db.collection('timetables').doc(timetable).update({
                bookings: firebase.firestore.FieldValue.arrayRemove(id)
            }).then(()=>{
                // console.log('Booking deleted from timetable');
                db.collection('bookings').doc(id).delete().then(()=>{
                    // console.log('Booking deleted from bookings document.')
                }).catch(err=>console.log(err));
                this.setState({
                    bookings: this.state.bookings.filter(booking=>{return booking.id !== id})
                });
                completed ? this.handleSnackbarOpen('Booking completed') : this.handleSnackbarOpen ('Booking deleted');
            }).catch(err=>console.log(err));
        });
    }

    handleSnackbarOpen = (message) =>{
        this.setState({snackbaropen:true, snackbarmessage:message});
    };
    handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({snackbaropen:false, snackbarmessage:''});
    };

    editTrainer(){
        this.props.history.push({pathname: '/trainers/'+this.state.details.id+'/edit-trainer', state:{details:this.state.details}});
    }

    showTimetable(timetableid) {
        this.props.history.push({pathname: '/trainers/'+this.state.details.id+'/timetable', state:{bookings:this.state.bookings},});
    }

    render() {
        // console.log('TRAINER PAGE PROPS, ',this.props);
        // console.log('TRAINER PAGE STATE, ',this.state);
        const details = this.state.details;

        //taught courses
        let taughtCourses = details.taughtCourses? (details.taughtCourses.map(taughtCourse=>{
           return (
               <div key={Math.random()}>
                   <Typography variant='caption'>
                       <FiberManualRecordIcon color='primary' style={{fontSize:'8px', marginRight:'4px'}}>{}</FiberManualRecordIcon>
                       {taughtCourse}
                   </Typography>
               </div>
           )
        }) ) : (<div></div>);

        //bookings
        let listBookings = this.state.bookings.length > 0 ? this.state.bookings.map((booking)=>{
            // console.log('BOOOO', booking);
            return  <div key={Math.random()}>
                <FiberManualRecordIcon color='primary' style={{fontSize:'8px', marginRight:'4px'}}></FiberManualRecordIcon>
                <Typography variant='caption'>{moment(new Date(booking.startDatetime.seconds*1000)).format("MMM Do YY")} </Typography>
                <Typography variant='caption'>
                    {(new Date(booking.startDatetime.seconds*1000).getHours())}:00 - {(new Date(booking.endDatetime.seconds*1000).getHours())}:00
                </Typography>
                <Typography variant='caption' gutterBottom style={{fontWeight:'bold'}}> {booking.location} </Typography>
                <Tooltip title='Edit' TransitionComponent={Zoom}><IconButton onClick={()=>{this.handleBookingEdit(booking)}} style={{color:'#00a3cc', fontSize:'8px'}}><EditIcon style={{fontSize:'14px'}}/></IconButton></Tooltip>
                <Tooltip title='Mark as completed' TransitionComponent={Zoom}><IconButton onClick={()=>{this.handleBookingDelete(booking.id, booking.trainerid, true)}} style={{color:'forestgreen', fontSize:'8px'}}><AssignmentTurnedInIcon style={{fontSize:'14px'}}/></IconButton></Tooltip>
                <Tooltip title='Delete' TransitionComponent={Zoom}><IconButton onClick={()=>{this.handleBookingDelete(booking.id, booking.trainerid)}} style={{color:'red', fontSize:'8px'}}><DeleteIcon style={{fontSize:'14px'}}/></IconButton></Tooltip>
            </div>
        }) : !this.state.loadingBookings ?
            (<Typography variant='subtitle2' color='primary'>No bookings yet</Typography>) : (<div></div>);

        //unavailabilities
        let unavailabilities = this.state.unavailabilities.map(unavailability=>{
           return (
               <div key={Math.random()}>
               <Typography variant='caption'>
                   <FiberManualRecordIcon color='primary' style={{fontSize:'8px', marginRight:'4px'}}>{}</FiberManualRecordIcon>
                   {unavailability.weekday}, {unavailability.start}:00 - {unavailability.end}:00
                   <span> </span><Tooltip title='Delete unavailability' TransitionComponent={Zoom}><IconButton onClick={()=>{this.handleUnavailabilityDelete(unavailability.id)}}><DeleteIcon color='secondary' style={{fontSize:'14px'}}>{}</DeleteIcon></IconButton></Tooltip>
               </Typography>
               </div>
           );
        });

        //main body
        return (
            <div>
                <Container component={Paper} style={{padding:'40px'}}>
                <Typography variant='h5' style={{marginBottom:'14px'}}>{details.fname}'s profile</Typography>
                <Divider/>
                <br/>
                <br/>
                <Grid container direction='row' justify='space-between'>
                    <Grid item style={{margin:'6px'}}>
                    <Typography variant='subtitle1' style={{fontWeight:'bold', marginBottom:'8px'}} gutterBottom>Details</Typography>
                    <Typography variant='subtitle2' gutterBottom>Full name: {details.lname}, {details.fname}</Typography>
                    <Typography variant='subtitle2' gutterBottom>Email: {details.email}</Typography>
                    <Typography variant='subtitle2' gutterBottom>Employee ID: {details.id}</Typography>
                    <Typography variant='subtitle2' gutterBottom>Date of birth: {details.dob? moment(details.dob).format('MMM Do YYYY'):''}</Typography>
                    <br/>
                            <Button  variant="contained" style={{backgroundColor:'#00a3cc',color:'white'}} size='small'
                                     startIcon={<ScheduleIcon/>}
                                     component={Link} to={{pathname:'/bookings/add-booking', state:{profileRef:details.id}}}  disableElevation>
                                Add Booking
                            </Button>
                            <br/>
                            <br/>
                            <Button
                                variant="contained"
                                color='primary'
                                startIcon={<DateRangeIcon />}
                                onClick={()=>{this.showTimetable()}}
                                disableElevation
                                size='small'
                            >
                                View Timetable
                            </Button>
                            <br/>
                            <br/>
                            <Button
                                variant="contained"
                                style={{backgroundColor:'forestgreen', color:'white'}}
                                startIcon={<EditIcon />}
                                onClick={()=>{this.editTrainer()}}
                                disableElevation
                                size='small'
                            >
                                Edit Details
                            </Button>
                            <br/>
                            <br/>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<DeleteIcon />}
                                onClick={()=>{this.handleDelete(this.props.location.state.details.id)}}
                                disableElevation
                                size='small'
                            >
                                Delete Trainer
                            </Button>
                        <br/>
                        <br/>
                        <br/>
                    </Grid>

                    <Hidden xsDown><Divider orientation='vertical' flexItem/></Hidden>

                    <Grid item style={{margin:'6px'}}>
                        <Typography variant='subtitle1' style={{fontWeight:'bold'}} gutterBottom>Taught courses</Typography>
                        {taughtCourses.length>0 ? taughtCourses :
                            this.state.loadingBookings ? <div><br/><CircularProgress color='primary'/></div> :
                                <Typography variant='subtitle2' color='primary'>No taught courses</Typography>}
                        <br/>
                        <br/>

                    </Grid>

                    <Hidden smDown><Divider orientation='vertical' flexItem/></Hidden>

                    <Grid item style={{margin:'6px'}}>
                        <Typography variant='subtitle1' style={{fontWeight:'bold'}}>Current bookings</Typography>
                        {listBookings.length>0 ? listBookings :
                            this.state.loadingBookings ? <div><br/><CircularProgress color='primary'/></div> :
                            <Typography variant='subtitle2' color='primary'>No bookings yet</Typography>}
                        <br/>
                        <br/>

                    </Grid>

                    <Hidden mdDown><Divider orientation='vertical' flexItem/></Hidden>

                    <Grid item style={{margin:'6px'}}>
                        <Typography variant='subtitle1' style={{fontWeight:'bold'}}>Current unavailability</Typography>
                        {unavailabilities.length>0 ? unavailabilities :
                            this.state.loadingUnavailabilities ? <div><br/><CircularProgress color='secondary'/></div> :
                            <Typography variant='subtitle2' color='primary'>No unavailabilities yet</Typography>}
                        <br/>
                        <br/>
                        <UnavailablePopover trainerid={details.id} handleSnackbarOpen={this.handleSnackbarOpen}/>
                    </Grid>

                </Grid>
                </Container>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={this.state.snackbaropen}
                    autoHideDuration={1000}
                    onClose={this.handleClose}
                    message={this.state.snackbarmessage}
                    action={
                        <React.Fragment>
                            <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleSnackbarClose}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </React.Fragment>
                    }
                />
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        creatingTrainer: state.trainers.creatingTrainer,
        currentTrainer: state.trainers.currentTrainer,
        isAuthenticated: state.auth.isAuthenticated,
    };
}


export default connect(mapStateToProps)(Trainer);