import React, { useEffect, useState } from "react";

const Transcript = ({ transcript: content }) => {

  const [transcript, setTranscript] = useState([]);

  console.log("transcript hereis ");

  const processTranscript = () => {
    const transcriptContent = content || ""
    const conversationData = [];
    transcriptContent.split('\n').forEach((conversationForEach) => {
      const items = conversationForEach.split(':');
      if (items.length > 1) {
        conversationData.push({
          name: items[0],
          content: items[1]
        })
      }
    })
    setTranscript(conversationData);
  }

  useEffect(() => {
    processTranscript();
  }, [content])

  return (
    <div className="flex font-[13px] h-full flex-col space-y-2  mb-[26px] overflow-auto leading-5 shadow-sm p-10">
      {transcript.map((item, index) => (
              <div key={index}>
                <h3 className="text-xl font-bold">{item.name}</h3>
                <p>{item.content}</p>
              </div>
        ))}
    </div>
  )
}

export default Transcript;