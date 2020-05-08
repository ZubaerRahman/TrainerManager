import React from 'react';
import { lighten, makeStyles, withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';

const ColorLinearProgress = withStyles({
    colorPrimary: {
        backgroundColor: 'lightgrey',
    },
    barColorPrimary: {
        backgroundColor: 'black',
    },
})(LinearProgress);

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width:'66%',
    },
    margin: {
        margin: theme.spacing(1),
    },
}));

export default function BookingsProgressbar() {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <ColorLinearProgress className={classes.margin}/>
        </div>
    );
};