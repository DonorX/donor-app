import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { db } from '../lib/firebase';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const Register = () => {
    const [donorDetails, setDonorDetails] = useState({
        name: '',
        email: '',
        age: '',
        genotype: '',
        group: '',
        rhesus: '',
        password: ''
    });
    let history = useHistory();

    //get input text
    const handleChange = (e) => setDonorDetails({ ...donorDetails, [e.target.id]: e.target.value });
    //add text to collection
    const handleClick = (e) => {
        e.preventDefault();

        const auth = getAuth();
        createUserWithEmailAndPassword(auth, donorDetails.email, donorDetails.password)
            .then(
                db.collection('donors').add({
                    name: donorDetails.name,
                    email: donorDetails.email,
                    age: donorDetails.age,
                    genotype: donorDetails.genotype,
                    bloodGroup: donorDetails.group,
                    rhesus: donorDetails.rhesus,
                })
            )
            .then(history.push('/dashboard'))
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
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