import React, { useState,useEffect  } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays } from 'date-fns';
import './calendars.css'; // Import CSS file for styling
import PreviousIcon from './PreviousIcon'; // Import SVG icon for previous month
import NextIcon from './NextIcon'; // Import SVG icon for next month
import { Datepicker } from "flowbite-react";
import {  Modal } from "flowbite-react";
import {  FaPlus } from "react-icons/fa6";
import TextField from '@mui/material/TextField';

const Calendar = () => {
    const [gapiInited, setGapiInited] = useState(false);
    const [gisInited, setGisInited] = useState(false);
    const [events, setEvents] = useState([]);
    const [summary, setSummary] = useState('');
    const [description, setDescription] = useState('');
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');
    
    const [currentMonth, setCurrentMonth] = useState(new Date());
  
    const [openModal, setOpenModal] = useState(true);
  
  
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


  useEffect(() => {
    const script1 = document.createElement('script');
    script1.src = 'https://apis.google.com/js/api.js';
    script1.async = true;
    script1.defer = true;
    script1.onload = gapiLoaded;
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://accounts.google.com/gsi/client';
    script2.async = true;
    script2.defer = true;
    script2.onload = gisLoaded;
    document.body.appendChild(script2);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  const gapiLoaded = () => {
    window.gapi.load('client', initializeGapiClient);
  };

  const initializeGapiClient = async () => {
    await window.gapi.client.init({
      apiKey: 'AIzaSyDTMZiIljYgtZ_yBc0S5DYKMsEA2GzNSHc',
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    });
    setGapiInited(true);
    maybeEnableButtons();
  };

  const gisLoaded = () => {
    window.tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: '816670322176-apslmr5hae73keqdv12mnh996dignjbk.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/calendar', // Change to read and write scope
      callback: '',
    });
    setGisInited(true);
    maybeEnableButtons();
  };

  const maybeEnableButtons = () => {
    if (gapiInited && gisInited) {
      document.getElementById('authorize_button').style.visibility = 'visible';
    }
  };

  const handleAuthClick = () => {
    window.tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw (resp);
      }
      /* document.getElementById('authorize_button').innerText = 'Refresh'; */
      alert('Authorization successful!');
      await listUpcomingEvents();
    };

    if (window.gapi.client.getToken() === null) {
      window.tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      window.tokenClient.requestAccessToken({ prompt: '' });
    }
  };

  /* const handleSignoutClick = () => {
    const token = window.gapi.client.getToken();
    if (token !== null) {
      window.google.accounts.oauth2.revoke(token.access_token);
      window.gapi.client.setToken('');
    }
  }; */

  const listUpcomingEvents = async () => {
    let response;
    try {
      const request = {
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime',
      };
      response = await window.gapi.client.calendar.events.list(request);
    } catch (err) {
      document.getElementById('content').innerText = err.message;
      return;
    }

    const events = response.result.items;
    if (!events || events.length === 0) {
      document.getElementById('content').innerText = 'No events found.';
      return;
    }
    setEvents(events);
  };

 /*  const formattedStartDateTime = new Date(startDateTime).toISOString();
const formattedEndDateTime = new Date(endDateTime).toISOString(); */
const createEvent = async () => {
  // Ensure startDateTime and endDateTime are not empty

  if (!startDateTime || !endDateTime) {
    console.error('Start date/time and end date/time are required.');
    return;
  }
  // Parse the input values as Date objects
  const startDate = new Date(startDateTime);
  const endDate = new Date(endDateTime);
  // Check if the parsed dates are valid

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.error('Invalid date/time format.');
    return;
  }

  // Format the dates according to ISO 8601
  const formattedStartDateTime = startDate.toISOString();
  const formattedEndDateTime = endDate.toISOString();


  // Check if user is authorized before creating event
  if (window.gapi.client.getToken() === null) {
    // User is not authorized, show alert and return
    alert('Please authorize before creating an event.');
    return;
  }

  // Create the event object with formatted dates and times
  const event = {
    'summary': summary,
    'description': description,
    'start': {
      'dateTime': formattedStartDateTime,
    },
    'end': {
      'dateTime': formattedEndDateTime,
    },
  };

  try {
    const response = await window.gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': event,
    });
    console.log('Event created:', response.result);
    alert('Event created successfully!');
    await listUpcomingEvents();
  } catch (err) {
    console.error('Error creating event:', err);
  }
};



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
                      {/* <button id="signout_button" onClick={handleSignoutClick} style={{ visibility: 'hidden' }}>Sign Out</button> */}
                        <TextField id="standard-basic" label="Title" variant="standard" type="text" required value={summary} onChange={(e) => setSummary(e.target.value)} />
                        <TextField id="standard-basic" label="Description" variant="standard" type="text"  required value={description} onChange={(e) => setDescription(e.target.value)} />
                        <label>Start Event</label>
                        <input type="datetime-local" required value={startDateTime} onChange={(e) => setStartDateTime(e.target.value)} />
                        <label>Start Event</label>
                        <input type="datetime-local" required value={endDateTime} onChange={(e) => setEndDateTime(e.target.value)} />
                  </div>
                
                </Modal.Body>
                <Modal.Footer style={{backgroundColor:'#f1e092', borderTop:'1px solid black'}}>
                  <div className='button-footers' style={{display:'flex', gap:'1rem'}}>
                    <button onClick={createEvent}>Create Event</button>
                    <button onClick={() => setOpenModal(false)} >Cancel</button>
                    <button id="authorize_button" onClick={handleAuthClick}>Authorize</button>
                  </div>
                </Modal.Footer>
                </Modal>
               {/* Display Events */}
                  {/* <div className="events-container">
                    {events.map((event, index) => (
                      <div key={index} className="event-item">
                        <div className="event-summary">{event.summary}</div>
                        <div className="event-description">{event.description}</div>
                        <div className="event-time">
                          {format(new Date(event.start.dateTime), 'MMM d, yyyy h:mm aa')} - {format(new Date(event.end.dateTime), 'MMM d, yyyy h:mm aa')}
                        </div>
                      </div>
                    ))}
                  </div> */}
            </div>
          </>
      </div>
            </div>
        </div>
    </div>
  );
};

export default Calendar;