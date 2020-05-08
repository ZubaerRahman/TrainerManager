import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
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
        width:'40%',
    },
    margin: {
        margin: theme.spacing(1),
    },
}));

export default function CoursesProgressbar() {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <ColorLinearProgress className={classes.margin}/>
        </div>
    );
};