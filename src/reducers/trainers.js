//import actions to put in switch -> create, update, delete
import {
    GET_TRAINERS,
    CREATE_TRAINER,
    CREATE_TRAINER_SUCCESS,
    UPDATE_TRAINER,
    UPDATE_TRAINER_SUCCESS,
    DELETE_TRAINER,
    DELETE_TRAINER_SUCCESS,
} from '../actions/trainers'

export default (state={
    currentTrainer: {},
    trainers: [],
    creatingTrainer: false,
    updatingTrainer: false,
    deletingTrainer: false,
}, action) => {switch(action.type){
    case GET_TRAINERS:
        return{
            ...state,
            trainers: action.trainers,
        };
    case CREATE_TRAINER:
        return {
            ...state,
            creatingTrainer: true,
        };
    case CREATE_TRAINER_SUCCESS:
        console.log('HAHAHA');
        return state
        // return {
        //     ...state,
        //     currentTrainer: action.trainer,
        //     creatingTrainer: false,
        // };
        // console.log('TESTING, ',state);
        // return Object.assign({}, state, {
        //     currentTrainer: action.trainer,
        //     creatingTrainer: false,
        // });
    case UPDATE_TRAINER:
        return {
            ...state,
            updatingTrainer: true,
            currentTrainer: action.trainer,
        };
    case UPDATE_TRAINER_SUCCESS:
        return {
            ...state,
            updatingTrainer: false,
            currentTrainer: {},
        };
    case DELETE_TRAINER:
        return {
            ...state,
            deletingTrainer: true,
        };
    case DELETE_TRAINER_SUCCESS:
        return {
            ...state,
            deletingTrainer: false,
        };
    default:
        return {
            state
        }
    }
};