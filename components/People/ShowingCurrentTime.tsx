"use client"
import { useEffect, useState } from "react";

const ShowingCurrentTime = () => {
  const [curTime, setCurTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <span>
      {`${curTime.toLocaleTimeString()}`}
    </span>
  )
}

export default ShowingCurrentTime;