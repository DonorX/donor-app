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
    }

    const declineRequest = () => {
        console.log("Clicked!");
    }

    const handleLogout = () => {
        auth.signOut();
    }

    return (
        <main>
            <h1>User Profile</h1>
            
            <section className="profile">
                <h2>Welcome, {donor.name}.</h2>
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
                    <p>Location:</p>
                    <p>Description:</p>
                    <p>Valid until:</p>
                    <span className="requests__buttons">
                        <button onClick={acceptRequest}>Accept</button>
                        <button onClick={declineRequest}>Decline</button>
                    </span>
                </div>
            </section>

            <section className="history"></section>

            <button onClick={handleLogout}>Logout</button>
        </main>
    )
}

export default Dashboard;