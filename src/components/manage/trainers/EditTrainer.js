import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { withStyles } from "@material-ui/styles";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation';
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import MuiAlert from '@material-ui/lab/Alert';
import Grid from "@material-ui/core/Grid";
import {db} from "../../../firebase/firebase";

import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import SelectTrainerCourse from "./SelectTrainerCourse";
import moment from "moment";

const styles = () => ({
    "@global": {
        body: {
            backgroundColor: "#fff"
        }
    },
    paper: {
        marginTop: 20,
        marginBottom: 20,
        width:'320px',
        display: "flex",
        padding: 20,
        flexDirection: "column",
        alignItems: "center"
    },
    avatar: {
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: '10px',
        backgroundColor: "#f50057",
    },
    form: {
        marginTop: 1
    },
    errorText: {
        color: "#f50057",
        marginBottom: 5,
        textAlign: "center"
    }
});

class EditTrainer extends Component {
    state = {
        fname: '',
        lname: '',
        email: '',
        dob: '',
        formError: '',
        taughtCourses: [],
        allCourses: [],
    };

    componentDidMount() {
        const details = this.props.location.state.details;
        this.setState({...details});
        db.collection('courses').onSnapshot(snapshot=> {
            let courses = snapshot.docs.map(course => {
                return course.data().name
            });
            this.setState({allCourses: courses})
        });
    }

    handleChange = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    };

    handleDobChange = datetime => {
        this.setState({ dob: datetime });
    };

    handleSelect = event => {
        this.setState({taughtCourses:event.target.value});
    };

    handleSubmit = (e) => {
        e.preventDefault();
        // console.log(e.target);
        // const { dispatch } = this.props;
        const details = this.state;
        const {fname, lname, email, dob, taughtCourses} = details;
        if(fname.length === 0 || lname.length === 0 || email.length === 0 ){this.setState({formError:'Name is too short'})}
        else if (fname.length < 2 || lname.length < 2) { this.setState({ formError: 'Name is too short' }) }
        else if (this.validateSpecial(fname)) { this.setState({ formError: "First name can't contain special characters" }); }
        else if (this.validateSpecial(lname)) { this.setState({ formError: "Last name can't contain special characters" }); }
        else if(!this.validateEmail(this.state.email)){this.setState({formError:'Invalid email'})}
        else if(taughtCourses.length<1){this.setState({formError:'You must select at least one taught course'})}
        else if(moment().diff(dob, 'years')<18){
            // console.log(moment().diff(dob, 'years'));
            this.setState({formError:'Trainer must be over 18 years old'})}
        else {
            const trainerRef = db.collection('trainers').doc(this.state.id);
            trainerRef.get().then(trainer => {
                if (!trainer.exists) {
                    // console.log("Trainer doesn't exist!")
                } else {
                    const newdetails = {
                        fname: details.fname,
                        lname: details.lname,
                        dob: details.dob.toString(),
                        email: details.email,
                        taughtCourses: this.state.taughtCourses,
                    };
                    trainerRef.update({
                        ...newdetails,
                    })
                        .then(() => {
                            // console.log("Edited trainer, ", trainer);
                            this.props.history.push({pathname:'/trainers/'+trainer.id, state:{details:{timetable:trainer.data().timetable, id:trainer.id,...newdetails,}}});
                        })
                        .catch(err => {
                            console.log("Error updating trainer.",err)
                        });
                }
            });
        }
    };

    validateEmail(email)
    {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.toLowerCase()))
        {
            return (true)
        }
        // console.log("You have entered an invalid email address!");
        return (false)
    }

    validateSpecial(string) {
        let format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        return format.test(string);
    }

    render() {
        // console.log("EDIT TRAINER STATE ", this.state);
        // console.log("TRAINER PROPS ", this.props);
        const { classes, isAuthenticated } = this.props;
        // if (!isAuthenticated) {
        //     return <Redirect to="/" />;
        // } else {
        return (
            <Grid container direction='row' justify='center'>
                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <TransferWithinAStationIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Edit Trainer
                    </Typography>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="fname"
                        label="First name"
                        name="fname"
                        onChange={this.handleChange}
                        value={this.state.fname}
                    />

                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="lname"
                        label="Last name"
                        name="lname"
                        onChange={this.handleChange}
                        value={this.state.lname}
                    />

                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        onChange={this.handleChange}
                        value={this.state.email}
                    />

                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container direction="row" justify="center" >
                            <KeyboardDatePicker
                                margin="normal"
                                id="date-picker-dialog"
                                // label="Date of birth"
                                format="MM/dd/yyyy"
                                value={this.state.dob}
                                onChange={this.handleDobChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                            <br/>
                        </Grid>

                        <Grid container direction="row" justify="center" >
                            <SelectTrainerCourse handleSelect={this.handleSelect} options={this.state.allCourses} selectedOptions={this.state.taughtCourses}/>
                        </Grid>

                    </MuiPickersUtilsProvider>
                    <br/>
                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={(e)=>this.handleSubmit(e)}
                    >
                        Update
                    </Button>
                    <br/>
                    <br/>
                    <Grid container direction='row' justify='center'>
                        {this.state.formError && <MuiAlert variant='filled' severity="error">{this.state.formError}</MuiAlert>}
                    </Grid>
                </Paper>
            </Grid>
        );
    }
    // }
}

function mapStateToProps(state) {
    return {
        creatingTrainer: state.trainers.creatingTrainer,
        currentTrainer: state.trainers.currentTrainer,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        // editTrainer: (trainer) => dispatch(updateTrainer(trainer))
    }
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(EditTrainer));