import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { db, auth } from '../lib/firebase';

const AdminDashboard = () => {
    const [request, setRequest] = useState({
        location: '',
        description: '',
        group: '',
        rhesus: '',
        expiration: ''
    });

    const [admin, setAdmin] = useState({});
    const [newRequest, setNewRequest] = useState(false);
    const history = useHistory();

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                db.collection('admin')
                    .where('email', '==', user.email)
                    .get()
                    .then((querySnapshot) => {
                        setAdmin(querySnapshot.docs[0].data())
                    })
            } else {
                history.push('/login')
            }
        })
    }, [admin, history])

    const createRequest = () => {
        setNewRequest(true);
    }

    const handleChange = (e) => {
        setRequest({ ...request, [e.target.id]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setNewRequest(false);
        //add request to db (plus status)
        //filter viable donors
        //send out requests
    }

    return (
        <main>
            <h1>Dashboard</h1>
            <section className="profile"></section>

            <section className="requests">
                <div className="requests__running">
                    <h2>Current Requests</h2>
                    {/*map data from firestore*/}
                    <div className="requests__running-item">
                        <p>Location:</p>
                        <p>Description:</p>
                        <p>Valid until:</p>
                        <p>Interested Donors:</p>
                        {/*show donor appointments*/}
                        {/*confirm due appointments*/}
                    </div>
                    <button onClick={createRequest}>New Request</button>
                </div>

                {newRequest && (
                    <div className="requests__new">
                        <h2>Create New Request</h2>
                        <form action="">
                            <label htmlFor="location">Location</label>
                            <input type="text" id="location" onChange={handleChange} required aria-required="true"/>

                            <label htmlFor="description">Description</label>
                            <input type="text" id="description" onChange={handleChange} required aria-required="true"/>

                            <label htmlFor="group">Blood Group</label>
                            <select id="group" onChange={handleChange} required aria-required="true">
                                <option value=""></option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="AB">AB</option>
                                <option value="O">O</option>
                            </select>

                            <label htmlFor="rhesus">Rhesus Factor</label>
                            <select id="rhesus" onChange={handleChange} required aria-required="true">
                                <option value=""></option>
                                <option value="positive">+</option>
                                <option value="negative">-</option>
                            </select>

                            <label htmlFor="expiration">Expires by</label>
                            <input type="datetime-local" id="expiration" onChange={handleChange} required aria-required="true"/>
                            <button onClick={handleSubmit}>Submit</button>
                        </form>
                    </div>
                )}
            </section>

            <section className="history"></section>
        </main>
    )
}

export default AdminDashboard;