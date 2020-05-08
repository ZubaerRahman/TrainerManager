import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
// eslint-disable-next-line no-unused-vars
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
// eslint-disable-next-line no-unused-vars
import MenuIcon from "@material-ui/icons/Menu";
import Button from "@material-ui/core/Button";
import { makeStyles } from '@material-ui/core/styles';
import PeopleIcon from '@material-ui/icons/People';
import DateRangeIcon from '@material-ui/icons/DateRange';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import {NavLink, Link} from 'react-router-dom'
import {connect} from "react-redux";
import {logoutUser} from "../actions";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));


const Navbar = (props) => {
    const [state, setState] = React.useState({ // for drawer
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const handleLogout = () => {
        const { dispatch } = props;
        dispatch(logoutUser());
    };

    const { isAuthenticated } = props;

    const toggleDrawer = (side, open) => event => {
        // console.log(event.target);
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [side]: open });
    };

    const sideList = side => (
        <div
            role="presentation"
            // onDoubleClick={toggleDrawer(side, false)}
            onKeyDown={toggleDrawer(side, false)}
            style={{backgroundColor:'black', height:'100%'}}
        >
            <List>
                <br/>
                <ListItem button component={Link} to="/trainers" style={{width:"200px"}} onClick={toggleDrawer(side, false)}>
                    <ListItemIcon><PeopleIcon style={{color:'white'}}>
                    </PeopleIcon></ListItemIcon>
                    <ListItemText style={{color:'white'}}>Trainers</ListItemText>
                </ListItem>
                <br/>
                <ListItem button component={Link} to="/courses" style={{width:"200px"}} onClick={toggleDrawer(side, false)}>
                    <ListItemIcon><LibraryBooksIcon style={{color:'white'}}>
                    </LibraryBooksIcon></ListItemIcon>
                    <ListItemText style={{color:'white'}}>Courses</ListItemText>
                </ListItem>
                <br/>
                <ListItem button component={Link} to="/bookings" style={{width:"200px"}} onClick={toggleDrawer(side, false)}>
                    <ListItemIcon ><DateRangeIcon style={{color:'white'}}>
                    </DateRangeIcon></ListItemIcon>
                    <ListItemText style={{color:'white'}}>Bookings</ListItemText>
                </ListItem>
            </List>
        </div>
    );

    const classes = useStyles();
    // console.log(props, 'NAVBAR PROPS');
    return (
        <AppBar position="static" style={{background:"black", boxShadow:"none"}}>
            <Toolbar>
                <IconButton onClick={toggleDrawer('left', 'true')} edge="start" className={classes.menuButton} style={{color:'white'}} aria-label="menu">
                    <MenuIcon/>
                </IconButton>
                <Drawer open={state.left} onClose={toggleDrawer('left', false)} >
                    {sideList('left')}
                </Drawer>

                        <Typography variant="h5" color='primary' className={classes.title} style={{ textDecoration: 'none',}}>
                            <NavLink to="/" style={{textDecoration:'none', color:'white', fontWeight:'bold'}}>
                                <img src='https://www.fdmgroup.com/wp-content/themes/fdm/images/fdm-logo-2018.png'
                                     style={{height:'24px', width:'46px', backgroundColor:'black'}}
                                />
                                TRAIN
                            </NavLink>
                        </Typography>

                {isAuthenticated && <Button variant='text' style={{color:'white'}} onClick={handleLogout}>Logout</Button>}
                {!isAuthenticated && <Button style={{marginRight: "10px", color:'white'}} variant="text" component={Link} to="/login">Login</Button>}
                {!isAuthenticated && <Button variant="text" style={{color:'white'}} component={Link} to="/signup">Signup</Button>}
            </Toolbar>
        </AppBar>
    );
};

const mapStateToProps = (state) => {
    return{
    isAuthenticated: state.auth.isAuthenticated,
    isVerifying: state.auth.isVerifying,
    }
};

export default connect(mapStateToProps)(Navbar)