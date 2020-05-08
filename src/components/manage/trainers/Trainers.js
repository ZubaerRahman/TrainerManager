import React from "react";
import {db} from "../../../firebase/firebase";
import { connect } from "react-redux";
import {deleteTrainer} from "../../../actions/trainers";
import {Link} from 'react-router-dom';

//UI ELEMENTS
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import Typography from "@material-ui/core/Typography";
import {Container} from "@material-ui/core";
import TrainersProgressbar from "./TrainersProgressbar";

class Trainers extends React.Component{
    state = {
      trainers: [],
      loadingTrainers: false,
    };
    componentDidMount() {
        this.setState({
            loadingTrainers: true,
        });
        db.collection('trainers').onSnapshot(snapshot => {
            // console.log(snapshot.docs);
            let trainersArray = snapshot.docs.map(trainer=>{
                return {
                    id: trainer.id,
                    ...trainer.data(),
                }});
                this.setState({
                    trainers: trainersArray,
                    loadingTrainers: false,
                })
        })
    }

    trainerPage(details) {
        this.props.history.push({pathname: '/trainers/'+details.id, state:{details:details,},});
    }

    render() {
        //STYLING
        const styles={
            paper:{
                height:'130px',
                width:'220px',
                padding: '8px',
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
            accountIconButton:{
                fontSize: '50px',
            }
        };

        // console.log('ROUTE TRAINERS, ',this.props);
        let trainerList = this.state.trainers.length>0 ? (this.state.trainers.map(trainer=>{
            return (
            <Grid item key={Math.random()}>
                <Paper style={styles.paper}>
                    <Grid container direction='column' justify='space-between' alignItems='center' style={{height: '100%'}}>
                        <Grid item>
                        <Grid container direction='column'>
                        <Grid item ><Typography variant='h6'>{trainer.id}</Typography></Grid>
                        <Grid item ><Typography variant='caption'>{trainer.email}</Typography></Grid>
                        </Grid>
                        </Grid>
                        <Grid item>
                            <IconButton color='primary' onClick={()=>this.trainerPage(trainer)}><AccountBoxIcon style={styles.accountIconButton}></AccountBoxIcon></IconButton>
                        </Grid>
                        </Grid>
                </Paper>
            </Grid>)
        })):
            this.state.loadingTrainers ? (<TrainersProgressbar/>)
                :
                (<Typography variant='subtitle2' style={{marginLeft:'12px'}}>No trainers found</Typography>);
        return (
            <Container>
                <Typography variant='h6' style={{marginLeft:'12px'}}>All trainers</Typography>
                <br/>
                <Grid container direction='row'>
                    {trainerList}
                </Grid>
                <br/>
                <Link to='/trainers/add-trainer'><IconButton color='primary' variant='contained'><AddCircleIcon style={styles.floatingActionButton}></AddCircleIcon></IconButton></Link>
            </Container>
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


export default connect(mapStateToProps)(Trainers);