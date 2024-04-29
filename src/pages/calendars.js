import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays } from 'date-fns';
import './calendars.css'; // Import CSS file for styling
import PreviousIcon from './PreviousIcon'; // Import SVG icon for previous month
import NextIcon from './NextIcon'; // Import SVG icon for next month
/* import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react'; */
import { Datepicker } from "flowbite-react";
import { Button, Modal } from "flowbite-react";

const Calendar = () => {
    const [ selectedDate, setSelectedDate ] = useState(new Date());
    const [ eventName, seteventName ] = useState("");
    const [ eventDescription, seteventDescription ] = useState("");
  
    const [currentMonth, setCurrentMonth] = useState(new Date());
   /*  const session = useSession(); */
   /*  const supabase = useSupabaseClient(); */
   /*  const {isLoading} = useSessionContext(); */
  
    const [openModal, setOpenModal] = useState(true);
  
    const handleDateChange = (date) => {
      setSelectedDate(date);
    };

 /*  if (isLoading){
    return<></>
  } */


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
/* 
  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar'
      }
    });
  
    if (error) {
      console.error('Error signing in with Google:', error.message);
      return;
    }
  
    // Successful sign-in
    console.log('Signed in with Google successfully!');
  } */

/*   async function createCalendarEvent() {
    const event = {
      summary: eventName,
      description: eventDescription,
      start: {
        dateTime: selectedDate.toISOString()
      }
    };
  
    try {
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.provider_token}`
        },
        body: JSON.stringify(event)
      });
  
      if (!response.ok) {
        throw new Error('Failed to create event');
      }
  
      const eventData = await response.json();
      console.log('Event created successfully:', eventData);
      alert('Event Created Successfully');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event');
    }
  } */
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
                <button onClick={() => setOpenModal(true)}>Create Events</button>
                <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>Create Events</Modal.Header>
                <Modal.Body>

                {/* <h2>Hey there {session.user.email}</h2> */}

                <p>Start of your event</p>
                <Datepicker
                value={selectedDate}
                onSelectedDateChanged={handleDateChange}
                />

                <p>Event name</p>
                <input type="text" onChange={(e) => seteventName(e.target.value)} />
                <p>Event description</p>
                <input type="text" onChange={(e) => seteventDescription(e.target.value)} />
                <hr />
                </Modal.Body>
                <Modal.Footer>
                <Button /* onClick={() => createCalendarEvent()} */>Create Calendar Event</Button>
                <Button color="gray" onClick={() => setOpenModal(false)}>Cancel</Button>
                </Modal.Footer>
                </Modal>  

            </div>
            {/* <button onClick={() => googleSignIn()}>Sign In With Google</button> */}
          </>
      </div>
            </div>
        </div>
    </div>
  );
};

export default Calendar;