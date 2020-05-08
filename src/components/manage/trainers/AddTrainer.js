import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {db} from '../../../firebase/firebase';
import { createTrainer } from "../../../actions/trainers";
import { withStyles } from "@material-ui/styles";
import moment from "moment";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from '@date-io/date-fns';
import MuiAlert from '@material-ui/lab/Alert';

import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import SelectTrainerCourse from "./SelectTrainerCourse";
import { format } from "date-fns/esm/fp";

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

class AddTrainer extends Component {
    state = {email: '', fname: '', lname: '', dob: Date.now(), id: '', taughtCourses: [], allCourses:[],};

    componentDidMount() {
        db.collection('courses').onSnapshot(snapshot=> {
            let courses = snapshot.docs.map(course => {
                return course.data().name
            });
            this.setState({allCourses: courses})
        });
    };

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
        const { email, fname, lname, dob, id, taughtCourses } = this.state;
        if (fname.length === 0 || lname.length === 0 || email.length === 0) { this.setState({ formError: 'Name is too short' }) }
        else if (this.validateSpecial(fname)) { this.setState({ formError:"First name can't contain special characters"}); }
        else if (this.validateSpecial(lname)) { this.setState({ formError:"Last name can't contain special characters"}); }
        else if (this.validateSpecial(id)) { this.setState({ formError:"ID can't contain special characters"}); }
        else if(fname.length <2 || lname.length < 2){this.setState({formError:'Name is too short'})}
        else if(!this.validateEmail(this.state.email)){this.setState({formError:'Invalid email'})}
        else if(taughtCourses.length<1){this.setState({formError:'You must select at least one taught course'})}
        else if(moment().diff(dob, 'years')<18){
            // console.log(moment().diff(dob, 'years'));
            this.setState({formError:'Trainer must be over 18 years old'})}
        else{
            this.setState({formError:''});
            db.collection('trainers').doc(id).get().then((trainer)=>{
                if(trainer.exists){this.setState({formError:'Trainer ID already exists.'})}
                else{
                    this.setState({formError:''});
                    this.props.createTrainer({
                        fname: fname,
                        lname: lname,
                        dob: dob,
                        email: email,
                        id: id,
                        bookings: [],
                        taughtCourses: taughtCourses,
                    });
                    this.props.history.push('/trainers')
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
        // console.log("ADD TRAINER STATE ", this.state);
        // console.log("TRAINER PROPS ", this.props);
        const { classes, isAuthenticated } = this.props;
        // if (!isAuthenticated) {
        //     return <Redirect to="/" />;
        // } else {
            return (
                <Grid container direction='row' justify='center'>
                    <Paper className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <PersonAddIcon/>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Add Trainer
                        </Typography>
                        <form onSubmit={(e)=>this.handleSubmit(e)}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="fname"
                            label="First name"
                            name="fname"
                            onChange={this.handleChange}
                            required
                        />

                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="lname"
                            label="Last name"
                            name="lname"
                            onChange={this.handleChange}
                            required
                        />

                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="id"
                            label="Employee ID"
                            name="id"
                            onChange={this.handleChange}
                            required
                        />

                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            onChange={this.handleChange}
                            required
                        />
                            <Grid container direction="row" justify="center" >
                            <SelectTrainerCourse handleSelect={this.handleSelect} options={this.state.allCourses} selectedOptions={this.state.taughtCourses}/>
                            </Grid>

                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Grid container direction="row" justify="center" >
                                    <KeyboardDatePicker
                                        style={{width: '80%'}}
                                        margin="normal"
                                        id="date-picker-dialog"
                                        label="Date of birth"
                                        format="MM/dd/yyyy"
                                        value={this.state.dob}
                                        onChange={this.handleDobChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                    <br/>
                                </Grid>
                         </MuiPickersUtilsProvider>

                        <br/>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                             Create
                        </Button>
                            <br/>
                            <br/>
                            <Grid container direction='row' justify='center'>
                                {this.state.formError && <MuiAlert variant='filled' severity="error">{this.state.formError}</MuiAlert>}
                            </Grid>
                        </form>
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
        createTrainer: (trainer) => dispatch(createTrainer(trainer))
    }
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AddTrainer));