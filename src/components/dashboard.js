import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { db, auth } from '../lib/firebase';

const Dashboard = () => {
    // const [user, setUser] = useState(false);
    const [donor, setDonor] = useState({});
    const [isAccepted, setIsAccepted] = useState(false);
    const [isDeclined, setIsDeclined] = useState(false);
    const [reschedule, setReschedule] = useState(false);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [acceptedRequests, setAcceptedRequests] = useState([]);
    const [completedRequests, setCompletedRequests] = useState([]);

    const history = useHistory();
    let index = 0;

    // useEffect(() => {
    //     auth.onAuthStateChanged((user) => {
    //         if (user) {
    //             setUser(true)
    //         } else {
    //             setUser(false)
    //         }
    //     })
    // }, []);

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                db.collection('donors')
                    .where('email', '==', user.email)
                    .get()
                    .then((querySnapshot) => {
                        setDonor(querySnapshot.docs[0].data())
                    })
                    .catch((err) => {
                        console.log(err)
                    });
            } else {
                history.push('/login')
            }
        })
    }, [donor, history])

    useEffect(() => {
        const requests = donor.requests;

        const filterRequests = () => {
            let pendingArray = requests.filter((item) => {
                return item.isExpired === false
                    && item.isAccepted === false
                    && item.isCompleted === false
            });

            let acceptedArray = requests.filter((item) => {
                return item.isExpired === false
                    && item.isAccepted === true
                    && item.isCompleted === false
            });

            let completedArray = requests.filter((item) => {
                return item.isCompleted === true
            });

            setPendingRequests(pendingArray);
            setAcceptedRequests(acceptedArray);
            setCompletedRequests(completedArray);
        }

        requests && filterRequests();
    }, [donor.requests])


    const editProfile = () => {
        console.log("Clicked!");
    }

    const acceptRequest = () => {
        setIsAccepted(true);
        //change db status
    }

    const declineRequest = () => {
        setIsDeclined(true);
        //request is removed from dashboard (and db?)
        //update status in user db
    }

    const scheduleAppointment = () => {
        if (reschedule === true) { setReschedule(false) }
    }

    const handleLogout = () => {
        auth.signOut();
    }

    return (
        <main>
            <h1>Dashboard</h1>

            <section className="profile">
                <h2>User Profile</h2>
                <p>Welcome, {donor.name}.</p>
                <p>Email: {donor.email}.</p>
                <p>Age: {donor.age}.</p>
                <p>Genotype: {donor.genotype}.</p>
                <p>Blood Group: {donor.group}.</p>
                <p>Rhesus Factor: {donor.rhesus}.</p>
                <p>Location: {donor.location}.</p>
                <button onClick={editProfile}>Edit Profile</button>
            </section>

            <section className="requests">
                <h2>Pending Requests</h2>
                <div className="requests__pending">
                    {pendingRequests ? (
                        pendingRequests.map((request) => {
                            return (
                                <div className="requests__pending-item" key={index += 1}>
                                    <p>Location:{request.location}</p>
                                    <p>Description:{request.description}</p>
                                    <p>Blood Group:{request.group}</p>
                                    <p>Rhesus:{request.rhesus}</p>
                                    <p>Valid until: {request.expiration}</p>
                                    <span className="requests__buttons">
                                        <button onClick={acceptRequest}>Accept</button>
                                        <button onClick={declineRequest}>Decline</button>
                                    </span>
                                    {isAccepted && (
                                        <div className="dialog__schedule">
                                            <form action="">
                                                <label htmlFor="book-date">When would you like to make this donation?</label>
                                                <input type="date" id="book-date" />
                                                <button onClick={scheduleAppointment}>Schedule Appointment</button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    ) : (
                        <p>No requests at the moment</p>
                    )}
                </div>

                <div className="requests__accepted">
                    <h2>Accepted Requests</h2>
                    {acceptedRequests ? (
                        acceptedRequests.map((request) => {
                            return (
                                <div className="requests__accepted-item" key={index += 1}>
                                    <p>Location:{request.location}</p>
                                    <p>Description:{request.description}</p>
                                    <p>Valid until: {request.expiration}</p>
                                    <p>Scheduled Donation Date:</p>
                                    <button onClick={() => setReschedule(true)}>Reschedule</button>
                                    {reschedule && (
                                        <div className="dialog__schedule">
                                            <form action="">
                                                <label htmlFor="book-date">When would you like to make this donation?</label>
                                                <input type="date" id="book-date" />
                                                <button onClick={scheduleAppointment}>Schedule Appointment</button>
                                            </form>
                                        </div>
                                    )}

                                    {/*show scheduled date, and option to reschedule/cancel*/}
                                </div>
                            )
                        })
                    ) : (
                        <p>You haven't accepted any requests yet</p>
                    )}
                    {/*                        
                        on set date, remind donor 
                        confirm donation 1 day after set date
                        if donation confirmed (on both ends), update status to completed
                        if date missed, but request still valid, option to reschedule or cancel
                        if canceled or request expired, update db status to cancelled 
                    */}
                </div>
            </section>

            <section className="history">
                <h2>Donation History</h2>
                {completedRequests ? (
                    completedRequests.map((request) => {
                        return (
                            <div className="history-item" key={index += 1}>
                                <p>Location:{request.location}</p>
                                <p>Description:{request.description}</p>
                                <p>Donated on:</p>
                            </div>
                        )
                    })) : (
                    <p>No confirmed donation history</p>
                )}
            </section>

            <button onClick={handleLogout}>Logout</button>
        </main>
    )
}

export default Dashboard;