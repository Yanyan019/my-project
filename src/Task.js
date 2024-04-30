import "./Task.css";
import React, { useState, useEffect } from "react";

import { db } from "./context/firebaseconfig";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Modal } from "flowbite-react";
import { RiDeleteBin6Line } from "react-icons/ri";
/* import { FaRegEdit } from "react-icons/fa"; */
import { IoIosAdd } from "react-icons/io";


function Task() {
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newPriority, setNewPriority] = useState(""); //New input
  const [newCategory, setNewCategory] = useState(""); //New input
  const [categories, setCategories] = useState([
    "Outdoor",
    "Fitness",
    "Academics",
    "Personal",
    "Birthdays",
  ]);//New input

  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "users");

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
    await addDoc(usersCollectionRef, {name: newName, description: newDesc, date: newDate, priority: newPriority, category: newCategory});
    setUsers([
      ...users,
      { eventName: newName, eventDesc: newDesc, eventDate: newDate     },
    ]);
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
      window.alert("Task deleted successfully!");
    }
  };

  /*const handleCustomCategoryChange = (e) => {
      setCustomCategory(e.target.value);
    };
  
    const handleAddCustomCategory = () => {
      if (customCategory.trim() !== "" && !categories.includes(customCategory)) {
        setCategories([...categories, customCategory]);
        setNewCategory(customCategory);
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
    };*/

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
        return "gray";
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
        <h1>My Task</h1>
        <button onClick={() => setOpenModal(true)}>
          <IoIosAdd />
          Create Task
        </button>
        <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
          <Modal.Header>Create Task</Modal.Header>
          <div className="toggle-list">
            <label>Title </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <label>Description </label>
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
            <label>Set Date </label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
            <fieldset>
              <legend>Priority:</legend>
              <div className="radio-group">
                {/* Priority radio buttons */}
                <label>
                  <input
                    type="radio"
                    value="no-priority"
                    checked={newPriority === "no-priority"}
                    onChange={(e) => setNewPriority(e.target.value)}
                  />
                  <span style={{ color: getPriorityColor("no-priority") }}>
                    No Priority
                  </span>
                </label>
                <label>
                  <input
                    type="radio"
                    value="low-priority"
                    checked={newPriority === "low-priority"}
                    onChange={(e) => setNewPriority(e.target.value)}
                  />
                  <span style={{ color: getPriorityColor("low-priority") }}>
                    Low Priority
                  </span>
                </label>
                <label>
                  <input
                    type="radio"
                    value="medium-priority"
                    checked={newPriority === "medium-priority"}
                    onChange={(e) => setNewPriority(e.target.value)}
                  />
                  <span style={{ color: getPriorityColor("medium-priority") }}>
                    Medium Priority
                  </span>
                </label>
                <label>
                  <input
                    type="radio"
                    value="high-priority"
                    checked={newPriority === "high-priority"}
                    onChange={(e) => setNewPriority(e.target.value)}
                  />
                  <span style={{ color: getPriorityColor("high-priority") }}>
                    High Priority
                  </span>
                </label>
              </div>
            </fieldset>
            <fieldset>
              <legend>Category:</legend>
              <div className="radio-group">
                {/* Category radio buttons */}
                {categories.map((cat) => (
                  <label key={cat}>
                    <input
                      type="radio"
                      value={cat}
                      checked={newCategory === cat}
                      onChange={() => setNewCategory(cat)}
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
          <Modal.Footer>
            <div className="button-footer">
              <button
                onClick={createUser}
                style={{ backgroundColor: "#00b13e" }}
              >
                Submit
              </button>
              <button onClick={() => setOpenModal(false)}>Cancel</button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>

      <div className="userlist">
        <table className="task-table">
          <thead>
            <tr>
              <th>Event Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Priority</th>
              <th>Category</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.eventName}</td>
                <td>{user.eventDesc}</td>
                <td>{user.eventDate}</td>
              {/*   <td>{user.eventPriority}</td>
                <td>{user.eventCategory}</td> */}
                <td>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="delete-button"
                  >
                    <RiDeleteBin6Line />
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
