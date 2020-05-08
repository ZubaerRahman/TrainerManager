import React from "react";
import {db} from "../../../firebase/firebase";
import { connect } from "react-redux";
import {Link} from 'react-router-dom';
import firebase from "firebase";
import {Container} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import BookingExpansionPanel from "./BookingExpansionPanel";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from "@material-ui/core/IconButton";
import BookingProgressbar from "./BookingsProgressbar";
class Bookings extends React.Component{
    state = {
        bookings: [],
        loadingBookings: false,
    };
    componentDidMount() {
        this.setState({
            loadingBookings: true,
        });
        db.collection('bookings').onSnapshot(snapshot => {
            // console.log(snapshot.docs);
            let bookingsArray = snapshot.docs.map(booking=>{
                return {
                    id: booking.id,
                    ...booking.data(),
                }});
            this.setState({
                bookings: bookingsArray,
                loadingBookings: false,
            })
        })
    }

    handleDelete (id, trainerid) {
        db.collection('trainers').doc(trainerid).get().then(trainerref=>{
            const timetable = trainerref.data().timetable;
            db.collection('timetables').doc(timetable).update({
                bookings: firebase.firestore.FieldValue.arrayRemove(id)
            }).then(()=>{
                // console.log('Booking deleted from timetable');
                db.collection('bookings').doc(id).delete().then(()=>{
                    // console.log('Booking deleted from bookings document.')
                }).catch(err=>console.log(err));
            }).catch(err=>console.log(err));
        });
    }

    bookingPage(details) {
        this.props.history.push({pathname: '/bookings/booking', state:{details:details,},});
    }

    render() {
        // console.log('FIRST RENDER BOOKINGS props, ', this.props);
        //STYLING
        const styles={
            floatingActionButton:{
                margin: '20px',
                top: 'auto',
                right: '20px',
                bottom: '20px',
                left: 'auto',
                position: 'fixed',
                fontSize: '80px',
            },
            accountIconButton:{
                fontSize: '50px',
            }
        };

        // console.log('FIRST RENDER BOOKINGState, ', this.state);
        let bookingList = this.state.bookings.map(booking=>{
            if(booking){
                // console.log('HEEEYA', booking);
                return (<BookingExpansionPanel booking={booking} handleDelete={this.handleDelete} history={this.props.history} key={Math.random()}/>)
            }
            else {return <li>No data found</li>}
        });

        return (
            <Container>
                <Typography variant='h6' style={{marginLeft:'12px'}} gutterBottom>All bookings</Typography>
                <br/>
                <div style={{marginLeft:'12px'}}>
                    {bookingList.length ? bookingList
                        :
                        this.state.loadingBookings ?
                            <div>
                                <BookingProgressbar/>
                            </div> : 'No bookings found'}
                </div>
                <br/>
                <br/>
                <br/>
                <br/>
                <Link to='/bookings/add-booking'>
                    <IconButton color='primary' variant='contained'>
                        <AddCircleIcon style={styles.floatingActionButton}>
                        </AddCircleIcon>
                    </IconButton>
                </Link>

            </Container>
        );
    }

}


function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated,
    };
}


export default connect(mapStateToProps)(Bookings);