import React, { useState, useEffect, useRef } from "react";

const UploadComponent = ({ isUpload, setUpload }) => {
  const [highlighted, setHighlighted] = useState(false);
  const [isUploaded, setIsUploaded] = useState(isUpload);

  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const highlight = () => {
    setHighlighted(true);
  };

  const unHighlight = () => {
    setHighlighted(false);
  };

  const handleDrop = (e) => {
    const dt = e.dataTransfer;
    const { files } = dt;
    handleFiles(files);
  };

  const handleFiles = (files) => {
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onloadend = function () {
      setIsUploaded(true);
      setUpload({ fileData: files[0]  });
    };
  };

  useEffect(() => {
    const dropArea = document.getElementById("drop-area");
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      dropArea.addEventListener(eventName, preventDefaults, false);
    });

    ["dragenter", "dragover"].forEach((eventName) => {
      dropArea.addEventListener(eventName, highlight, false);
    });

    ["dragleave", "drop"].forEach((eventName) => {
      dropArea.addEventListener(eventName, unHighlight, false);
    });

    dropArea.addEventListener("drop", handleDrop, false);

    // Cleanup event listeners on component unmount
    return () => {
      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        dropArea.removeEventListener(eventName, preventDefaults, false);
      });

      ["dragenter", "dragover"].forEach((eventName) => {
        dropArea.removeEventListener(eventName, highlight, false);
      });

      ["dragleave", "drop"].forEach((eventName) => {
        dropArea.removeEventListener(eventName, unHighlight, false);
      });

      dropArea.removeEventListener("drop", handleDrop, false);
    };
  }, []); // Empty dependency array means this effect will only run once, similar to componentDidMount
  const hiddenFileInput = useRef(null);

  const handleClick = event => {
    hiddenFileInput.current.click();
  };

  const handleChange = event => {
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onloadend = function () {
      setIsUploaded(true);
      setUpload({ fileData: event.target.files[0] });
    };
  };
  return (

    <div className="h-[227px] w-[100%] mt-[20px] mb-[20px] flex audio-upload-boder" id="drop-area">
      <div className="flex w-[100%] items-center justify-center rounded-bmd rounded-b-md border-gray-400 " >
        <div>
          <div >
            <label htmlFor="fileElem" className="custom-button" />
            <button className="px-[16px] py-[6px] flex items-center rounded-md text-white text-[13px] bg-[#349989]" onClick={handleClick}>
              <svg className="mr-[8px]" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.4249 10.0377H14.5018C14.2556 10.0377 14.0403 10.2839 14.0403 10.4993V13.5764C14.0403 13.8226 13.8249 14.038 13.5787 14.038H3.42488C3.17873 14.038 2.96334 13.8226 2.96334 13.5764V10.4993C2.96334 10.2839 2.74796 10.0377 2.5018 10.0377H1.57873C1.33257 10.0377 1.11719 10.2839 1.11719 10.4993V14.6534C1.11719 15.3303 1.67103 15.8842 2.34796 15.8842H14.6556C15.3326 15.8842 15.8864 15.3303 15.8864 14.6534V10.4993C15.8864 10.2839 15.671 10.0377 15.4249 10.0377ZM8.80954 1.23808C8.62493 1.05345 8.348 1.05345 8.16339 1.23808L4.00954 5.3922C3.82492 5.57682 3.82492 5.85376 4.00954 6.03839L4.65569 6.68459C4.84031 6.86922 5.11723 6.86922 5.30185 6.68459L7.02493 4.9614C7.20954 4.77677 7.57877 4.89986 7.57877 5.1768V11.7003C7.57877 11.9465 7.76339 12.1619 8.00954 12.1619H8.93262C9.17877 12.1619 9.42493 11.9157 9.42493 11.7003V5.20757C9.42493 4.93063 9.73262 4.80754 9.948 4.99217L11.6711 6.71536C11.8557 6.89999 12.1326 6.89999 12.3172 6.71536L12.9634 6.06916C13.148 5.88454 13.148 5.60759 12.9634 5.42297L8.80954 1.23808Z" fill="white" />
              </svg>
              Upload Files</button>
            <input id="fileElem" type="file" onChange={handleChange} ref={hiddenFileInput} style={{ display: 'none' }} />
            <p className="text-center pt-[12px]" >or Drop Files</p>
          </div>
        </div>
      </div>
    </div>

  );
};

export default UploadComponent;
