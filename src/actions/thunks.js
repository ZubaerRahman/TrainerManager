// import {myFirebase} from "../firebase/firebase";
//
// export const loginUser = (email, password) => dispatch => {
//     dispatch(requestLogin());
//     myFirebase.auth().signInWithEmailAndPassword(email,password)
//         .then(user=>{
//             dispatch(receiveLogin(user))
//         })
//         .catch(err=>{
//             console.log(err);
//             dispatch(loginError());
//         })
// };
//
// export const logoutUser = () => dispatch => {
//     dispatch(requestLogout());
//     myFirebase
//         .auth()
//         .signOut()
//         .then(() => {
//             dispatch(receiveLogout());
//         })
//         .catch(error => {
//             //Do something with the error if you want!
//             dispatch(logoutError());
//         });
// };
//
// export const verifyAuth = () => dispatch => {
//     dispatch(verifyRequest());
//     myFirebase.auth().onAuthStateChanged(user => {
//         if (user !== null) {
//             dispatch(receiveLogin(user));
//         }
//         dispatch(verifySuccess());
//     });
// };