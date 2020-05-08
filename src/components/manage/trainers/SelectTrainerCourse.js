import React from 'react';
import { makeStyles,  } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        width:'80%',
        maxWidth:300,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 280,
        },
    },
};


export default function SelectTrainerCourse({handleSelect, options, selectedOptions}) {
    const names = [...options];
    const classes = useStyles();

    // const [courses, setCourses] = React.useState([]);

    // const handleChange = (event) => {
    //     setCourses(event.target.value);
    //     console.log('SELECTED COURSES', event.target.value)
    // };

    return (
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-mutiple-checkbox-label">Courses Taught</InputLabel>
                <Select
                    labelId="demo-mutiple-checkbox-label"
                    id="demo-mutiple-checkbox"
                    multiple
                    value={selectedOptions}
                    onChange={handleSelect}
                    input={<Input />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                >
                    {names.map((name) => (
                        <MenuItem key={name} value={name}>
                            <Checkbox checked={selectedOptions.indexOf(name) > -1} />
                            <Typography variant='caption'>{name}</Typography>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
    );
}