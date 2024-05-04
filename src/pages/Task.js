import "./Task.css";
import React, { useState, useEffect } from "react";

/* REALTIME DATABASE */
import app from "../context/firebaseconfig";
import { getDatabase, ref, set, push, onValue, remove, update} from "firebase/database";

//COMPONENTS AND ICONS
import { Modal } from "flowbite-react";
import { RiDeleteBin6Line/* ,RiCheckLine  */} from "react-icons/ri";
/* import { FaRegEdit } from "react-icons/fa"; */
import { IoIosAdd } from "react-icons/io";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { MdOutlineDone } from "react-icons/md";
import { CiEdit } from "react-icons/ci";

function Task() {
  let [inputValue1, setInputValue1] = useState("");// EVENT NAME
  let [inputValue2, setInputValue2] = useState("");// EVENT DESCRIPTION
  let [inputValue3, setInputValue3] = useState(new Date());// EVENT DATE

  const [newPriority, setNewPriority] = useState("");// EVENT PRIORITY
  const [newCategory, setNewCategory] = useState("");// EVENT CATEGORY

  const [tasks, setTasks] = useState([]);// PARA SA PAGOUTPUT NG TASK

  const [openModal, setOpenModal] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);

  const [categories] = useState([ "Work", "Health", "Academics", "Personal", ]);

  const clearForm = () => {
    setInputValue1("");
    setInputValue2("");
    setInputValue3(new Date());
    setNewPriority("");
    setNewCategory("");
  };

  /* PARA MALAMAN KUNG NAG SAVE NABA AT MAG SAVE SA DATABASE */
  const saveData = async () => {
    const db = getDatabase(app);
    const newDocRef = push(ref(db, "users/tasks"));
    const deadlineDateTime = new Date(inputValue3).getTime(); // Convert deadline to timestamp
    set(newDocRef, {
      eventName: inputValue1,
      eventDescription: inputValue2,
      eventDate: inputValue3,
      eventPriority: newPriority,
      eventCategory: newCategory,
      deadline: deadlineDateTime // Save deadline as timestamp
    }).then(() => {
      alert("Data saved successfully");
      scheduleNotification(deadlineDateTime); // Schedule notification for deadline
    }).catch((error) => {
      alert("Error: " + error.message);
    });
  };

  const scheduleNotification = (eventDate) => {
    const deadlineTime = new Date(eventDate);
    const currentTime = new Date();
    const timeUntilDeadline = deadlineTime.getTime() - currentTime.getTime();

    if (timeUntilDeadline > 0) {
      setTimeout(() => {
        showNotification(`Task Deadline Reminder: ${inputValue1}`);
      }, timeUntilDeadline);
    }
  };

  /* PARA MAKITA KUNG LUMAGPAS KANA SA DEADLINE */
  const showNotification = (message) => {
    if (Notification.permission === "granted") {
      new Notification("Task Deadline Reminder", { body: message });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("Task Deadline Reminder", { body: message });
        }
      });
    }
  };
    /* PAGSASAVE NG TASK REKTA SA REALTIME DATABASE */
  const handleTaskCompletion = () => {
    const db = getDatabase(app);
    const newDocRef = push(ref(db, "completedTasks"));
    // Assuming you have a way to identify the task to mark as completed
    const completedTaskData = {
      eventName: inputValue1,
      eventDescription: inputValue2,
      eventDate: inputValue3,
      eventPriority: newPriority,
      eventCategory: newCategory,
      completionDate: new Date().toISOString() // Save completion date
    };
    set(newDocRef, completedTaskData)
      .then(() => {
        alert("Task marked as completed");
        notifyTaskCompletion(inputValue1); // Trigger completion notification
      })
      .catch((error) => {
        alert("Error marking task as completed: " + error.message);
      });
  };

  const notifyTaskCompletion = (taskName) => {
    const message = `Task "${taskName}" has been completed!`; // PARA MALAMAN KUNG TAPOS NABA ANG TASK
    showNotification(message);
  };

  /* PARA SA KULAY NG MGA PRIORITY */
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high-priority":
        return "red";
      case "medium-priority":
        return "orange";
      case "low-priority":
        return "green";
      case "no-priority":
        return "black";
      default:
        return "gray";
    }
  };

  /* PAGKUHA NG DATA SA REALTIME DATABASE */
  useEffect(() => {
    const db = getDatabase(app);
    const tasksRef = ref(db, 'users/tasks');
    onValue(tasksRef, (snapshot) => {
      const tasksData = snapshot.val();
      if (tasksData) {
        const tasksArray = Object.entries(tasksData).map(([key, value]) => ({
          id: key, // Include the task ID
          ...value // Include other task data
        }));
        setTasks(tasksArray);
      } else {
        setTasks([]);
      }
    });
  }, []);


  const handleTaskDelete = (taskId) => {
    const db = getDatabase(app);
    const taskRef = ref(db, `users/tasks/${taskId}`);
    remove(taskRef)
      .then(() => {
        alert("Task deleted successfully");
      })
      .catch((error) => {
        alert("Error deleting task: " + error.message);
      });
  };
  
  const handleTaskEdit = (taskId) => {
        const taskToEdit = tasks.find(task => task.id === taskId);
        if (taskToEdit) {
          setInputValue1(taskToEdit.eventName);
          setInputValue2(taskToEdit.eventDescription);
          setInputValue3(taskToEdit.eventDate);
          setNewPriority(taskToEdit.eventPriority);
          setNewCategory(taskToEdit.eventCategory);
          setEditMode(true);
          setEditTaskId(taskId);
          setOpenModal(true);
        }
      };
    
      const updateTask = async () => {
        const db = getDatabase(app);
        const taskRef = ref(db, `users/tasks/${editTaskId}`);
        const deadlineDateTime = new Date(inputValue3).getTime();
        update(taskRef, {
          eventName: inputValue1,
          eventDescription: inputValue2,
          eventDate: inputValue3,
          eventPriority: newPriority,
          eventCategory: newCategory,
          deadline: deadlineDateTime
        }).then(() => {
          alert("Task updated successfully");
          setOpenModal(false);
          setEditMode(false);
          setEditTaskId(null);
          clearForm();
        }).catch((error) => {
          alert("Error updating task: " + error.message);
        });
      };


  return (

    <div className="task">
      <div className="header">
        {/* HEADER */}
        <h1>My Task</h1>
        <button onClick={() => setOpenModal(true)}>
          <IoIosAdd/>Add task</button>

        {/* MODAL MGA KAILANGAN LAGYAN NG USER*/}
        <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
          <Modal.Header style={{backgroundColor:'#f1e092', borderBottom:'1px solid black'}}>Create Task</Modal.Header>
          <div className="toggle-list" style={{backgroundColor:'#f1e092'}}>

            <div className="input-user">
              <Box component="form" sx={{ '& > :not(style)': {  width: '100%' }, }} noValidate autoComplete="off">
                <div className="textfield">
                  <TextField id="standard-basic" label="Title" variant="standard" value={inputValue1} onChange={(e) => setInputValue1(e.target.value)}/>
                  <TextField id="standard-basic" label="Description" variant="standard" value={inputValue2} onChange={(e) => setInputValue2(e.target.value)}/>
                  <input type='datetime-local' value={inputValue3} onChange={(e) => setInputValue3(e.target.value)}/>
                </div>
              </Box>
            </div>
            
        <fieldset>
          <div className="radio-group">
            <h1>Priority:</h1>
            {["no-priority", "low-priority", "medium-priority", "high-priority"].map((priority) => (
          <label key={priority}>
            <input
              type="radio"
              value={priority}
              checked={newPriority === priority}
              onChange={(e) => setNewPriority(e.target.value)}
              style={{ marginRight: '10px' }}
            />
            <span style={{ color: getPriorityColor(priority) }}>{priority}</span>
          </label>
        ))}
          </div>
        </fieldset>
            <fieldset>
              <div className="radio-group">
                <h1>Category:</h1>
                {categories.map((cat) => (
                <label key={cat}>
                  <input type="radio" value={cat} checked={newCategory === cat} onChange={() => setNewCategory(cat)} style={{ marginRight: '10px' }} />
                  {cat}
                </label>
              ))}
              </div>
            </fieldset>
          </div>
          <Modal.Footer style={{backgroundColor:'#f1e092', borderTop:'1px solid black'}}>
            <div className="button-footer" style={{display:"flex",gap:"1rem"}}>
              {editMode ? (
                <button onClick={updateTask}>Update Task</button>
              ) : (
                <button onClick={saveData}>Save Data</button>
              )}
              <button onClick={() => setOpenModal(false)}>Cancel</button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>

      {/* OUTPUT TASK LIST - MAKIKITA SA LABAS NG MODAL*/}
      <div className="userlist">
        <table className="task-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Priority</th>
              <th>Categories</th>
            </tr>
          </thead>
          <tbody className="list-body">
            {tasks.map((task, index) => (
              <tr key={index}>
                <td>{task.eventName}</td>
                <td>{task.eventDescription}</td>
                {task.eventDate && <span>{new Date(task.deadline).toLocaleString()}</span>}
                <td>{task.eventPriority}</td>
                <td>{task.eventCategory}</td>
                {/* Additional task details based on your data structure */}
                <div>
                  <button onClick={handleTaskCompletion}><MdOutlineDone /></button>
                  <button onClick={() => handleTaskDelete(task.id)}>
                    <RiDeleteBin6Line/>
                  </button>
                  <button onClick={() => handleTaskEdit(task.id)}>
                    <CiEdit />
                  </button>
                </div>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Task;
