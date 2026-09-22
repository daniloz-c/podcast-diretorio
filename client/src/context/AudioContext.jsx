import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [podcastInfo, setPodcastInfo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const playEpisode = (episode, podcast) => {
    const audio = audioRef.current;
    
    if (currentEpisode?.id === episode.id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
      return;
    }

    setCurrentEpisode(episode);
    setPodcastInfo(podcast);
    audio.src = episode.enclosureUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(err => {
      console.warn("Audio autoplay blocked or failed:", err);
    });
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio.src) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const seek = (timeSeconds) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = timeSeconds;
      setCurrentTime(timeSeconds);
    }
  };

  return (
    <AudioContext.Provider value={{
      currentEpisode,
      podcastInfo,
      isPlaying,
      currentTime,
      duration,
      playEpisode,
      togglePlayPause,
      seek
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContext);
}
