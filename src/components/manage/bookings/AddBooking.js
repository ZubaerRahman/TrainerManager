import React from "react";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SuccessDialog from "./SuccessDialog";
import {db} from '../../../firebase/firebase';
import firebase from "firebase";
import {
    MuiPickersUtilsProvider,
    DateTimePicker
} from "@material-ui/pickers";
import moment from "moment";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import {Container} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import MuiAlert from '@material-ui/lab/Alert';


class AddBooking extends React.Component{

    _isMounted=false;

    state={
        startDatetime: Date.now(),
        endDatetime: Date.now(),
        open:false,
        trainerid:'',
        location:'',
        coursename:'',
        formerror:'',
        allcourses:[],
        loading:false,
    };

    componentDidMount() {
        this._isMounted=true;
        if(this._isMounted === true){this.getCourses().then(courses=>{
            courses.forEach(course=>{
                this.setState({
                    allcourses: [...this.state.allcourses, course.name]
                })
            })
        })
        }
        if(this.props.location.state){this.setState({trainerid:this.props.location.state.profileRef})}
    }

    componentWillUnmount() {
        this._isMounted=false;
    }

    async getCourses(){
            const snapshot = await firebase.firestore().collection('courses').get();
            return snapshot.docs.map(doc => doc.data());
    }

    handleChange = (e) => {
        // console.log(e.target.value);
        this.setState({
            [e.target.id]: e.target.value
        })
    };

    handleStartDateChange = datetime => {
        this.setState({ startDatetime: datetime });
        this.setState({ endDatetime: datetime });
        // console.log(this.state.startDatetime)
    };
    handleEndDateChange = datetime =>{
        this.setState({ endDatetime: datetime });
        // console.log(this.state.endDatetime)
    };

    handleCourseChange = (e) => {
        this.setState({
            coursename: e.target.value,
        });
    };


