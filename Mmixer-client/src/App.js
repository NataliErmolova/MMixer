import { BrowserRouter, Route, Routes , Navigate} from 'react-router';
import Nav from './Components/Nav/Nav';
import Body from './Components/Body/Body';
import Listen from './Components/Listen/Listen';
import Account from './Components/Account/Account';
import Playlist from './Components/Playlist/Playlist';
import FloatingWindow from './Components/FloatingWindow/FloatingWindow';
import LogIn from './Components/Login/LogIn';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

import './App.css';
import { useEffect, useState } from 'react';
import PackageJSON from '../package.json';
import AllFriends from './Components/Account/AllFriends';


function App() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  const[nowPlaying, setNowPlaying] = useState([]);


  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  useEffect(() => {
    async function fetchCurrentUser() {
      const url = PackageJSON.API.BaseUrl + PackageJSON.API.CurrUser;

      try{
        const response = await fetch(url, 
          { credentials: 'include',
            method: 'GET'});

        const json = await response.json();

        if(response.ok){
          console.log('user logged in', json);
          setCurrentUser(json);
          setIsAuthenticated(true);
        } else {
          console.log('user not logged in');
          setCurrentUser(null)
          setIsAuthenticated(false);
        }
      }catch (error){
        console.error('error fetching', error)
        setCurrentUser(null);
      }
    }
    fetchCurrentUser();
  }, []);


  return (
    <BrowserRouter>
      <div className={isAuthenticated ? 'app-with-nav' : ''}>
      {isAuthenticated && <Nav posts={posts} setFilteredPosts={setFilteredPosts} setCurrentUser= {setCurrentUser} setIsAuthenticated = {setIsAuthenticated}/>}
      {isAuthenticated && <FloatingWindow
      nowPlaying={nowPlaying} setNowPlaying={setNowPlaying} recentlyPlayed={recentlyPlayed} />}
      <Routes>

      <Route path="/login" element={
          isAuthenticated ? 
            <Navigate to="/" /> : 
            <LogIn setIsAuthenticated={setIsAuthenticated} />
        } />

        <Route path="/" element={
          isAuthenticated ? 
          <>
            <Body
              posts={filteredPosts}
              filteredPosts={filteredPosts}
              setPosts={setPosts}
              setFilteredPosts={setFilteredPosts}
            />
          </> : <Navigate to="/login" />
        }/>

        <Route path="/listen" element={isAuthenticated ? <Listen 
        setNowPlaying={setNowPlaying} recentlyPlayed={recentlyPlayed} setRecentlyPlayed={setRecentlyPlayed} /> : <Navigate to="/login" />} />
        <Route path="/account" element={isAuthenticated ? <Account /> : <Navigate to="/login" />}/>
        <Route path="/account/AllFriends" element={isAuthenticated ? <AllFriends /> : <Navigate to="/login" />}/>
        <Route path="/listen/Playlist" element={isAuthenticated ? <Playlist /> : <Navigate to="/login" />} />


        <Route path="*" element={
          isAuthenticated ? <Navigate to="/" /> : <Navigate to="/login" />
        } />  
        

      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
