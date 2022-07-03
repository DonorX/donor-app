import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { db, auth } from '../lib/firebase';

const Register = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        age: '',
        genotype: '',
        group: '',
        rhesus: '',
        password: '',
        location: ''
    });
    const history = useHistory();
  
    const handleChange = (e) => setUser({ ...user, [e.target.id]: e.target.value });

    const handleClick = (e) => {
        e.preventDefault();

        auth.createUserWithEmailAndPassword(user.email, user.password)
            .then((result)=> {
                db.collection('donors').doc(result.user.uid).set({
                    name: user.name,
                    email: user.email,
                    age: user.age,
                    genotype: user.genotype,
                    bloodGroup: user.group,
                    rhesus: user.rhesus,
                    location: user.location,
                    requests: []
                })
            })
            .then(history.push('/dashboard'))
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
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" onChange={handleChange} required aria-required="true" />

                <label htmlFor="email">Email</label>
                <input type="email" id="email" onChange={handleChange} required aria-required="true" />

                <label htmlFor="age">Age</label>
                <input type="number" id="age" min="18" onChange={handleChange} required aria-required="true" />

                <label htmlFor="genotype">Genotype</label>
                <select id="genotype" onChange={handleChange} required aria-required="true">
                    <option value=""></option>
                    <option value="AA">AA</option>
                    <option value="AS">AS</option>
                    <option value="AC">AC</option>
                    <option value="SS">SS</option>
                    <option value="SC">SC</option>
                </select>

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

export default Register;