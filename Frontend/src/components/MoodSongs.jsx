import { useState } from 'react'
import './MoodSongs.css'

const MoodSongs = ({ Songs }) => {

    const [isPlaying, setIsPlaying] = useState(null);

    const handlePlayPause = (index) => {
        if (isPlaying === index) {
            setIsPlaying(null);
        } else {
            setIsPlaying(index);
        }
    };
    console.log("Songs in UI:", Songs);


    return (
        <div className='mood-songs'>
            <h2>Recommended Songs</h2>

            {Array.isArray(Songs) && Songs.length > 0 ? (
                Songs.map((song, index) => (
                    <div className='song' key={index}>
                        <div className="title">
                            <h3>{song.title}</h3>
                            <p>{song.artist}</p>
                        </div>
                        <div className="play-pause-button">
                            {isPlaying === index &&
                                <audio
                                    src={song.audio}
                                    autoPlay
                                    style={{ display: 'none' }}
                                />}
                            <button onClick={() => handlePlayPause(index)}>
                                {isPlaying === index ? (
                                    <i className="ri-pause-line"></i>
                                ) : (
                                    <i className="ri-play-circle-fill"></i>
                                )}
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No songs to show yet</p>
            )}
        </div>

    )
    console.log("Songs received in MoodSongs:", Songs);
}
export default MoodSongs