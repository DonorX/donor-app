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
    }, [donor,history])

    const handleLogout = () => {
        auth.signOut();
    }

    return (
        <div>
            <p>Welcome, {donor.name}.</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default Dashboard;