    validateForm(details, trainer){
        let taughtCourses = '';
        taughtCourses += trainer.taughtCourses.map(course=>course+' ');
        if(!trainer.taughtCourses.includes(details.coursename)){this.setState({formerror:`Trainer only teaches: ${taughtCourses}`, loading:false})}
        else if(((details.startDatetime-moment())/60000)<720){this.setState({formerror:"Booking can't be less than 12 hours from now.", loading:false})}
        else if((((details.endDatetime) - (details.startDatetime))/60000)<60){this.setState({formerror:"Booking can't be less than 60 min long", loading:false})}
        else if(details.startDatetime > details.endDatetime){this.setState({formerror:"Booking can't end before it started!", loading:false})}
        else if((((this.state.endDatetime) - (this.state.startDatetime))/60000)>240){this.setState({formerror:"Booking can't be longer than 240 mins!", loading:false})}
        else if(this.state.startDatetime.getHours()<8 || this.state.startDatetime.getHours()>=16){this.setState({formerror:"A booking can only start between 8am and 4pm", loading:false})}
        else {
            this.setState({formerror:'',});
            return true
        }
        }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({loading:true});
        const trainerRef=db.collection('trainers').doc(this.state.trainerid);
        trainerRef.get().then(trainer=>{
            if(trainer.exists){
                    this.setState({formerror:''});
                    const bookingData = {
                        coursename:this.state.coursename,
                        location:this.state.location,
                        trainerid:this.state.trainerid,
                        startDatetime: this.state.startDatetime,
                        endDatetime: this.state.endDatetime,
                    };
                    if (this.validateForm(bookingData, trainer.data())===true) {

                        db.collection('unavailabilities').where('trainerid','==', bookingData.trainerid).get()
                            .then((snapshot)=>{
                                    let allunavailabilities = snapshot.docs.map(doc=>{
                                        // console.log(doc,'DOC');
                                        const unavailability = doc.data();
                                        // console.log(bookingData.startDatetime.getHours())
                                        if(unavailability.weekday === moment(bookingData.startDatetime).format('dddd')){
                                            if (Number(bookingData.startDatetime.getHours()) <= Number(unavailability.start) && Number(bookingData.endDatetime.getHours()) > Number(unavailability.end)){
                                                // console.log('bookingData overlaps unavailability');
                                                return false
                                            }
                                            else if(Number(bookingData.startDatetime.getHours()) >= Number(unavailability.start) && Number(bookingData.startDatetime.getHours()) < Number(unavailability.end)){
                                                // console.log('startDatetime time clash with unav');
                                                return false
                                            }
                                            else if (Number(bookingData.endDatetime.getHours()) > Number(unavailability.start) && Number(bookingData.endDatetime.getHours()) < Number(unavailability.end)){
                                                // console.log('endDatetime time clash with unav');
                                                return false
                                            }
                                            else {
                                                return true
                                            }
                                        } else{
                                            // console.log('Different day, no issue', moment(bookingData.startDatetime).format('dddd'), unavailability.weekday);
                                            return true
                                        }
                                    });
                                    // console.log('ALL', allunavailabilities);
                                    if(allunavailabilities.includes(false)) {
                                        this.setState({formerror:'Trainer not available - clash with unavailability.', loading:false})
                                    }
                                    else {
                                        //ALL  UNAVAILABILITIES CHECKED, NOW CHECK AGAINST CURRENT BOOKINGS
                                        // console.log('TRAINER AVAILABLE HAHAAHAH')

                                        db.collection('timetables').doc(trainer.data().timetable).get().then(timetable => {
                                            const data = timetable.data();

                                            Promise.all(
                                                data.bookings.map(
                                                    bookingid => db.collection('bookings').doc(bookingid).get().then(bookingRef => {
                                                        //check
                                                        const booking = bookingRef.data();
                                                        // console.log(booking);
                                                        //overlapping check
                                                        if (booking.startDatetime.toDate() >= bookingData.startDatetime &&
                                                            booking.endDatetime.toDate() <= bookingData.endDatetime) {
                                                            // console.log('SLOT UNAVAILABLE, overlaps outside') CLEAR;
                                                            return false

                                                        } else if (
                                                            booking.startDatetime.toDate() < bookingData.startDatetime &&
                                                            booking.endDatetime.toDate() > bookingData.startDatetime) {
                                                             //console.log('COMPARE start1', booking.startDatetime.toDate(), bookingData.startDatetime)
                                                             //console.log('COMPARE end2', booking.endDatetime.toDate(), bookingData.startDatetime)
                                                             //console.log('SLOT UNAVAILABLE, overlaps inside');
                                                            return false

                                                        } else if (booking.startDatetime.toDate() < bookingData.endDatetime &&
                                                            booking.endDatetime.toDate() > bookingData.endDatetime) {
                                                             //console.log('SLOT UNAVAILABLE, overlaps inside on second check');
                                                            return false
                                                        } else {
                                                            // console.log('SLOT AVAILABLE second');
                                                            // console.log('START TIMES', booking.startDatetime.toDate(), bookingData.startDatetime)
                                                            // console.log('END TIMES', booking.endDatetime.toDate(), bookingData.endDatetime)
                                                            return true
                                                        }
                                                        //endcheck
                                                    })
                                                )
                                            ).then(results => {
                                                // this will wait for all the db calls to complete.
                                                // and you get all the booleans in the results array.
                                                const isAvailable = !results.includes(false);
                                                //console.log(results, isAvailable);
                                                if (isAvailable) {
                                                    this.setState({formerror: ''});
                                                    //ADD TOO BOOKINGS DOCUMENT
                                                    db.collection('bookings').add({
                                                        ...bookingData
                                                    }).then((booking)=>{
                                                        // console.log('Success! Booking completed.', booking.id);
                                                        //add booking to timetable
                                                        db.collection('timetables').doc(trainer.data().timetable).update({
                                                            bookings: firebase.firestore.FieldValue.arrayUnion(booking.id)
                                                        }).catch(err=>console.log(err));
                                                        //open success popup
                                                        this.setState({loading:false});
                                                        this.handleClickOpen();
                                                    }).catch(err=>{console.log(err)});
                                                } else {
                                                    this.setState({formerror: 'Trainer not available.', loading: false})
                                                }
                                            });
                                        });
                                    }
                            })
                            .catch(err=>console.log('Error fetching unavailabilities.', err));

                    }
            }else {
                // console.log("Trainer doesn't exist");
                this.setState({formerror:"Trainer not found!", loading:false});
            }
        });
        // console.log("Submitted!");
        // console.log(e.target.value);
    };


    handleClickOpen = () => {
        if(this._isMounted){
            this.setState({open:true});
        }
    };

    handleClose = () => {
        if(this._isMounted===true){
            this.setState({open:false});
            this.props.history.push('/bookings');
        }
    };

    useStyles = makeStyles(theme => ({
        root: {
            '& > *': {
                margin: theme.spacing(2),
                width: 300,
                justifyContent:'center',
            },
        },
        buttons:{
            width:200,
        },
        dates:{
            width: 300,
        }
    }));

    render() {
    let courseMenuItems = this.state.allcourses.map(course=>{
        return (<MenuItem key={Math.random()} value={course}>{course}</MenuItem>);
    });
        // const classes = this.useStyles();
    return (
        <Container>
         <Typography variant='h6' gutterBottom>Add Booking</Typography>
        <form  onSubmit={this.handleSubmit} style={{margin: 'auto', width: 260, justifyContent:'center',}}>
            <Grid container direction="column" justify="center" >
                <br/>
                <br/>
                <FormControl error={this.state.hasError} required>
                    <InputLabel id="duration-label">Course</InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id="coursename"
                        value={this.state.coursename}
                        onChange={this.handleCourseChange}
                    >
                        {courseMenuItems}
                    </Select>
                    <FormHelperText>Select from existing courses</FormHelperText>
                    {this.state.hasError && <FormHelperText>This is required!</FormHelperText>}
                </FormControl>

            <br/>
            <TextField
                id="trainerid"
                placeholder="Enter Trainer Id"
                label="Trainer ID"
                onChange={this.handleChange}
                required={true}
                value={this.state.trainerid}
            />
            <br/>
            <TextField
                id="location"
                placeholder="Enter Location"
                label="Location"
                onChange={this.handleChange}
                required={true}
            />
            </Grid>
            <br/>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container direction="row" justify="center" >
                    <DateTimePicker
                        value={this.state.startDatetime}
                        label="Start time"
                        variant="inline"
                        onChange={this.handleStartDateChange}
                        margin="normal"
                    />
                    <br/>
                    <br/>
                    <br/>
                    <DateTimePicker
                        value={this.state.endDatetime}
                        label="End time"
                        variant="inline"
                        onChange={this.handleEndDateChange}
                        margin="normal"
                    />
                </Grid>
            </MuiPickersUtilsProvider>
            <br/>

            <Grid container justify="center" alignContent='center' direction='column'>
                {this.state.loading ? <CircularProgress></CircularProgress> :
                    <Button
                    type="submit"
                    color="primary"
                    variant="text"
                >CREATE</Button>}
                <br/>
            </Grid>
            <Grid container direction='row' justify='center'>
                {this.state.formerror && <MuiAlert variant='filled' severity="error">{this.state.formerror}</MuiAlert>}
            </Grid>


        </form>

        <SuccessDialog coursename={this.state.coursename}
        trainerid={this.state.trainerid}
        location={this.state.location}
        startDatetime={this.state.startDatetime}
        endDatetime={this.state.endDatetime}
        duration={(((this.state.endDatetime) - (this.state.startDatetime))/60000)}
        handleClickOpen={this.handleClickOpen}
        handleClose={this.handleClose}
        open={this.state.open}
        values={this.state.values}
        type={'Created'}
        />
     </Container>
    );
    }
}
export default AddBooking;
