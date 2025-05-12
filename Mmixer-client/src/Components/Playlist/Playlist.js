import cas from '../../Resources/casPFP.jpg'
import The1975 from '../../Resources/1975PFP.jpg';
import './Playlist.css';


function Playlist(){
    return(
        <div className="Playlist">
            <div className="playlist-top">
                <div className="playlist-image">
                    <img src={cas} alt='cas'/>
                </div>
                <div className='playlist-name'>
                    <p>My Playlist</p>
                </div>
                <div className='edit-playlist'>
                    <button><i className="bi bi-pencil-square"></i>Edit</button>
                </div>
            </div>
            <div className="playlist-content">
                <p>50 songs</p>
                <div className='playlist-song'>
                    <button><img src={cas} alt='cas'/> Song name</button>
                </div>
                <div className='playlist-song'>
                    <button><img src={The1975} alt='1975'/> Song name</button>
                </div>
                <div className='playlist-song'>
                    <button><img src={cas} alt='cas'/> Song name</button>
                </div>
            </div>
        </div>
    )
};

export default Playlist;