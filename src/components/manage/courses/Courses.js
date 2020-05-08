import React from "react";
import {db} from "../../../firebase/firebase";
import { connect } from "react-redux";
import {Link} from 'react-router-dom';
import AddTrainer from "../trainers/AddTrainer";
import firebase from "firebase";

//UI COMPONENTS
import Typography from "@material-ui/core/Typography";
import AccountBoxIcon from "@material-ui/core/SvgIcon/SvgIcon";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import {Container} from "@material-ui/core";
import CoursesProgressbar from "./CoursesProgressbar";

class Courses extends React.Component{
    state = {
        courses: [],
        loadingCourses: false,
    };
    componentDidMount() {
        this.setState({loadingCourses:true});
        db.collection('courses').onSnapshot(snapshot => {
            // console.log(snapshot.docs, 'ALL COURSES SNAPSHOT');
            let coursesArray = snapshot.docs.map(course=>{
                return {
                    id: course.id,
                    ...course.data(),
                }});
            this.setState({
                courses: coursesArray,
                loadingCourses: false,
            })
        })
    }

    handleDelete (course) {
        db.collection('courses').doc(course.id).delete().then(()=>{
            // console.log('Course deleted from Courses.')
        }).catch(err=>console.log(err));
            db.collection('bookings').where('coursename', '==', course.name).get().then(snapshot=>{
                snapshot.docs.forEach(bookingref=>{
                    const booking = bookingref.data();
                    db.collection('bookings').doc(bookingref.id).delete()
                        .then(()=>{
                            db.collection('trainers').doc(booking.trainerid).get().then(trainerref=>{
                                const trainer=trainerref.data();
                                db.collection('timetables').doc(trainer.timetable).update({
                                    bookings: firebase.firestore.FieldValue.arrayRemove(bookingref.id)
                                }).then(()=>{
                                    // console.log('Success! Booking removed from timetable after deleting course.')
                                }).catch(err=>console.log('Error removing booking from timetable after deleting course, ', err))
                            });
                            // console.log('Success! Booking deleted after course delete.')
                        })
                        .catch(err=>{
                            console.log('Error deleting booking after course delete.',err)})
                })
            })
    }

    handleEdit(details){
        // console.log(details,'details')
        this.props.history.push({pathname:'courses/'+details.id+'/edit-course', state:{details:details}})
    }

    render() {

        //STYLING
        const styles={
            paper:{
                height:'220px',
                width:'200px',
                padding: '20px',
                margin: '12px',
            },
            floatingActionButton:{
                margin: '20px',
                top: 'auto',
                right: '20px',
                bottom: '20px',
                left: 'auto',
                position: 'fixed',
                fontSize: '80px',
            },
            editActionButton:{
                fontSize: '20px',
                margin: '4px',
                color:'forestgreen',
            },
            deleteActionButton:{
                fontSize: '20px',
                margin: '4px',
            }
        };


        // console.log('ROUTE COURSES, ',this.props);
        let courseList = this.state.courses.length>0 ? (this.state.courses.map(course=>{
            return (
                    <Grid item key={Math.random()}>
                        <Paper style={styles.paper}>
                            <Grid container direction='column' justify='space-between' style={{height: '100%'}}>
                                <Grid item>
                                    <Grid container direction='column'>
                                        <Grid item ><Typography variant='subtitle1'>{course.name}</Typography></Grid>
                                        <Grid item ><Typography variant='caption'>{course.description}</Typography></Grid>
                                        <Grid item ><Typography variant='caption' style={{fontWeight:'bold'}}>Duration: {course.duration}</Typography></Grid>
                                    </Grid>
                                </Grid>
                                <Grid item style={{width: '100%'}}>
                                    <Grid container direction='row' justify='flex-end' style={{width: '100%'}}>
                                        <Grid item><IconButton onClick={()=>this.handleEdit(course)}><EditIcon style={styles.editActionButton}></EditIcon></IconButton></Grid>
                                        <Grid item><IconButton color='secondary' onClick={()=>this.handleDelete(course)}><DeleteIcon style={styles.deleteActionButton}></DeleteIcon></IconButton></Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
            )
        })): this.state.loadingCourses ? (<CoursesProgressbar/>) : (<Typography variant='subtitle2' style={{marginLeft:'12px'}}>No courses found</Typography>);
        return (
                <Container>
                    <Typography variant='h6' style={{marginLeft:'12px'}}>All courses</Typography>
                    <br/>
                    <Grid container direction='row'>
                        {courseList}
                    </Grid>
                    <Link to='/courses/add-course'><IconButton color='primary' variant='contained'><AddCircleIcon style={styles.floatingActionButton}></AddCircleIcon></IconButton></Link>
                </Container>
        );
    }

}


function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated,
    };
}


export default connect(mapStateToProps)(Courses);