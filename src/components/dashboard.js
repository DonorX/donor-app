import React, { useState, useEffect } from "react";
import { Link, useHistory } from 'react-router-dom';
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

    const handleEdit = () => {
        console.log("Clicked!");
    }

    const handleLogout = () => {
        auth.signOut();
    }

    return (
        <main>
            <section className="profile">
                <h1>Welcome, {donor.name}.</h1>
                <p>Email: {donor.email}.</p>
                <p>Age: {donor.age}.</p>
                <p>Genotype: {donor.genotype}.</p>
                <p>Blood Group: {donor.group}.</p>
                <p>Rhesus Factor: {donor.rhesus}.</p>
                <p>Location: {donor.location}.</p>
                <button onClick={handleEdit}>Edit Profile</button>
            </section>

            <section className="requests"></section>
            <section className="history"></section>
            
            <button onClick={handleLogout}>Logout</button>
        </main>
    )
}

export default Dashboard;