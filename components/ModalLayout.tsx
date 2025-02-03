
import React from 'react';

const ModalLayout = ({ show: isShow, setShow,  children }) => {
  return (
    <>
      {
        isShow ?
          <div className='fixed w-screen h-screen top-0 left-0 bg-[rgba(0,0,0,0.1)] flex flex-col justify-center items-center'
          onClick={() => {setShow(false)}}>
            {children}
          </div> : <></>
      }
    </>
  );
};

export default ModalLayout;