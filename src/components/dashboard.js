import React, { useState, useEffect } from "react";
import { Link, useHistory } from 'react-router-dom';
import { db, auth } from '../lib/firebase';

const Dashboard = () => {
    const [donor, setDonor] = useState({});
    const history = useHistory();
    const user = auth.currentUser;

    if (user !== null) {
        const email = user.email;
        db.collection('donors')
            .where('email', '==', email)
            .get()
            .then((querySnapshot) => {
                setDonor(querySnapshot.docs[0].data())
                console.log(donor)
            })
    } else {
        history.push('/login')
    }

    return (
        <p>Welcome, User.</p>
    )
}

export default Dashboard;