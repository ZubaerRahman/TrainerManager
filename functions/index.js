// // import {db} from '../src/firebase/firebase';
//
// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
//
// admin.initializeApp();
//
// exports.addAdminRole = functions.https.onCall((data, context)=>{
//         //get user and add custom claim
//         return admin.auth().getUser(data.uid).then(user=>{
//             return admin.auth().setCustomUserClaims(user.uid, {
//                 admin: true,
//             });
//         }).then(()=>{
//             return {
//                 messsage: `Success! ${data.uid} has been made admin.`,
//             }
//         }).catch(err=>{
//             return err;
//         })
// },);
//
// exports.addBookingToTimetable = (id, booking) => {
//     let timetableRef = db.collection('timetables').doc(id);
//
// // Atomically add a new region to the "regions" array field.
//     let arrUnion = timetableRef.update({
//         bookings: admin.firestore.FieldValue.arrayUnion(booking)
//     }).then(()=>{console.log('Admin function worked!')}).catch(err=>console.log('Error in cloud function - ',err));
// };
