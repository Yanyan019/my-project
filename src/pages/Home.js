import React from 'react';
import './Home.css';

const Home = () => {
    return(
        <div className='container-overview'>
            <div className='calendars'>Calendar</div>
            <div className='todos'>todo</div>
            <div className='todo'>Comments</div>
            <div className='tasks'>task</div>
        </div>
    )
}

export default Home;