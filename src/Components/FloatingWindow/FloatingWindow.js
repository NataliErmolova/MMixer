import { useState, useEffect, useRef } from 'react';
import './FloatingWindow.css'
// import The1975 from '../../Resources/1975PFP.jpg';


function FloatingWindow({nowPlaying}){
    const [isPaused, setIsPaused] = useState(false);
    const [widgetOpen, setWidgetOpen] = useState(false);
    const [titleTooLong, setTitleTooLong] = useState(false);
    const [youTubeUrl, setYouTubeUrl] = useState();

    const [userInteracted, setUserInteracted] = useState(false);
    const audioRef = useRef(null);

    console.log(nowPlaying.audio_url)

    useEffect(() => {
        const handleUserInteraction = () => setUserInteracted(true);
        window.addEventListener('click', handleUserInteraction, { once: true });
        window.addEventListener('keydown', handleUserInteraction, { once: true });
    
        return () => {
            window.removeEventListener('click', handleUserInteraction);
            window.removeEventListener('keydown', handleUserInteraction);
        };
    }, []);

    useEffect(()=>{
            if(nowPlaying?.title?.length > 24){
                setTitleTooLong(true);
            }else{
                setTitleTooLong(false);
            }
    },[nowPlaying])

    useEffect(() => {
        if (nowPlaying?.audio_url) {
            // Check if the URL is a YouTube link
            const isYouTube = nowPlaying.audio_url.includes("youtube.com/watch?v=");
            if (isYouTube) {
                // Extract the video ID from the URL
                const videoId = nowPlaying.audio_url.split("v=")[1].split("&")[0];
                setYouTubeUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1`);
            }
        }
    }, [nowPlaying]);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio && nowPlaying?.audio_url) {
            audio.pause(); // Stop current playback first
            audio.src = nowPlaying.audio_url;
            audio.load();
    
            const handleCanPlay = () => {
                if (!isPaused && userInteracted) {
                    audio.play().catch(err => {
                        console.error("Play failed:", err);
                    });
                }
            };
    
            audio.addEventListener('canplaythrough', handleCanPlay, { once: true });
    
            return () => {
                audio.removeEventListener('canplaythrough', handleCanPlay);
            };
        }
    }, [nowPlaying?.audio_url, isPaused, userInteracted]);

    useEffect(() => {
        if (audioRef.current && userInteracted) {
            if (!isPaused) {
                audioRef.current.play().catch(err => {
                    console.error('Play failed:', err);
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPaused, userInteracted]);

    return(
        <div className={ widgetOpen ? "FloatingWindowOpen" : "FloatingWindow"}>
            <div className="toggle-window">
                <button onClick={(() => setWidgetOpen(!widgetOpen))}><i className="bi bi-disc-fill"></i>Player</button>
            </div>
            <div className="mini-player">
                {nowPlaying ? (
                    <div className="mini-player-content">
                        <img
                        className="mini-player-thumbnail"
                        src={nowPlaying.thumbnail_url}
                        alt={nowPlaying.title}
                        />
                        <div className="mini-player-details">
                            <div className={titleTooLong ? 'scroll-title' : ''}>
                                <strong className="mini-player-title">{nowPlaying.title}</strong>
                            </div>
                        </div>
                        <span className="mini-player-artist">{nowPlaying.artist}</span>
                    </div>
                    ) : (
                    <p className="mini-player-empty">No song playing</p>
                )}
                <div className='mini-player-buttons'>
                    <button><i class="bi bi-skip-start-fill"></i></button>
                    <button onClick={() => setIsPaused(!isPaused)}><i className={isPaused ? "bi bi-caret-right-fill" : "bi bi-pause-fill" }></i></button>
                    <button><i class="bi bi-skip-end-fill"></i> </button>
                    {youTubeUrl ? (
                        <iframe
                            width="100%"
                            height="100%"
                            src={youTubeUrl}
                            frameBorder="0"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            title={nowPlaying.title}
                        ></iframe>
                    ) : (
                        <p>No YouTube video found</p>
                    )}
                </div>
                <hr/>
            </div>
        </div>
    )
};

export default FloatingWindow;