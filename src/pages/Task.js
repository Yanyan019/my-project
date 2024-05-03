import "./Task.css";
import React, { useState, useEffect } from "react";
import { db } from "../context/firebaseconfig";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Modal } from "flowbite-react";
import { RiDeleteBin6Line/* ,RiCheckLine  */} from "react-icons/ri";
/* import { FaRegEdit } from "react-icons/fa"; */
import { IoIosAdd } from "react-icons/io";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';


function Task() {
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newPriority, setNewPriority] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const [permission, setPermission] = useState("defalut");

  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "users");

  /* const usersCollectionRefCount = doc(db, 'counter', 'pendingtask');
  const usersCollectionRefComplete = doc(db, 'counter', 'completedtask');

  const usersCollectionRefTotal = doc(db, 'counter', 'totaltask'); */

  const [openModal, setOpenModal] = useState(true);

  const [categories] = useState([
    "Work",
    "Health",
    "Academics",
    "Personal",
  ]);

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(
        data.docs.map((doc) => ({
          id: doc.id,
          eventName: doc.data().name,
          eventDesc: doc.data().description,
          eventDate: doc.data().date,
          eventPriority: doc.data().priority,
          eventCategory: doc.data().category,
        }))
      );
    };

    getUsers();
  }, [usersCollectionRef]);

  const createUser = async () => {
    await addDoc(usersCollectionRef, {
      name: newName,
      description: newDesc,
      date: newDate,
      priority: newPriority,
      category: newCategory,
    });
    setUsers([
      ...users,
      { eventName: newName, eventDesc: newDesc, eventDate: newDate, eventPriority: newPriority, eventCategory: newCategory},
    ]);

    /* updateDoc(usersCollectionRefCount, {
      count:increment(1)
    })

    updateDoc(usersCollectionRefTotal, {
      count:increment(1)
    }) */

    // Clear input fields after creation
    setNewName("");
    setNewDesc("");
    setNewDate("");
    setNewPriority("");
    setNewCategory("");
    setOpenModal(false);
    window.alert("Task created successfully!");
  };

  const deleteUser = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirmed) {
      await deleteDoc(doc(db, "users", id));
      setUsers(users.filter((user) => user.id !== id));
      /* updateDoc(usersCollectionRefCount, {
        count:increment(-1)
      }) */
      window.alert("Task deleted successfully!");
    }
  };

  /* const completeUser = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );


    if (confirmed) {
      await deleteDoc(doc(db, "users", id));
      setUsers(users.filter((user) => user.id !== id));
      updateDoc(usersCollectionRefComplete, {
        count:increment(1)
      })
      updateDoc(usersCollectionRefCount, {
        count:increment(-1)
      })
      window.alert("Task completed successfully!");
    }
  }; */


  // Function to get color based on priority
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

  /*     const markTaskAsDone = (task) => {
      task.completed = true;
      setCompletedTasks([...completedTasks, task]);
      setTasks(tasks.filter((t) => t !== task));
    };
  
    const markTaskAsUndone = (task) => {
      task.completed = false;
      setTasks([...tasks, task]);
      setCompletedTasks(completedTasks.filter((t) => t !== task));
    };
  
    const handleRemoveTask = (task) => {
      if (!task.completed) {
        setTasks(tasks.filter((t) => t !== task));
      } else {
        setCompletedTasks(completedTasks.filter((t) => t !== task));
      }
    }; */


    /* NOTIFICATION */
    useEffect(() => {
      if (Notification.permission !== "granted") {
        Notification.requestPermission().then((perm) => {
          // Handle permission request result if needed
          setPermission(perm);
        });
      } else {
        setPermission(Notification.permission);
      }
    }, []);
  
    useEffect(() => {
      users.forEach((task) => {
        if (task.eventDate && permission === "granted" && !task.notificationSent) {
          const deadline = new Date(task.eventDate);
          // Calculate the time difference in milliseconds between the current time and the deadline
          const timeDifference = deadline.getTime() - Date.now();
          if (timeDifference > 0) {
            // Schedule the notification to appear at the deadline
            const notificationTimer = setTimeout(() => {
              const notificationOptions = {
                title: `Task '${task.eventName}' is past its deadline`,
                body: `Deadline: ${task.eventDate}`,
              };
              // Check if the browser supports notifications
              if ('Notification' in window) {
                // Request permission if not granted
                if (Notification.permission === "granted") {
                  new Notification(notificationOptions.title, notificationOptions);
                }
              }
              // Update task with notification sent flag
              const updatedTask = { ...task, notificationSent: true };
              setUsers(users.map((user) => (user.id === task.id ? updatedTask : user)));
            }, timeDifference);
            // Store the timer ID for cleanup when component unmounts
            return () => clearTimeout(notificationTimer);
          }
        }
      });
    }, [users, permission]);
    
    



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
                  <TextField id="standard-basic" label="Title" variant="standard"  value={newName} onChange={(e) => setNewName(e.target.value)} style={{borderBottom:'1px solid black'}}/>
                  <TextField id="standard-basic" label="Description" variant="standard" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} style={{borderBottom:'1px solid black',backgroundColor:'#f1e092', outline:'none',boxShadow:'none',marginLeft:'20px'}}/>
                </div>
              </Box>
              <input type="datetime-local" value={newDate} onChange={(e) => setNewDate(e.target.value)} style={{backgroundColor:'#f1e092', outline:'none',boxShadow:'none'}}/>
            </div>
            
        <fieldset>
          <div className="radio-group">
            <h1>Priority:</h1>
            <label>
              <input type="radio" value="no-priority" checked={newPriority === "no-priority"} onChange={(e) => setNewPriority(e.target.value)} style={{marginRight:'10px'}}/>
              <span style={{ color: getPriorityColor("no-priority") }}>No Priority</span>
            </label>
            <label>
              <input type="radio" value="low-priority" checked={newPriority === "low-priority"} onChange={(e) => setNewPriority(e.target.value)} style={{marginRight:'10px'}}/>
              <span style={{ color: getPriorityColor("low-priority") }}>Low Priority</span>
            </label>
            <label>
              <input type="radio" value="medium-priority" checked={newPriority === "medium-priority"} onChange={(e) => setNewPriority(e.target.value)} style={{marginRight:'10px'}}/>
              <span style={{ color: getPriorityColor("medium-priority") }}>Medium Priority</span>
            </label>
            <label>
              <input type="radio" value="high-priority" checked={newPriority === "high-priority"} onChange={(e) => setNewPriority(e.target.value)} style={{marginRight:'10px'}}/>
              <span style={{ color: getPriorityColor("high-priority") }}>High Priority</span>
            </label>
          </div>
        </fieldset>
            <fieldset>
              <div className="radio-group">
                <h1>Category:</h1>
                {categories.map((cat) => (
                  <label key={cat}>
                    <input type="radio" value={cat} checked={newCategory === cat}onChange={() => setNewCategory(cat)} style={{marginRight:'10px'}}/>
                    {cat}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
          <Modal.Footer style={{backgroundColor:'#f1e092', borderTop:'1px solid black'}}>
            <div className="button-footer" style={{display:"flex",gap:"1rem"}}>
              <button onClick={createUser}>Submit</button>
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
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.eventName}</td>
                <td>{user.eventDesc}</td>
                <td>{user.eventDate}</td>
                <td>{user.eventPriority}</td>
                <td>{user.eventCategory}</td>
                <td>
                  <button onClick={() => deleteUser(user.id)}className="delete-button">
                  <RiDeleteBin6Line />
                  </button>
                </td>
               {/*  <td>
                  <button onClick={() => completeUser(user.id)}className="delete-button">
                  <RiCheckLine />
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Task;
