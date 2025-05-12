import logo from '../../Resources/MMixerLogo2.png';
import { Link } from 'react-router';
import './Nav.css'
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import LogOutUser from '../../API/User/LogOutUser';

function Nav({posts, setFilteredPosts, setCurrentUser, setIsAuthenticated}){
    const [searchValue, setSearchValue] = useState("");
    const [isEmpty, setIsEmpty] = useState(true);

        
    function Search() {
        
        setFilteredPosts(posts.filter(post => post.content.toLowerCase().includes(searchValue.toLowerCase()) || isEmpty));
    }
    
    function handleKeyPress(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          Search();
        }
      }

    return(
        <div className="navigation">
            <div className='left_nav'>
                <Link to='/'> <img src={logo} alt='logo'/> </Link>
                <div className="input-group">
                    <input 
                    onChange={(e) => {
                        setSearchValue(e.target.value);
                        setIsEmpty(e.target.value === "");
                    }} 
                     onKeyPress = {handleKeyPress}
                     value={searchValue}
                    type="text" className="form-control" placeholder="Search..." aria-label="Search..." aria-describedby="basic-addon2"/>
                        <div className="input-group-append">
                            <button className="btn btn-outline-secondary" onClick={() => Search()} 
                            type="button"><i className="bi bi-search-heart"></i></button>
                        </div>
                    </div>
                </div>
            <div className='right_nav'>
                <Link to=''> <Button variant="outline-light">Feed</Button> </Link>
                <Link to='/listen'> <Button variant="outline-light">Listen</Button></Link>
                <Link to='/account'> <Button variant="outline-light">Account</Button></Link>
                <Button onClick={() => LogOutUser(setCurrentUser, setIsAuthenticated)} variant="outline-danger">Log out</Button>
            </div>
        </div>

    );
}

export default Nav;