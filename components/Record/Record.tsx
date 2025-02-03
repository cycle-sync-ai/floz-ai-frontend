
import { useState, useRef, useEffect } from "react";
// import Audio from 'react-audio'

const Record = ({ audioUrl }) => {

  const [playing, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0);

  const audioRef: any = useRef();

  useEffect(() => {
    if (audioRef.current) {
      playing ? audioRef.current?.play() : audioRef.current?.pause();
    }
  }, [playing])

  useEffect(() => {
    handleTimeUpdate();
  }, [audioRef])

  useEffect(() => {
    setDuration(audioRef.current?.duration);
  }, [audioRef])

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleSeek = (e) => {
    console.log(e.target.value)
    setCurrentTime(e.target.value);
    // audioRef.current?.seekTo(e.target.value)
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };


  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current?.currentTime);
    setDuration(audioRef.current?.duration);
  }

  const durationToTimeString = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration - minutes * 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  }

  return (
    <div className="flex items-center border-2 border-gray-500 rounded-md">
      <div className="grow flex">
        <audio 
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleTimeUpdate}
          >
          <source
            src={audioUrl || `${process.env.NEXT_PUBLIC_OPENAI_URL}/audio/audio1`}
            type="audio/wav"
          ></source>
        </audio>
        <button onClick={playing ? handlePause : handlePlay}>
          {playing ? <svg className="w-4 h-4 m-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
          </svg>
            : <svg className="w-4 h-4 m-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            </svg>
          }
        </button>
        <div className="border-[1px] border-gray-500"></div>
        <input
          className="grow mx-2 h-8 bg-gray-400 
         accent-gray-700"
          type="range"
          min={0}
          max={duration}
          step={0.01}
          value={currentTime}
          onChange={handleSeek}
        />
        <div className="pl-2 pr-4">{durationToTimeString(currentTime)}/{durationToTimeString(duration)}</div>
      </div>
      {/* <PlayButton />
      <div className="none grow-1 h-3 w-full relative rounded-full bg-gray-300 border-1 border-gray-500">
        <div className="top-0 left-0 h-3 rounded-full bg-gray-700 border-1 border-gray-500 w-[70px]">
        </div>
      </div> */}
    </div>
  )
}

export default Record;