import React from 'react';
import {db} from "../../../firebase/firebase";

import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from "@material-ui/core/Input";

const useStyles = makeStyles((theme) => ({
    typography: {
        padding: theme.spacing(2),
    },
}));

export default function UnavailablePopover({trainerid, handleSnackbarOpen}) {
    const classes = useStyles();
    const styles = {
      popover: {
          width: "3000px",
          height: "3000px",

      }
    };
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [weekday, setWeekday] = React.useState(null);
    const [start, setStart] = React.useState(null);
    const [end, setEnd] = React.useState(null);
    const [formerror, setFormerror] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleWeekday = (event) => {setWeekday(String(event.target.value))};
    const handleStartChange = (event) => {setStart(Number(event.target.value))};
    const handleEndChange = (event) => {setEnd(Number(event.target.value))};

    const handleClose = () => {
        setWeekday(null);
        setStart(null);
        setEnd(null);
        setFormerror(null);
        setAnchorEl(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log('Submitting... , DATA: ', weekday, start, end, trainerid)
        if(weekday === null || start === null || end === null){setFormerror('Please fill in all fields')}
        else if(start>end){setFormerror('Start time cannot be > End time')}
        else if(!trainerid){setFormerror('Trainer not found')}
        else if(start === end){setFormerror('Start and end cannot be the same')}
        else {
            //check current unavailabilities
            db.collection('unavailabilities').where('trainerid', '==', trainerid).get().then(snapshot=>{
                // console.log('SNAPSHOT', snapshot);
                if(snapshot.docs.length===0){
                    // console.log('First unavailability for trainer');
                    db.collection('unavailabilities').doc().set({
                        trainerid: trainerid,
                        weekday: weekday,
                        start: start,
                        end: end,
                    }).then(()=>{
                        // console.log('UNAVAILABILITY FORM SUBMITTED, DATA: ', weekday, start, end, trainerid);
                        // console.log('Success! Unavailability added.')
                        handleClose()
                    }).catch(err=>{console.log(err)});
                }
                else{
                let checks = snapshot.docs.map(doc=>{
                   // console.log('DOC DATA',doc.data());
                   const unavailability= doc.data();
                   if (weekday === unavailability.weekday){
                       if (start <= unavailability.start && end >= unavailability.end){setFormerror('Unavailability overlaps existing one.'); return false}
                       else if(start >= unavailability.start && start < unavailability.end){setFormerror('Start time falls between an existing unavailability.'); return false}
                       else if(end > unavailability.start && end <= unavailability.end){setFormerror('End time falls between an existing unavailability.'); return false}
                       else {
                           // console.log('Checks passed, returning true.');
                           return true
                       }
                   }
                   else {
                       // console.log('Different week day, no issue');
                       return true
                   }
               });
                if(!checks.includes(false)){
                    setFormerror('');
                    db.collection('unavailabilities').doc().set({
                        trainerid: trainerid,
                        weekday: weekday,
                        start: start,
                        end: end,
                    }).then(()=>{
                        // console.log('UNAVAILABILITY FORM SUBMITTED, DATA: ', weekday, start, end, trainerid);
                        // console.log('Success! Unavailability added, ALL CHECKS PASSED.');
                        handleSnackbarOpen('Unavailability added');
                        handleClose()
                    }).catch(err=>{console.log(err)});
                }
                }//else
            });

        }
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    return (
        <div>
            <Button aria-describedby={id} variant="text" color="primary" onClick={handleClick} size='small'>
                Add unavailability
            </Button>
            <Popover
                style={styles.popover}
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <div style={{padding:'8px'}}>
                    <Typography className={classes.typography}>Select recurring day and times</Typography>
                    <form className={classes.container} onSubmit={handleSubmit}>
                        <Grid container direction='row' justify='space-evenly'>
                            <Grid item>
                                <FormControl className={classes.formControl} style={{minWidth:'70px'}}>
                                    <InputLabel id="demo-dialog-select-label">Day</InputLabel>
                                    <Select
                                        labelId="demo-dialog-select-label"
                                        id="demo-dialog-select"
                                        value={weekday}
                                        onChange={handleWeekday}
                                        input={<Input />}
                                    >
                                        <MenuItem value={'Monday'}>Mon</MenuItem>
                                        <MenuItem value={'Tuesday'}>Tue</MenuItem>
                                        <MenuItem value={'Wednesday'}>Wed</MenuItem>
                                        <MenuItem value={'Thursday'}>Thu</MenuItem>
                                        <MenuItem value={'Friday'}>Fri</MenuItem>
                                        <MenuItem value={'Saturday'}>Sat</MenuItem>
                                        <MenuItem value={'Sunday'}>Sun</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl className={classes.formControl} style={{minWidth:'70px'}}>
                                    <InputLabel id="demo-dialog-select-label">Start</InputLabel>
                                    <Select
                                        labelId="demo-dialog-select-label"
                                        id="demo-dialog-select"
                                        value={start}
                                        onChange={handleStartChange}
                                        input={<Input />}
                                    >
                                        <MenuItem value={8}>8 am</MenuItem>
                                        <MenuItem value={9}>9 am</MenuItem>
                                        <MenuItem value={10}>10 am</MenuItem>
                                        <MenuItem value={11}>11 am</MenuItem>
                                        <MenuItem value={12}>12 pm</MenuItem>
                                        <MenuItem value={13}>1 pm</MenuItem>
                                        <MenuItem value={14}>2 pm</MenuItem>
                                        <MenuItem value={15}>3 pm</MenuItem>
                                        <MenuItem value={16}>4 pm</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl className={classes.formControl} style={{minWidth:'70px'}}>
                                    <InputLabel id="demo-dialog-select-label">End</InputLabel>
                                    <Select
                                        labelId="demo-dialog-select-label"
                                        id="demo-dialog-select"
                                        value={end}
                                        onChange={handleEndChange}
                                        input={<Input />}
                                    >
                                        <MenuItem value={8}>8 am</MenuItem>
                                        <MenuItem value={9}>9 am</MenuItem>
                                        <MenuItem value={10}>10 am</MenuItem>
                                        <MenuItem value={11}>11 am</MenuItem>
                                        <MenuItem value={12}>12 pm</MenuItem>
                                        <MenuItem value={13}>1 pm</MenuItem>
                                        <MenuItem value={14}>2 pm</MenuItem>
                                        <MenuItem value={15}>3 pm</MenuItem>
                                        <MenuItem value={16}>4 pm</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    <br/>
                    {formerror && <Typography variant='subtitle2' color='secondary'>{formerror}</Typography>}
                    <Grid container direction='row' justify='flex-end'>
                        <Grid item>
                            <Button type="submit" variant='contained' color='primary' size='small'>Add slot</Button>
                        </Grid>
                    </Grid>
                    </form>
                </div>
            </Popover>
        </div>
    );
}