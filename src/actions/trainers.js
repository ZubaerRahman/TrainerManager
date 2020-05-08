import {myFirebase, db} from "../firebase/firebase";

export const CREATE_TRAINER = 'CREATE_TRAINER';
export const CREATE_TRAINER_SUCCESS = 'CREATE_TRAINER_SUCCESS';
export const UPDATE_TRAINER = 'UPDATE_TRAINER';
export const UPDATE_TRAINER_SUCCESS = 'UPDATE_TRAINER_SUCCESS';
export const GET_TRAINERS = 'GET_TRAINERS';
export const DELETE_TRAINER = 'DELETE_TRAINER';
export const DELETE_TRAINER_SUCCESS = 'DELETE_TRAINER_SUCCESS';

const requestTrainerCreation = () => {
    return {type:CREATE_TRAINER,}};

const trainerCreationSuccess = (trainers) => {
    return {type:CREATE_TRAINER_SUCCESS, trainers}};

const requestTrainerUpdate = (details) => {
    return{type:UPDATE_TRAINER, details}};

const trainerUpdateSuccess = () => {
    return{type:UPDATE_TRAINER_SUCCESS, }};

const requestTrainerDelete = (trainer) => {
    return{type:DELETE_TRAINER, trainer}};

const trainerDeleteSuccess = () => {
    return{type:DELETE_TRAINER_SUCCESS}};



//ACTUAL ACTIONS
export const createTrainer = (details) => dispatch => {
    // dispatch(requestTrainerCreation());
    //get db and create new trainer instance
    db.collection('trainers').doc(details.id).get().then(trainer=>{
        if(trainer.exists){
            // console.log("Trainer already exists!");
        }else{
    db.collection('trainers').doc(details.id).set({
        fname: details.fname,
        lname: details.lname,
        dob: details.dob.toString(),
        email: details.email,
        taughtCourses: details.taughtCourses,
    }).then(trainer=>{
        db.collection('timetables').add({
            owner: details.id,
            text: "BRUH",
            bookings: [],
        }).then((timetable)=>{
            // console.log("Timetable created for " + timetable.id);
            db.collection('trainers').doc(details.id).set({
                timetable : timetable.id
            }, {merge:true})
                .then(()=>{
                    // console.log("Added timetable property to trainer!");
                    // dispatch(trainerCreationSuccess(trainer));
                })
                .catch(err=>{console.log(err)})
        }).catch(err=>{console.log("Error creating Timetable, ", err)});
    }).catch(err=>{console.log("Error creating Trainer ", err)});
    }}).catch(err=>{console.log("Error retrieving Trainer ", err)})
};

export const updateTrainer = (id, details) => dispatch => {
    const trainerRef= db.collection('trainers').doc(id);
    dispatch(requestTrainerUpdate(details));
    trainerRef.get().then(trainer=>{
        if(!trainer.exists){
            // console.log("Trainer doesn't exist!")
        }
        else{   trainerRef.update({...details})
            .then(()=>{
                // console.log("Edited trainer, ", trainer)
            })
            .catch(err=>{
            console.log("Error updating trainer.")
        });
            dispatch(trainerUpdateSuccess());
        }
    });
};

export const deleteTrainer = (id) => dispatch => {
    // dispatch(requestTrainerDelete(id));
    const trainerRef= db.collection('trainers').doc(id);
    trainerRef.get().then(trainer=>{
        if(!trainer.exists){
            // console.log("Trainer doesn't exist!")
        }
        else{   trainerRef.delete()
            .then(()=>{
                console.log("Deleted trainer. Now deleting timetable... ",);
                db.collection('timetables').doc(trainer.data().timetable).delete()
                    .then(()=>{
                        // console.log("Timetable of trainer deleted.")
                    })
                    .catch(err=>{console.log(err)});
            })
            .catch(err=>{
                console.log("Error deleting trainer.")
            });
            // dispatch(trainerDeleteSuccess());
        }
    });
    // dispatch(trainerDeleteSuccess());
};