import React from 'react';
import './App.css';
import {BrowserRouter as Router} from "react-router-dom";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./components/Home";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Navbar from "./components/Navbar";
import AddTrainer from "./components/manage/trainers/AddTrainer";
import Timetable from "./components/manage/trainers/Timetable";
import Trainer from "./components/manage/trainers/Trainer";
import Trainers from "./components/manage/trainers/Trainers";
import Courses from "./components/manage/courses/Courses";
import Bookings from "./components/manage/bookings/Bookings";
import AddBooking from "./components/manage/bookings/AddBooking";
import AddCourse from "./components/manage/courses/AddCourse";
import EditTrainer from "./components/manage/trainers/EditTrainer";
import EditCourse from "./components/manage/courses/EditCourse";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import EditBooking from "./components/manage/bookings/EditBooking";


function App(props) {
  const { isAuthenticated, isVerifying, isLoggingout, logoutError, } = props;
  // console.log("APP, ", props)
  return (
      <Router>
      <Navbar
          isAuthenticated={isAuthenticated}
          isVerifying={isVerifying}
          isLoggingout={isLoggingout}
          logoutError={logoutError}
      />
      <Grid container direction='row' justify='center' alignContent='center' style={{marginTop:'20px'}}>
        <Grid item style={{width:'90%'}}>
      <Switch>
          <ProtectedRoute
              exact
              path="/trainers"
              component={Trainers}
              isAuthenticated={isAuthenticated}
              isVerifying={isVerifying}
          />

          <ProtectedRoute
              exact
              path="/trainers/:id/timetable"
              component={Timetable}
              isAuthenticated={isAuthenticated}
              isVerifying={isVerifying}
          />

        <ProtectedRoute
            exact
            path="/trainers/add-trainer"
            component={AddTrainer}
            isAuthenticated={isAuthenticated}
            isVerifying={isVerifying}
        />

        <ProtectedRoute
            exact
            path="/trainers/:id/edit-trainer"
            component={EditTrainer}
            isAuthenticated={isAuthenticated}
            isVerifying={isVerifying}
        />

          <ProtectedRoute
              exact
              path="/trainers/:id"
              component={Trainer}
              isAuthenticated={isAuthenticated}
              isVerifying={isVerifying}
          />

          <ProtectedRoute
              exact
              path="/trainers/trainer/timetable"
              component={Timetable}
              isAuthenticated={isAuthenticated}
              isVerifying={isVerifying}
          />

          <ProtectedRoute
              exact
              path="/courses"
              component={Courses}
              isAuthenticated={isAuthenticated}
              isVerifying={isVerifying}
          />

        <ProtectedRoute
            exact
            path="/courses/:id/edit-course"
            component={EditCourse}
            isAuthenticated={isAuthenticated}
            isVerifying={isVerifying}
        />

        <ProtectedRoute
            exact
            path="/bookings"
            component={Bookings}
            isAuthenticated={isAuthenticated}
            isVerifying={isVerifying}
        />

        <ProtectedRoute
            exact
            path="/bookings/add-booking"
            component={AddBooking}
            isAuthenticated={isAuthenticated}
            isVerifying={isVerifying}
        />

          <ProtectedRoute
              exact
              path="/bookings/:id/edit-booking"
              component={EditBooking}
              isAuthenticated={isAuthenticated}
              isVerifying={isVerifying}
          />

        <ProtectedRoute
            exact
            path="/courses"
            component={Courses}
            isAuthenticated={isAuthenticated}
            isVerifying={isVerifying}
        />

        <ProtectedRoute
            exact
            path="/courses/add-course"
            component={AddCourse}
            isAuthenticated={isAuthenticated}
            isVerifying={isVerifying}
        />


        <Route exact path='/' component={Home}/>
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
      </Switch>
        </Grid>
      </Grid>
      </Router>
  );
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isVerifying: state.auth.isVerifying
  };
}
export default connect(mapStateToProps)(App);