import React, { Fragment } from 'react';
import { Link} from 'react-router-dom';

const Home = () => (
    <Fragment>
        <p>Welcome Home</p>
        <Link to="/register"> Register </Link>
    </Fragment>
)

export default Home;
