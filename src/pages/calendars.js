import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays } from 'date-fns';
import './calendars.css'; // Import CSS file for styling
import PreviousIcon from './PreviousIcon'; // Import SVG icon for previous month
import NextIcon from './NextIcon'; // Import SVG icon for next month
import { Datepicker } from "flowbite-react";
import {  Modal } from "flowbite-react";
import {  FaPlus } from "react-icons/fa6";
import TextField from '@mui/material/TextField';

const Calendar = () => {
    const [ selectedDate, setSelectedDate ] = useState(new Date());
    const [ eventName, seteventName ] = useState("");
    const [ eventDescription, seteventDescription ] = useState("");
  
    const [currentMonth, setCurrentMonth] = useState(new Date());
  
    const [openModal, setOpenModal] = useState(true);
  
    const handleDateChange = (date) => {
      setSelectedDate(date);
    };


  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };



  const renderHeader = () => {
    return (
      <div className="calendar-header">
        <div className="nav-button" onClick={prevMonth}>
          <PreviousIcon />
        </div>
        <div className="month-label">
          {format(currentMonth, 'MMMM yyyy')}
        </div>
        <div className="nav-button" onClick={nextMonth}>
          <NextIcon />
        </div>
      </div>
    );
  };

  const renderDaysOfWeek = () => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="days-of-week">
        {daysOfWeek.map(day => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        days.push(day);
        day = addDays(day, 1);
      }
      rows.push(days);
      days = [];
    }

    return (
      <div className="calendar-grid">
        {rows.map((row, idx) => (
          <div key={idx} className="week-row">
            {row.map((date, index) => (
              <div
                key={index}
                className={`calendar-cell ${
                  !isSameMonth(date, monthStart) ? 'disabled' : ''
                } ${isSameDay(date, new Date()) ? 'today' : ''}`}
              >
                {format(date, 'd')}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

    // Get the selected date from the calendar
 /*  console.log(session); */
  console.log(selectedDate);
  console.log(eventName);
  console.log(eventDescription);

  return (
    <div className="calendar-container">
        <div className="calendar">
          {/* Render header, days of week, and calendar cells */}
          {renderHeader()}
          {renderDaysOfWeek()}
          {renderCells()}
          {/* Event form */}
            <div className="event-form">
            <div >
          <>
            <div className="event-form-container">
                <button onClick={() => setOpenModal(true)}><FaPlus /></button>
                <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header style={{backgroundColor:'#f1e092', borderBottom:'1px solid black'}}>Create Events</Modal.Header>
                <Modal.Body style={{backgroundColor:'#f1e092', color:'#15161a'}}>
                  {/* <h2>Hey there {session.user.email}</h2> */}

                  <div className='body'>
                    <TextField id="standard-basic" label="Event Title" variant="standard" onChange={(e) => seteventName(e.target.value)} />
                    <TextField id="standard-basic" label="Event Description" variant="standard" onChange={(e) => seteventDescription(e.target.value)} />
                    <p>Start of the event</p>
                    <Datepicker value={selectedDate} onSelectedDateChanged={handleDateChange} />
                    <p>End of the event</p>
                    <Datepicker value={selectedDate} onSelectedDateChanged={handleDateChange} />
                  </div>
                
                </Modal.Body>
                <Modal.Footer style={{backgroundColor:'#f1e092', borderTop:'1px solid black'}}>
                  <div className='button-footers' style={{display:'flex', gap:'1rem'}}>
                    <button /* onClick={() => createCalendarEvent()} */ >Create Event</button>
                    <button onClick={() => setOpenModal(false)} >Cancel</button>
                  </div>
                </Modal.Footer>
                </Modal>  
            </div>
          </>
      </div>
            </div>
        </div>
    </div>
  );
};

export default Calendar;