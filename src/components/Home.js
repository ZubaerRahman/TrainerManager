import React, { Component } from "react";
import { connect } from "react-redux";
import TrainersCard from "./landing/TrainersCard";
import CoursesCard from "./landing/CoursesCard";
import BookingsCard from "./landing/BookingsCard";
import {Container} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

class Home extends Component {

    render() {
        const styles = {
            mainCard: {
                margin: '8px',
            }
        };

        return (
            <div>
                <br/>
                <Grid container direction='row' justify='space-around'>
                    <Grid item style={styles.mainCard}>
                        <TrainersCard/></Grid>
                    <Grid item style={styles.mainCard}>
                <CoursesCard/>
                    </Grid>
                    <Grid item style={styles.mainCard}>
                <BookingsCard/>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        isLoggingOut: state.auth.isLoggingOut,
        logoutError: state.auth.logoutError
    };
}
export default connect(mapStateToProps)(Home);