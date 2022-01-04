import React, { useState, useEffect } from "react";
import { Link, useHistory } from 'react-router-dom';
import { db, auth } from '../lib/firebase';

const Dashboard = () => {
    const [donor, setDonor] = useState({});
    const history = useHistory();

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                const email = user.email;
                //uid more efficient?
                db.collection('donors')
                    .where('email', '==', email)
                    .get()
                    .then((querySnapshot) => {
                        setDonor(querySnapshot.docs[0].data())
                        console.log(user)
                    })
            } else {
                history.push('/login')
            }
        })
    })

    const handleLogout = () => {
        auth.signOut();
    }

    return (
        <div>
            <p>Welcome, User.</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default Dashboard;