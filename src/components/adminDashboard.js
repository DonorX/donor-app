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
    const [currentRequests, setCurrentRequests] = useState([]);
    const [expiredRequests, setExpiredRequests] = useState([]);

    const history = useHistory();
    let index = 0;

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
                    .catch((err) => {
                        console.log(err)
                    })
            } else {
                history.push('/login')
            }
        })
    }, [admin, history])

    useEffect(() => {
        const requests = admin.requests;
        const currentDate = new Date();

        const checkExpiredRequests = async () => {
            let expiredItems = await requests.filter((item) => {
                return item.isExpired === false
                    && currentDate > item.expiration;
            });

            await expiredItems.forEach((item) => {
                db.collection('admin')
                    .doc(collectionId)
                    .update({
                        [`requests.${item.key}.isExpired`]: "true"
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            })

            filterRequests();
        }

        const filterRequests = () => {
            let currentArray = requests.filter((item) => {
                return item.isExpired === false
            });

            let expiredArray = requests.filter((item) => {
                return item.isExpired === true
            });

            setCurrentRequests(currentArray);
            setExpiredRequests(expiredArray);
        }

        requests && checkExpiredRequests();
    }, [admin.requests, collectionId])


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
                requests: firebase.firestore.FieldValue.arrayUnion({
                    ...request,
                    isAccepted: false,
                    isDeclined: false,
                    isCompleted: false,
                    author: admin.name
                })
            })
            .catch((error) => {
                console.log(error)
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

        //add request to db
        db.collection('admin')
            .doc(collectionId)
            .update({
                requests: firebase.firestore.FieldValue.arrayUnion({ request })
            })
            .catch((error) => {
                console.log(error)
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
                    {currentRequests ? (
                        currentRequests.map((request) => {
                            return (
                                <div className="requests__running-item" key={index += 1}>
                                    <p>Location:{request.location}</p>
                                    <p>Description:{request.description}</p>
                                    <p>Blood Group:{request.group}</p>
                                    <p>Rhesus:{request.rhesus}</p>
                                    <p>Valid until: {request.expiration}</p>
                                    <div className="responses">
                                        <p>Interested Donors:</p>
                                        {/*confirm due appointments*/}
                                        {/*set canceled requests to expired*/}
                                    </div>
                                    <button>Cancel Request</button>
                                </div>
                            )
                        })
                    ) : (
                        <p>No requests at the moment</p>
                    )}
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

            <section className="history">
                {expiredRequests ? (
                    expiredRequests.map((request) => {
                        return (
                            <div className="history-item" key={index += 1}>
                                <p>Location:{request.location}</p>
                                <p>Description:{request.description}</p>
                                <p>Blood Group:{request.group}</p>
                                <p>Rhesus:{request.rhesus}</p>
                                <p>Expired: {request.expiration}</p>
                            </div>
                        )
                    })

                ) : (
                    <p>No expired donation requests yet</p>
                )}
            </section>
        </main>
    )
}

export default AdminDashboard;