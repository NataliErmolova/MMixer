// import { Dropdown } from "bootstrap";
import './Account.css';
// import Button from 'react-bootstrap/Button';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';

//pfps
import catPFP from '../../Resources/catPFP.jpg';
import hedghehogPFP from '../../Resources/hedgehogPFP.jpg';
import medaNika from '../../Resources/medanikaPFP.jpg';
import catsPFP from '../../Resources/catsPFP.jpg';
import mousePFP from '../../Resources/mousePFP.jpg';

//API
import GetUserData from '../../API/User/GetUserData';
import GetFriendUsers from '../../API/User/GetFriendUsers';

function Account(){

    const [userData, setUserData] = useState(null);
    const [friendUsers, setFriendUsers] = useState(null);
    const profilePictures = [catPFP, hedghehogPFP, medaNika, catsPFP, mousePFP];

    useEffect(() => {
        async function fetchFriends() {
            const data = await GetFriendUsers();
            setFriendUsers(data);
        }
    
        fetchFriends();
    }, []);

    useEffect(() => {
        async function fetchData() {
            const data = await GetUserData();
            if (data) {
                setUserData(data); 
            }
        }
        fetchData();
    }, []);  

    if (!userData) {
        return <div>Loading...</div>;  // ✅ Prevent null access
    }


    return(
        <div className="Account">
            <div className="account-top">
                <div className="personal-card">
                    <div className="profile-picture"><img src={catsPFP} alt="pfp"/></div>
                        <hr></hr>
                    <div className="info">
                        <p className="username">{userData.username}</p>
                        <p className="email">{userData.email}</p>
                    </div>
                </div>
                <div className="categories">
                    <div className="category-item" >
                        <i className="bi bi-bookmark"></i>
                        <span>saved</span>
                    </div>
                    <div className="category-item">
                        <i className="bi bi-heart"></i>
                        <span>likes</span>
                    </div>
                    <div className="category-item">
                        <i className="bi bi-chat"></i>
                        <span>comments</span>
                    </div>
                </div>
            </div>

            <div className="account-friends">
                <span>Friends List:</span>
                <hr/>
                <div className="friends-scroll-row friends-row">
                    <Link to='/account/allfriends'><button className='circle-button'>See All</button></Link>
                    {friendUsers && friendUsers.map((friend, index) => (
                        <div className="friend" key={index}>
                            <button className="profile-button">
                                <img src={profilePictures[index % profilePictures.length]} alt="pfp" />
                            </button>
                            <p>{friend.username}</p>
                            </div>
                    ))}          
                    
                </div>
            </div>
        </div>
    );
}

export default Account;

