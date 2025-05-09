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

    console.log(nowPlaying)
    console.log(youTubeUrl)
    console.log(audioRef)
    console.log("FloatingWindow rendered");
console.log("nowPlaying:", nowPlaying);
console.log("userInteracted:", userInteracted);
console.log("audio_url:", nowPlaying?.audio_url);

    useEffect(() => {
        const handleUserInteraction = () => setUserInteracted(true);
        window.addEventListener('click', handleUserInteraction, { once: true });
        window.addEventListener('keydown', handleUserInteraction, { once: true });
    
        console.log("User interacted:", userInteracted);
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


//youtube url if the video has videoid
    useEffect(() => {
        if (nowPlaying?.videoid) {
                const videoId = nowPlaying.videoid
                setYouTubeUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1`);
        } else {
            setYouTubeUrl(null);
        }
    }, [nowPlaying]);

//youtube url if the video has audio_id
    useEffect(() => {
        const audio = audioRef.current;
        if(!audio || !nowPlaying || !nowPlaying.audio_url) 
            return;

            audio.pause(); 
            audio.src = nowPlaying.audio_url;
            audio.load();
            console.log("nowPlaying.audio_url:", nowPlaying?.audio_url);
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
        
            console.log("isPaused:", isPaused);
    }, [nowPlaying, isPaused, userInteracted]);

    useEffect(() => {
        if (!audioRef.current || !userInteracted) 
            return;
            
            
            if (!isPaused) {
                audioRef.current.play().catch(err => {
                    console.error('Play failed:', err);
                });
            } else {
                audioRef.current.pause();
            }

            console.log("isPaused:", isPaused);

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
                    <>
                        <audio ref={audioRef} />
                        {nowPlaying?.audio_url ? (
                            null
                        ) : youTubeUrl ? (
                            <iframe
                                width="100%"
                                height="100%"
                                src={youTubeUrl}
                                frameBorder="0"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                                title={nowPlaying?.title}
                            />
                        ) : (
                            <p>No audio or video found</p>
                        )}
                    </>
                </div>
                <hr/>
            </div>
        </div>
    )
};

export default FloatingWindow;