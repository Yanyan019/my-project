import React,  { useState, useEffect } from 'react'
import Chart from 'chart.js/auto';
import { onValue, ref } from 'firebase/database';
import { getDatabase } from "firebase/database";
import { auth } from "../context/firebaseconfig";
import '../pages/Analytics.css'

const Analytics = () => {

  const [pendingTask, setPendingTask] = useState(0);
  const [completedTaskValue, setCompletedTaskValue] = useState(0);
  const [completedTaskRate, setCompletedTaskRate] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [totalTaskValue, setTotalTaskValue] = useState();

  const [completedTask, setCompletedTask] = useState([
    { day: "Sunday", count: 0 },
    { day: "Monday", count: 0 },
    { day: "Tuesday", count: 0 },
    { day: "Wednesday", count: 0 },
    { day: "Thursday", count: 0 },
    { day: "Friday", count: 0 },
    { day: "Saturday", count: 0 },
  ]);

  const [task, setTask] = useState([])


  const handleMouseEnter = () => {
      let feedbackMessage = '';
      if (completedTaskRate >= 70) {
        feedbackMessage = "You are great and productive! Keep it up!";
      } else if (completedTaskRate >= 50) {
        feedbackMessage = "You're doing well, but there's room for improvement.";
      } else {
        feedbackMessage = "You should do something to catch up.";
      }
      setFeedbackMessage(feedbackMessage);
      setShowFeedback(true);
    };

    const handleMouseLeave = () => {
      setShowFeedback(false);
    };

    useEffect(() => {
        const db = getDatabase();
        const pendingTaskRef = ref(db, 'users/counter/pendingtask');
        const pendingTaskUnsubscribe = onValue(pendingTaskRef, (snapshot) => {
            const data = snapshot.val();
            setPendingTask(data.count);
        });
    
        return () => {
            pendingTaskUnsubscribe();
        };
    }, []);

    useEffect(() => {
        const db = getDatabase();
        const completedTaskRef = ref(db, 'users/counter/completedtask');
        const completedTaskUnsubscribe = onValue(completedTaskRef, (snapshot) => {
            const data = snapshot.val();
            setCompletedTaskValue(data.count);
        });
    
        return () => {
            completedTaskUnsubscribe();
        };
    }, []);
 
    useEffect(() => {
      const db = getDatabase();
      const totalTaskRef = ref(db, 'users/counter/totaltask');
      const unsubscribe = onValue(totalTaskRef, (snapshot) => {
          const data = snapshot.val();
          setTotalTaskValue(data.count);
          
          // Calculate the completion rate
          if (data.count > 0) {
            setCompletedTaskRate(completedTaskValue / (completedTaskValue + pendingTask));
            /* if (completedTaskValue > data.count){
              setCompletedTaskRate(completedTaskValue / (completedTaskValue + pendingTask));
            }
            else {
              setCompletedTaskRate(1.0)
            } */
          }
          else if(completedTaskValue > data.count) {
            setCompletedTaskRate(1.0)
          }
         
      });
  
      return () => {
          unsubscribe();
      };
  }, [completedTaskValue, pendingTask]);
  
  
  
   
useEffect(() => {
    const ctx = document.getElementById('myChart').getContext('2d');
    let date = new Date();
    let dayToday;
    switch(date.getDay()){
        case 0: 
            dayToday = "Sunday";
            break; 
        case 1: 
            dayToday = "Monday";
            break; 
        case 2: 
            dayToday = "Tuesday";
            break; 
        case 3: 
            dayToday = "Wednesday";
            break; 
        case 4: 
            dayToday = "Thursday";
            break; 
        case 5: 
            dayToday = "Friday";
            break; 
        case 6: 
            dayToday = "Saturday";
            break; 
    }
    
    const sunday = completedTask.find(sunday=>sunday.day===dayToday)
    const monday = completedTask.find(monday=>monday.day===dayToday)
    const tuesday = completedTask.find(tuesday=>tuesday.day===dayToday)
    const wednesday = completedTask.find(wednesday=>wednesday.day===dayToday)
    const thursday = completedTask.find(thursday=>thursday.day===dayToday)
    const friday = completedTask.find(friday=>friday.day===dayToday)
    const saturday = completedTask.find(saturday=>saturday.day===dayToday)
    
    if (sunday)
        console.log( sunday.count=completedTaskValue)
    else if (monday)
        monday.count=completedTaskValue;
    else if (tuesday)
        tuesday.count=completedTaskValue;
    else if (wednesday)
        wednesday.count=completedTaskValue;
    else if (thursday)
        thursday.count=completedTaskValue;
    else if (friday)
        friday.count=completedTaskValue;
    else if (saturday)
        saturday.count=completedTaskValue;

    const labels = completedTask.map(item => item.day);
    const data = completedTask.map(item => item.count);
  
    const existingChart = Chart.getChart('myChart');
    if (existingChart) {
      existingChart.destroy(); // Destroy the existing chart
    }
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Completed Tasks',
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }, [completedTask]); 


  const fetchTasks = () => {
    const db = getDatabase();
    const tasksRef = ref(db, 'users/counter');
    let fetchedTasks = [];

    const unsubscribe = onValue(tasksRef, (snapshot) => {
        const data = snapshot.val();
        for(let id in data){
            let task = data[id];
            fetchedTasks.push({
                name: task.name,
                description: task.description,
                event: task.event,
                duedate: new Date(task.duedate) // Assuming dueDate is stored as a timestamp
            });
        }
        setTask(fetchedTasks);
    });

    return unsubscribe;
};

useEffect(() => {
    const unsubscribe = fetchTasks();
    return () => {
        unsubscribe();
    };
}, []);

  const filterTasks = (type) => {
    const now = new Date();
    const weekLater = new Date();
    weekLater.setDate(now.getDate() + 7);

    if (type === 'today') {
      return task.filter(task => task.duedate.toDateString() === now.toDateString());
    } else if (type === 'nextWeek') {
      return task.filter(task => task.duedate >= now && task.duedate <= weekLater);
    } else if (type === 'nextMonth') {
      return task.filter(task => task.duedate.getMonth() === now.getMonth() + 1);
    }
  };

  return (
    <div className='analytics' style={{margin:'10px',width:'100%',alignItems:'center',justifyContent:'center',display:'flex',flexDirection:'column'}}>

          <div className='top' style={{display:'flex',alignItems:'center',marginBottom:'15px',gap:'1rem'}}>
              <div className='bg-[#15161a] flex-col py-[40px] px-[30px] gap-[15px] rounded-[20px] h-[30px] w-[100%] shadow-inner  '>
                <h1 className='text-[50px] leading-[1px] px-[300px]'>{completedTaskValue}</h1>
                <h1 className='text-[30px] leading-[9px]'>Completed Task</h1>  
            </div>
            <div className='bg-[#15161a] flex-col py-[40px] px-[30px] gap-[15px] rounded-[20px] h-[30px] w-[100%] shadow-inner '>
                <h1 className='text-[50px] leading-[1px] px-[300px] '>{pendingTask}</h1>
                <h1 className='text-[30px] leading-[9px]'>Pending Task</h1>
            </div>
          </div>
          <div className='graph-bottom' style={{display:'flex',gap:'1rem'}}>

          <div className='bg-[#15161a] flex-col py-[40px] px-[30px] gap-[15px] rounded-[20px] h-[auto] w-[1100px] shadow-inner '>
              <h1 className='text-[20px] leading-[9px]'>Graph</h1>
              <canvas id="myChart"></canvas>
          </div>

          {/* <div className='bottom' style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            <div className='bg-[#15161a] flex-col py-[40px] px-[30px] gap-[15px] rounded-[20px] h-[230px] w-[300px] shadow-inner '>
              <h1 className='text-[20px] leading-[9px]'>Task in Next 7 Days</h1> {filterTasks('nextMonth').map((item, index) => (
                  <ul key={index}>
                      <li>
                          <strong>Event Name:</strong> {item.event}<br />
                      </li>
                  </ul>
              ))}
          </div> */}
          <div className='bg-[#15161a] flex-col py-[40px] px-[30px] gap-[15px] rounded-[20px] h-[200px] w-[290px] shadow-inner'>
              <h1 className='text-[20px] leading-[9px] m-1'>Completion Rate</h1>
              <div className="circular-progress" style={{ position: "relative", width: "100px", height: "100px" }}>
                  <svg className="circle" width="500" height="500 ">
                      <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#f1e092"
                          strokeWidth="8"
                          onMouseEnter={handleMouseEnter} 
                          onMouseLeave={handleMouseLeave}
                      />
                      <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#4caf50"
                          strokeWidth="8"
                          strokeDasharray={`${completedTaskRate * 360}, 360`}
                          transform="rotate(-90 50 50)"
                          onMouseEnter={handleMouseEnter} 
                          onMouseLeave={handleMouseLeave}
                      />
                      <text x="50" y="55" textAnchor="middle" fontSize="20" onMouseEnter={handleMouseEnter} 
                        onMouseLeave={handleMouseLeave}>
                        {Math.round(completedTaskRate * 100)}%
                      </text>
                  </svg>
                  {showFeedback && (
                      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", height: "50px", width: "200px", padding: "5px", boxShadow: "0 2px 5px rgba(0,0,0,0.2)" }}>
                          {feedbackMessage}
                      </div>
                  )}
              </div>
          </div>
        </div>
        </div>
           
  )
}

export default Analytics;