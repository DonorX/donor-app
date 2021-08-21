import React from "react";
import { Link } from 'react-router-dom';

const Login = () => (
    <main className="auth-page">
        <h1 className="heading__auth">Sign In</h1>

        <form action="">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" required aria-required="true" />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" required aria-required="true" />
            <Link to="/reset-password" className="link light">Forgot Password?</Link>
            <button>Log In</button>
        </form>
        <p>Don't have an account?<Link to="/register" className="link bold"> Sign Up</Link></p>
    </main>
)

export default Login;