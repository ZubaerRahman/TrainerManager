import React from "react";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import {db} from '../../../firebase/firebase';
import {Container} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import MuiAlert from '@material-ui/lab/Alert';

class EditCourse extends React.Component{

    state={
        initialName:'',
        name:'',
        description:'',
        duration:'',
        snackbaropen: false,
        hasError: false,
    };

    componentDidMount() {
        // console.log(this.props.location.state.details);
        const details = this.props.location.state.details;
        this.setState({...details, initialName: details.name})
    }

    handleChange = (e) => {
        // console.log(e.target);
        this.setState({
            [e.target.id]: e.target.value
        })
    };

    handleDurationChange = (e) => {
        this.setState({
            duration: e.target.value,
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const {name, description, duration} = this.state;
        if (name.length <1 || description.length < 1 || duration.length <1){this.setState({formerror:'Please fill in all fields',})}
        else if (this.state.name.length < 3){this.setState({formerror:'Name is too short!',})}
        else if (this.validateSpecial(name)) { this.setState({ formerror: "Course name can't contain special characters" }); }
        else if (this.state.description.length < 6){this.setState({formerror:'Description is too short!',})}
        else if (this.state.name.length > 26){this.setState({formerror:'Name is too long!',})}
        else if (this.state.description.length > 162){this.setState({formerror:'Description is too long!',})}
        else {
            db.collection('courses').doc(this.state.id).update({
                name: this.state.name,
                description: this.state.description,
                duration: this.state.duration,
            }).then(() => {
                // console.log('Success! Course in Courses document edited.');
                db.collection('bookings').where('coursename', '==', this.state.initialName).get().then(bookings => {
                    // console.log('ALL BOOKING DOCS,', bookings.docs);
                    bookings.docs.forEach(booking => {
                        db.collection('bookings').doc(booking.id).update({
                            coursename: this.state.name,
                        }).then(() => {
                            // console.log('Success! Booking name updated.')
                        })
                    })
                });
                this.handleSnackbarOpen();
                setTimeout(() => {
                    this.props.history.push('/courses');
                }, 500)
            }).catch(err => {
                console.log(err)
            });
        }
    };

    validateSpecial(string) {
        let format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        return format.test(string);
    }

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

    handleSnackbarOpen = () =>{
        this.setState({snackbaropen:true});
    };
    handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({snackbaropen:false});
    };
    render() {
        // const classes = this.useStyles();
        // console.log('EDIT COURSE STATE', this.state)
        return (
            <Container>
                <Typography variant='h6' gutterBottom>Edit Course</Typography>
                <br/>
                <form  onSubmit={this.handleSubmit} style={{margin: 'auto', width: 280, justifyContent:'center',}}>
                    <Grid container direction="column" justify="center" >
                        <TextField
                            id="name"
                            placeholder="Course name"
                            label="Name"
                            onChange={this.handleChange}
                            required
                            value={this.state.name}
                        />
                        <br/>
                        <TextField
                            id="description"
                            placeholder="Course description"
                            label="Description"
                            onChange={this.handleChange}
                            required
                            value={this.state.description}
                        />
                        <br/>
                        <FormControl error={this.state.hasError} required>
                            <InputLabel id="duration-label">Lenght</InputLabel>
                            <Select
                                labelId="demo-simple-select-helper-label"
                                id="duration"
                                value={this.state.duration}
                                onChange={this.handleDurationChange}
                            >
                                <MenuItem value=''>
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem id='duration' value={'2 weeks'}>2 weeks</MenuItem>
                                <MenuItem value={'4 weeks'}>4 weeks</MenuItem>
                                <MenuItem value={'6 weeks'}>6 weeks</MenuItem>
                                <MenuItem value={'12 weeks'}>12 weeks</MenuItem>
                                <MenuItem value={'16 weeks'}>16 weeks</MenuItem>
                                <MenuItem value={'24 weeks'}>24 weeks</MenuItem>
                            </Select>
                            <FormHelperText>Duration of course in weeks</FormHelperText>
                            {this.state.hasError && <FormHelperText>This is required!</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <br/>
                    <Grid container justify="center">
                        <Button
                            type="submit"
                            color="primary"
                            variant="text"
                        >Update Course</Button>
                    </Grid>
                    <br/>
                    <br/>
                    <Grid container direction='row' justify='center'>
                        {this.state.formerror && <MuiAlert variant='filled' severity="error">{this.state.formerror}</MuiAlert>}
                    </Grid>
                </form>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={this.state.snackbaropen}
                    autoHideDuration={6000}
                    onClose={this.handleClose}
                    message="Course edited!"
                    action={
                        <React.Fragment>
                            <IconButton size="small" aria-label="close" color="primary" onClick={this.handleSnackbarClose}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </React.Fragment>
                    }
                />
            </Container>
        );
    }
}
export default EditCourse;
