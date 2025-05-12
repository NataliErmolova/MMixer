import './Listen.css';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import handleListen from '../../API/Listen/handleListen';
import handleRecentlyPlayed from '../../API/Listen/handleRecentlyPlayed';

// import The1975 from '../../Resources/1975PFP.jpg';
import cas from '../../Resources/casPFP.jpg';
import getRecentlyPlayed from '../../API/Listen/getRecentlyPlayed';

function Listen({setNowPlaying, recentlyPlayed, setRecentlyPlayed}){
    const[searchQuery, setSearchQuery] = useState('');
    const[searchResults, setSearchResults] = useState([]);
    const[dropdownResults, setDropdownResults] = useState([]);
    const[isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchData(){
            setIsLoading(true);
            try{
                const loadedRecents = await getRecentlyPlayed();
                setSearchResults(loadedRecents);
                setRecentlyPlayed(loadedRecents);
                console.log("loaded songs",loadedRecents);
            } catch (error){
                console.error("Error loading songs", error)
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [setSearchResults])

    
    

    const handleResults = async (song) => {
        setSearchResults(prev => [...prev, song]);
        setNowPlaying(song);
        setDropdownResults([]);
        console.log(recentlyPlayed)
        

        await handleRecentlyPlayed(song);
    }

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value)
    }

    const handleSearch = async (event) => {
        event.preventDefault();

        if(searchQuery.trim()){
            await handleListen(searchQuery, setDropdownResults);
        }
    }

    


    return(
        <div className="Listen">
            <div className="player">
                <div className="player-top">
                    <div className="search-container">
                        <form onSubmit={handleSearch}>
                            <input
                                placeholder='Search for a song'
                                type='search'
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            <button type="submit"><i className="bi bi-youtube"></i></button>
                        </form>
                        {dropdownResults.length > 0 && (
                            <div className="search-dropdown">
                                {dropdownResults.map((song, index) => (
                                    <div
                                        key={`${song.videoid}-${index}`}
                                        className="search-result-item"
                                        onClick={() => handleResults(song)}
                                    >
                                        <img src={song.thumbnail_url} alt={song.title} />
                                        <div className="search-result-info">
                                            <strong>{song.title}</strong>
                                            <span>{song.artist}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div> 
                </div>
                <hr/>
                <div className='player-choice'>
                    <Link to='./playlist'><button className='player-choice-button'>My<br/>Playlist</button></Link>
                    <Link to=''><button className='player-choice-button'>New<br/>Playlist +</button></Link>
                </div>
                <hr/>
                <div className="recently-played">
                    <span>Recently Played</span>
                    <hr style={{ borderTop: "none" }}/>
                    <div className='recently-played-songs'>  
                      {searchResults.length > 0 ? (
                        searchResults.map((song) => (
                            <div className='recently-played-song' key={song.videoid} onClick={() => setNowPlaying(song)}>
                                <img src={song.thumbnail_url} alt={song.title} className="song-thumbnail" />
                                <div className="song-info">
                                    <strong className="song-title">{song.title}</strong><br />
                                    <span className="song-artist">{song.artist}</span>
                                </div>
                            </div>
                        ))
                      ) : (
                        <p>No results found</p>
                      )}
                    </div>          
                </div>
            </div>   
        </div>
    );
}

export default Listen;