import GetFriendUsers from '../../API/User/GetFriendUsers';
import { useEffect, useState } from 'react';
import './AllFriends.css';

//pfps
import catPFP from '../../Resources/catPFP.jpg';
import hedghehogPFP from '../../Resources/hedgehogPFP.jpg';
import medaNika from '../../Resources/medanikaPFP.jpg';
import catsPFP from '../../Resources/catsPFP.jpg';
import mousePFP from '../../Resources/mousePFP.jpg';


function AllFriends(){

    const [friendUsers, setFriendUsers] = useState(null);
    const profilePictures = [catPFP, hedghehogPFP, medaNika, catsPFP, mousePFP];

    useEffect(() => {
        async function fetchFriends() {
            const data = await GetFriendUsers();
            setFriendUsers(data);
        }
    
        fetchFriends();
    }, []);


    return(
        <div>
            <div className="all-friends-page">
                <h2>All Friends</h2>
                <div className="all-friends-friends-container">
                    {friendUsers && friendUsers.map((friend, index) => (
                        <div className="all-friends-friend" key={index}>
                            <button className="all-friends-profile-button">
                                <img src={profilePictures[index % profilePictures.length]} alt="pfp" />
                            </button>
                            <p>{friend.username}</p>
                        </div>
                    ))}
                </div>
            </div> 
    </div>
    )
};

export default AllFriends;