import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { db, auth } from '../lib/firebase';

const AdminRegister = () => {
    const [admin, setAdmin] = useState({
        name: '',
        email: '',
        password: '',
        location: ''       
    });
    const history = useHistory();
  
    const handleChange = (e) => setAdmin({ ...admin, [e.target.id]: e.target.value });

    const handleClick = (e) => {
        e.preventDefault();

        auth.createUserWithEmailAndPassword(admin.email, admin.password)
            .then((result)=> {
                db.collection('admin').doc(result.user.uid).set({
                    name: admin.name,
                    email: admin.email,
                    location: admin.location,
                    requests: []
                })
            })
            .then(history.push('/adminDashboard'))
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(error);
                alert(errorMessage, errorCode);
            });
    }

    return (
        <div>
            <form action="">
                <label htmlFor="name">Organisation Name</label>
                <input type="text" id="name" onChange={handleChange} required aria-required="true" />

                <label htmlFor="email">Email</label>
                <input type="email" id="email" onChange={handleChange} required aria-required="true" />

                <label htmlFor="name">Location</label>
                <input type="text" id="location" onChange={handleChange} required aria-required="true" />

                <label htmlFor="password">Password</label>
                <input type="password" id="password" onChange={handleChange} required aria-required="true" minLength={6} />

                <button onClick={handleClick}>Sign Up</button>
            </form>
            <p>Already have an account?<Link to="/login" className="link bold">Login</Link></p>
            <Link to="/">Go Home</Link>
        </div>
    )
}

export default AdminRegister;