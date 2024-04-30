import './Task.css'
import React, { useState, useEffect } from 'react'

import {db} from '../context/firebaseconfig'
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
  } from "firebase/firestore";
import {  Modal } from "flowbite-react";
import { RiDeleteBin6Line } from "react-icons/ri";
/* import { FaRegEdit } from "react-icons/fa"; */
import { IoIosAdd } from "react-icons/io";

function Task() {
    const [newName, setNewName] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newDate, setNewDate] = useState("");

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
      await addDoc(usersCollectionRef, { name: newName, description: newDesc, date: newDate });
      setUsers([...users, { eventName: newName, eventDesc: newDesc, eventDate: newDate }]);
      // Clear input fields after creation
      setNewName("");
      setNewDesc("");
      setNewDate("");
      setOpenModal(false);
      window.alert("Task created successfully!");
    };

    const deleteUser = async (id) => {
      const confirmed = window.confirm("Are you sure you want to delete this task?");
  
      if (confirmed) {
        await deleteDoc(doc(db, "users", id));
        setUsers(users.filter((user) => user.id !== id));
        window.alert("Task deleted successfully!");
      }
    };


  return (
    <div className="task">
      <div className="header">
                <h1>My Task</h1>
                <button onClick={() => setOpenModal(true)}><IoIosAdd />Create Task</button>
                <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>Create Task</Modal.Header>
                  <div className="toggle-list">
                      <label>Title </label>
                      <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
                      <label>Description </label>
                      <input type="text" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
                      <label>Set Date </label>
                      <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                  </div>
                <Modal.Footer>
                  <div className="button-footer">
                    <button onClick={createUser} style={{backgroundColor: '#00b13e'}}>Submit</button>
                    <button onClick={() => setOpenModal(false)} >Cancel</button>
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
                  <button onClick={() => deleteUser(user.id)} className="delete-button">
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