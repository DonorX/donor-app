import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import firebase from 'firebase';

const AdminDashboard = () => {
    const [request, setRequest] = useState({
        location: '',
        description: '',
        group: '',
        rhesus: '',
        expiration: new Date(),
        isExpired: false
    });

    const [admin, setAdmin] = useState({});
    const [collectionId, setCollectionId] = useState('');
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
                        setCollectionId(querySnapshot.docs[0].id)
                    })
            } else {
                history.push('/login')
            }
        })
    }, [admin, history])

    const editProfile = () => {
        console.log("Clicked!");
    }

    const createRequest = () => {
        setNewRequest(true);
    }

    const handleChange = (e) => {
        setRequest({ ...request, [e.target.id]: e.target.value })
    }

    const sendRequest = (docId) => {
        db.collection('donors')
            .doc(docId)
            .update({
                requests: firebase.firestore.FieldValue.arrayUnion(request)
            })
            .catch((error) => {
                console.log(error)
                // throw new Error(error)
            });
    }

    const filterDonors = () => {
        db.collection('donors')
            .where('bloodGroup', '==', request.group)
            .where('rhesus', '==', request.rhesus)
            //filter location too
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    console.log("No users match your request")
                } else {
                    //send out requests
                    querySnapshot.forEach(doc => {
                        sendRequest(doc.id)
                    })
                }
            })
            .catch((error) => {
                console.log(error)
                throw new Error(error)
            });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        //prevent submission if expiry date is invalid
        /*const currentDate = new Date();
        currentDate < request.expiration && setRequest({
            ...request, isExpired : true 
        });*/

        //add request to db
        db.collection('admin')
            .doc(collectionId)
            .update({
                requests: firebase.firestore.FieldValue.arrayUnion(request)
            })
            .catch((error) => {
                console.log(error)
                throw new Error(error)
            });

        //filter viable donors and send out requests
        filterDonors();
        //remove dialog
        setNewRequest(false);
    }

    return (
        <main>
            <h1>Dashboard</h1>
            <section className="profile">
            <h2>User Profile</h2>
                <p>Welcome, {admin.name}.</p>
                <p>Email: {admin.email}.</p>
                <p>Location: {admin.location}.</p>
                <button onClick={editProfile}>Edit Profile</button>
            </section>

            <section className="requests">
                <div className="requests__running">
                    <h2>Current Requests</h2>
                    {/*map data from firestore*/}
                    <div className="requests__running-item">
                        <p>Location:</p>
                        <p>Description:</p>
                        <p>Valid until:</p>
                        {/*show donor appointments*/}
                        <p>Interested Donors:</p>
                        {/*confirm due appointments*/}
                    </div>
                    <button onClick={createRequest}>New Request</button>
                </div>

                {newRequest && (
                    <div className="requests__new">
                        <h2>Create New Request</h2>
                        <form action="">
                            <label htmlFor="location">Location</label>
                            <input type="text" id="location" onChange={handleChange} required aria-required="true" />

                            <label htmlFor="description">Description</label>
                            <input type="text" id="description" onChange={handleChange} required aria-required="true" />

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
                            <input type="datetime-local" id="expiration" onChange={handleChange} required aria-required="true" />
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