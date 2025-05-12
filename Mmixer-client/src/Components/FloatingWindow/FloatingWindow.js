import { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import './FloatingWindow.css';

function FloatingWindow({ nowPlaying, setNowPlaying, recentlyPlayed }) {
    const [isPaused, setIsPaused] = useState(false);
    const [widgetOpen, setWidgetOpen] = useState(false);
    const [titleTooLong, setTitleTooLong] = useState(false);
    const [videoId, setVideoId] = useState(null);
    const playerRef = useRef(null); // Store the player instance

    // Detect if title is too long
    useEffect(() => {
        if(nowPlaying) {
            if(nowPlaying.videoid) {
                setVideoId(nowPlaying.videoid);
            }
            else if(nowPlaying.audio_url) {
                const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)([a-zA-Z0-9_-]{11})/;
                const match = nowPlaying.audio_url.match(regex);
                setVideoId(match ? match[1] : null);
                console.log(match[1]);
            }
            if (nowPlaying?.title?.length > 24) {
                setTitleTooLong(true);
            } else {
                setTitleTooLong(false);
            }
        }
    }, [nowPlaying]);

    // Handle play/pause toggle
    const handlePlayPause = () => {
        if (playerRef.current) {
            if (isPaused) {
                playerRef.current.playVideo(); // Play the video
            } else {
                playerRef.current.pauseVideo(); // Pause the video
            }
            setIsPaused(!isPaused); // Toggle the paused state
        }
    };

    // Handle player readiness
    const handlePlayerReady = (event) => {
        playerRef.current = event.target; // Store the player instance when it's ready
        if (!isPaused) {
            playerRef.current.playVideo(); // Auto-play if it's not paused
        }
    };

function switchSong(dir) {
    if (nowPlaying && recentlyPlayed.length > 0) {
        const changeIndex = dir === "prev" ? -1 : 1;

        const songIndex = recentlyPlayed.findIndex(
            x => x.videoid === nowPlaying.videoid || x.audio_url === nowPlaying.audio_url
        );

        console.log(songIndex);

        const newIndex = (songIndex + changeIndex + recentlyPlayed.length) % recentlyPlayed.length;

        console.log(newIndex);
        console.log(recentlyPlayed[newIndex]);
        setNowPlaying(recentlyPlayed[newIndex]);
    }
}


    return (
        <>
            <div className={widgetOpen ? "FloatingWindowOpen" : "FloatingWindow"}>
                <div className="toggle-window">
                    <button onClick={() => setWidgetOpen(!widgetOpen)}>
                        <i className="bi bi-disc-fill"></i>Player
                    </button>
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
                    <div className="mini-player-buttons">
                        <button onClick={() => switchSong("prev")}><i className="bi bi-skip-start-fill"></i></button>
                        <button onClick={handlePlayPause}>
                            <i className={isPaused ? "bi bi-caret-right-fill" : "bi bi-pause-fill"}></i>
                        </button>
                        <button onClick={() => switchSong("next")}><i className="bi bi-skip-end-fill"></i></button>
                    </div>
                    <hr />
                </div>
            </div>

            {/* ✅ YouTube Player */}
            {videoId && (
                <div style={{ display: widgetOpen ? 'block' : 'none', width: "100%", height: "0", overflow: "hidden" }}>
                    <YouTube
                        videoId={videoId}
                        onReady={handlePlayerReady} // When the player is ready, call handlePlayerReady
                        style={{ display: 'none' }} // Hide the player
                        opts={{
                            height: '0',
                            width: '100%',
                            playerVars: {
                                autoplay: 1,
                                origin: window.location.origin,
                            },
                        }}
                    />
                </div>
            )}
        </>
    );
}

export default FloatingWindow;
