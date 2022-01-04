import React, { useState } from "react";
import { Link, useHistory } from 'react-router-dom';
import { auth } from '../lib/firebase';

const Login = () => {
    const [user, setUser] = useState({
        email: '',
        password: ''
    });
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const history = useHistory();

    const handleChange = (e) => setUser({ ...user, [e.target.id]: e.target.value });

    const handleClick = (e) => {
        e.preventDefault();

        auth.signInWithEmailAndPassword(user.email, user.password)
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorCode === 'auth/wrong-password') {
                    setPasswordError(errorMessage);
                } else if (errorCode === 'auth/user-not-found') {
                    setEmailError(errorMessage);
                } else {
                    alert(errorMessage);
                }
                console.log(error);
            })

        auth.onAuthStateChanged((user) => {
            if (user) {
                history.push('/dashboard')
            } else {
                console.log('not user')
            }
        })
    }


    return (
        <main className="auth-page">
            <h1 className="heading__auth">Sign In</h1>

            <form action="">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" onChange={handleChange} required aria-required="true" />
                <p>{emailError}</p>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" onChange={handleChange} required aria-required="true" />
                <p>{passwordError}</p>
                <Link to="/reset-password" className="link light">Forgot Password?</Link>
                <button onClick={handleClick}>Log In</button>
            </form>
            <p>Don't have an account?<Link to="/register" className="link bold"> Sign Up</Link></p>
        </main>
    )
}

export default Login;