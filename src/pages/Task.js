import "./Task.css";
import React, { useState, useEffect } from "react";

import { db } from "../context/firebaseconfig";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  count,
  FieldValue,
  increment
} from "firebase/firestore";
import { Modal } from "flowbite-react";
import { RiDeleteBin6Line, RiCheckLine} from "react-icons/ri";
/* import { FaRegEdit } from "react-icons/fa"; */
import { IoIosAdd } from "react-icons/io";
import {TextField, Box} from '@mui/material';

function Task() {
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newPriority, setNewPriority] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "users");
  const usersCollectionRefCount = doc(db, 'counter', 'pendingtask');
  const usersCollectionRefComplete = doc(db, 'counter', 'completedtask');

  const usersCollectionRefTotal = doc(db, 'counter', 'totaltask');

  const [openModal, setOpenModal] = useState(true);

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(
        data.docs.map((doc) => ({
          id: doc.id,
          eventName: doc.data().name,
          eventDesc: doc.data().description,
          eventDate: doc.data().date,
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
    });
    setUsers([
      ...users,
      { eventName: newName, eventDesc: newDesc, eventDate: newDate },
    ]);

    updateDoc(usersCollectionRefCount, {
      count:increment(1)
    })

    updateDoc(usersCollectionRefTotal, {
      count:increment(1)
    })
    
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
      updateDoc(usersCollectionRefCount, {
        count:increment(-1)
      })
      window.alert("Task deleted successfully!");
    }
  };

  const completeUser = async (id) => {
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
  };

  /*     const handleCustomCategoryChange = (e) => {
      setCustomCategory(e.target.value);
    };
  
    const handleAddCustomCategory = () => {
      if (customCategory.trim() !== "" && !categories.includes(customCategory)) {
        setCategories([...categories, customCategory]);
        setCategory(customCategory);
        setCustomCategory("");
      }
    };
  
    const handleRemoveCategory = (categoryToRemove) => {
      setCategories(
        categories.filter((category) => category !== categoryToRemove)
      );
      if (category === categoryToRemove) {
        setCategory("");
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

  return (
    <div className="task">
      <div className="header">
        {/* HEADER */}
        <h1>My Task</h1>
        <button onClick={() => setOpenModal(true)}>
          <IoIosAdd/>
          </button>

        {/* MODAL MGA KAILANGAN LAGYAN NG USER*/}
        <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
          <Modal.Header style={{backgroundColor:'#f1e092', borderBottom:'1px solid black'}}>Create Task</Modal.Header>
          <div className="toggle-list" style={{backgroundColor:'#f1e092'}}>
            <div className="input-user">
              <Box component="form" sx={{ '& > :not(style)': {  width: '100%' }, }} noValidate autoComplete="off">
                <div>
                <TextField id="standard-basic" label="Title" variant="standard"  value={newName} onChange={(e) => setNewName(e.target.value)} />
                <TextField id="standard-basic" label="Description" variant="standard" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} style={{backgroundColor:'#f1e092', outline:'none',boxShadow:'none'}}/>
                </div>
              </Box>
              <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} style={{backgroundColor:'#f1e092', outline:'none',boxShadow:'none'}}/>
            </div>
            
            <div className="status">
              <legend>Priority:</legend>
              <div className="radio-group">
                <button>
                  {/* <input type="radio" /> */}
                  <span value="no-priority" checked={newPriority === "no-priority"}onChange={(e) => setNewPriority(e.target.value)} style={{ color: getPriorityColor("no-priority") }}>No Priority</span>
                </button>
                <button>
                  {/* <input type="radio" /> */}
                  <span value="low-priority" checked={newPriority === "low-priority"}onChange={(e) => setNewPriority(e.target.value)} style={{ color: getPriorityColor("low-priority") }}>Low Priority</span>
                </button>
                <button>
                  {/* <input type="radio"/> */}
                  <span value="medium-priority"checked={newPriority === "medium-priority"} onChange={(e) => setNewPriority(e.target.value)} style={{ color: getPriorityColor("medium-priority") }}>Medium Priority</span>
                </button>
                <button>
                  {/* <input type="radio" /> */}
                  <span value="high-priority" checked={newPriority === "high-priority"} onChange={(e) => setNewPriority(e.target.value)} style={{ color: getPriorityColor("high-priority") }}> High Priority</span>
                </button>
              </div>
            </div>
            <div className="Categorys">
                <legend>Categories:</legend>
                <button>Personal</button>
                <button>Work</button>
                <button>Family</button>
            </div>
          </div>
          <Modal.Footer style={{backgroundColor:'#f1e092', borderTop:'1px solid black'}}>
            <div className="button-footer">
              <button onClick={createUser}style={{ backgroundColor: "#00b13e" }}>
                Submit
              </button>
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
              <th></th>
            </tr>
          </thead>
          
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.eventName}</td>
                <td>{user.eventDesc}</td>
               <td>{user.eventDate}</td>
                <td>
                  <button onClick={() => deleteUser(user.id)}className="delete-button">
                  <RiDeleteBin6Line />
                  </button>
                </td>
                <td>
                  <button onClick={() => completeUser(user.id)}className="delete-button">
                  <RiCheckLine />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Task;
