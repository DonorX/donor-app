import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const Connect = () => {
    const [detail, setDetail] = useState('');
    //get collection data
    const [donorsCollection] = useCollectionData(db.collection('donors'));

    //get input text
    const handleChange = (e) => setDetail(e.target.value);
    //add text to collection
    const handleClick = () => {
        db.collection('donors').add({
            name: detail,
        });
    }

    return (
        <div>
            <form action="">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" onChange={handleChange} />
                <button onClick={handleClick}>Submit</button>
            </form>
            <div className="donors">
                {donorsCollection &&
                    donorsCollection.map((donor) =>
                        <p>{donor.name}</p>
                    )}
            </div>
        </div>
    )
}

export default Connect;