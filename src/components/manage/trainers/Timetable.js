import React from "react";
import moment from "moment";

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";
import {db} from '../../../firebase/firebase';
import TimetablePopover from "./TimetablePopover";

export default class Calendar extends React.Component{
    constructor(props){
        super(props);
        this.style = props.style || {};
    }

    state={
        dateContext: moment(),
        today: moment(),
        showMonth: false,
        showYear: false,
        // events: this.props.events
        events: this.props.location.state.bookings,
    };

    componentDidMount() {
        // console.log(this.props);
        // db.collection('timetables').doc(this.props.location.state.timetableid).get().then(timetable=>{
        //     !timetable.exists ? console.log('Timetable not found.') : this.setState({events:timetable.data().events});
        // }).catch(err=>console.log(err));
        // this.setState({})
    }

    weekdays= moment.weekdays();
    // weekdaysShort= moment.weekdaysShort();
    weekdaysShort = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    months= moment.months();

    year = () => { return this.state.dateContext.format("Y") };
    month = () => { return this.state.dateContext.format("MMMM") };
    daysInMonth = () => { return this.state.dateContext.daysInMonth() };
    currentDate = () => {
        // console.log(this.state.dateContext.get('date'));
        return this.state.dateContext.get('date') };
    currentDay = () => { return this.state.dateContext.format("D") };
    firstDayOfMonth = () => {
        let dateContext = this.state.dateContext;
        let firstDay = moment(dateContext).startOf('month').format('d');
        // console.log(firstDay);
        return firstDay;
    };

    setMonth = (month) => {
        let monthNo = this.months.indexOf(month);
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set('month', monthNo);
        this.setState({
            dateContext: dateContext
        })
    };

    nextMonth = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).add(1, 'month');
        this.setState({dateContext:dateContext});
    };
    prevMonth = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).subtract(1, 'month');
        this.setState({dateContext:dateContext});
    };

    onSelectChange = (e, month) =>{
        this.setMonth(month);
        this.props.onChangeMonth && this.props.onChangeMonth();
    };

    SelectList = (props) => {
        let popup = props.data.map(data=>{
            return(
                <div key={data}>
                    <span onClick={(e)=>{this.onSelectChange(e, data)}}>
                        {data}
                    </span>
                </div>
            )
        });
        return (
            <div className="month-popup">
                {popup}
            </div>
        );
    };

    onChangeMonth = (e, month)=>{
        this.setState({
            showMonth : !this.state.showMonth
        })
    };
    MonthNav = () => {
        return(
            <span className="label-month" onClick={(e)=>{this.onChangeMonth(e, this.month())}}>
                {this.month()}
                {this.state.showMonth && <this.SelectList data={this.months}/>}
                </span>
        )
    };

    ToggleYear = (e) => {
        this.setState({
            showYear : !this.state.showYear
        })
    };
    setYear = (year) => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set('year', year);
        this.setState({
            dateContext : dateContext
        })
    };
    onKeyUpYear = (e) => {
        if (e.which === 13 || e.which === 27){
            this.setYear(e.target.value);
            this.setState({
                showYear : false
            })
        }
    };
    onYearChange = (e) => {
        this.setYear(e.target.value);
        this.props.onYearChange && this.props.onYearChange(e, e.target.value);
    };
    YearNav = () => {
        return(
            this.state.showYear ? <TextField defaultValue={this.year()} ref={(yearInput=>{ this.yearInput= yearInput})} onKeyUp={(e)=>{this.onKeyUpYear(e)}} onChange={(e)=>{this.onYearChange(e)}} type="number" placeholder="year"/> :
                <span className="label-year" onClick={(e)=>{this.ToggleYear()}}>
                {this.year()}
            </span>
        )
    };
    onDayClick = (e, day) => {
        alert(day);
        // this.props.onDayClick && this.props.onDayClick(e, day);
    };

    render() {
        // console.log('RENDER EVENTS ',this.state.events);
        // console.log(moment().year('2020').month('july').date('12'));
        let weekdays = this.weekdaysShort.map((day)=>{
            return (
                <TableCell align="center" key={Math.random()} className="week-day" style={{borderBottom:"none"}}>{day}</TableCell>
            )
        });
        let blanks = [];
        for(let i=1; i<(Number(this.firstDayOfMonth())===0? 7 : Number(this.firstDayOfMonth())); i++){
            // console.log(i, "iii")
            blanks.push(<TableCell align="center" key={i+1} className="empty-slot" style={{padding:"4px", borderBottom:"none"}}>{""}</TableCell>)
        }
        // console.log("Blank days:", blanks);
        let daysInMonth = [];
        for(let d=1; d<=this.daysInMonth(); d++){
            let className = (d===this.currentDay() ? "day current-day": "day");
            let day = moment(this.state.dateContext).year(this.year()).month(this.month()).date(d);
            let eventsToday = this.state.events.filter(event=>{
                if (event.date!==undefined){
                    if (moment(event.date).format('LL') === moment(day).format('LL')){  //check events for each day. format('LL') removes time bit from date
                        // console.log("FOUND " + moment(undefined).format('LL') + String(event.date), String(day), event.name);
                        return true
                    }
                    else{
                        return false
                    }
                }
            });
            let listEvents =  eventsToday.map((event)=>{
                return(<span key={Math.random()}><FiberManualRecord style={{height:"14px", margin:"0px", color:`#${Math.floor(Math.random()*1000) + 1}`}}/></span>)
            });
            daysInMonth.push(<TableCell align="center" key={d+10} className="" style={{padding:"4px", borderBottom:"none"}}>
                <TimetablePopover date={d} listEvents={listEvents} eventsdata={eventsToday}/>
            </TableCell>)
        }
        // console.log("Days:", daysInMonth);
        let totalSlots = [...blanks, ...daysInMonth];
        let rows = [];
        let cells = [];
        totalSlots.forEach((row, i)=>{
            if((i%7)!==0){
                cells.push(row)
            }else{
                let rowToInsert = cells.slice();
                rows.push(rowToInsert);
                cells=[];
                cells.push(row);
            }
            if(i===totalSlots.length-1){
                let rowToInsert = cells.slice();
                rows.push(rowToInsert);
            }
        });

        let trElems = rows.map((d,i)=>{
            return(
                <TableRow key={i}>{d}</TableRow>
            )
        });


        return(

            <TableContainer className="calendar">
                <Table>
                    <TableHead>
                        <TableRow className="calendar-header" component={Paper}>
                            <TableCell colSpan="5">
                                <Grid container justify="space-between">
                                    <Grid item>
                                        <this.MonthNav/>
                                    </Grid>
                                    <Grid item>
                                        <this.YearNav/>
                                    </Grid>
                                </Grid>
                            </TableCell>
                            <TableCell align="right" colSpan="2" className="nav-month">
                                <i className="fas fa-fw fa-chevron-left" onClick={(e)=>{this.prevMonth(e)}}>
                                </i>
                                <span> </span>
                                <i className="fas fa-fw fa-chevron-right"
                                   onClick={(e)=>{this.nextMonth(e)}}>
                                </i>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            {weekdays}
                        </TableRow>
                        {trElems}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

}