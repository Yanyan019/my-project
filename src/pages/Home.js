import React from 'react';
import './Home.css';

const Home = () => {
    return(
    
         <div className='home-container'>
            <div className='todos'>
                <h1>Calendar</h1>
            </div>
            <div className='todo'>
                <h1>My Task</h1>
            </div>
            <div className='todo'>
                <h1>To Do</h1>
            </div>
        </div>
        
    )
}

export default Home;