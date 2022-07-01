import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { db, auth } from '../lib/firebase';

const Dashboard = () => {
    // const [user, setUser] = useState(false);
    const [donor, setDonor] = useState({});
    const history = useHistory();

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
            } else {
                history.push('/login')
            }
        })
    }, [donor, history])

    const editProfile = () => {
        console.log("Clicked!");
    }

    const acceptRequest = () => {
        console.log("Clicked!");
        //update status in user db (after date schedule)
        // +1 accept in admin db
    }

    const declineRequest = () => {
        console.log("Clicked!");
        //request is removed from dashboard (state change)
        //update status in user db
        // +1 decline in admin db
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
                {/*map data from firestore*/}
                <div className="requests__pending">
                    <p>Location:</p>
                    <p>Description:</p>
                    <p>Valid until:</p>
                    <span className="requests__buttons">
                        <button onClick={acceptRequest}>Accept</button>
                        <button onClick={declineRequest}>Decline</button>
                    </span>
                    {/*if accepted, schedule donation date*/}
                </div>

                <div className="requests__accepted">
                    <h2>Accepted Requests</h2>
                    {/*                        
                        on set date, remind donor 
                        confirm donation 1 day after set date
                        if donation confirmed (on both ends), update status to completed
                        if date missed, but request still valid, option to reschedule or cancel
                        if canceled or request expired, update db status to cancelled
                        remove item if status == canceled or completed 
                    */}
                </div>
            </section>

            <section className="history">
                <h2>Donation History</h2>
                {/*map data from firestore*/}
                <div className="history__item">
                    <p>Location:</p>
                    <p>Description:</p>
                    <p>Donated on:</p>
                </div>
            </section>

            <button onClick={handleLogout}>Logout</button>
        </main>
    )
}

export default Dashboard;