"use client"

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from "react";
import { opendaiApi } from 'api/api'
import { getCookie } from 'cookies-next';
import { sendEmail } from '@service/utils.service';

const MeetingSummary = ({ email, peoples }) => {

  const [emailPrompt, setEmailPrompt] = useState("");
  const [isPolishing, setIsPolishing] = useState(false);
  const [isPeopleListOpen, setIsPeopleListOpen] = useState(false);
  const [peopleList, setPeopleList] = useState(peoples || []);
  const [selectedPeopleList, setSelectedPeopleList] = useState([]);

  useEffect(() => {
    if (email) setEmailPrompt(email);
    if (peoples) setPeopleList(peoples);
  }, [email, peoples]);

  // polish the email
  const polish = async () => {
    try {
      setIsPolishing(true);
      const { data } = await opendaiApi.get('/polish', {
        params: {
          emailPrompt: emailPrompt
        }
      });
      setEmailPrompt(data.result);
    } catch (error) {
      console.error(error);
    }
    setIsPolishing(false)
  }

  // send emial to selected person
  const sendEmailToMembers = async () => {
    try {
      const accessToken = getCookie('p_token');
      const refreshToken = getCookie('r_token');
      if (selectedPeopleList.length > 0) {
        const emails = selectedPeopleList.map(person => person.email)
        const res = await sendEmail(emails, emailPrompt, accessToken, refreshToken);
        if (res) {
          toast.success("Email sent successfully", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
        }
      }
    } catch (error) {
      console.error("Axios error:", error?.response?.data);
      toast.error(error?.response?.data?.message || "Could not send email", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  }

  const handleSelectPeople = (person) => {
    const personIndex = selectedPeopleList.findIndex(p => p._id === person._id);
    if (personIndex === -1) {
      setSelectedPeopleList([...selectedPeopleList, person]);
    } else {
      setSelectedPeopleList(selectedPeopleList.filter((p, index) => index !== personIndex));
    }
  }

  return (
    <div className="meeting-summary relative h-[34%] m-2 px-1 flex flex-col justify-between gap-1 rounded-md bg-white shadow-[0px_4px_4px_rgba(1,1,1,0.5)]">

      <div className="grow summary-content p-2 flex flex-col overflow-auto" >
        <div className='flex justify-between'>
          <h2 className="font-bold">Meeting summary:</h2>
          <div className="flex">
            <h2 className='text-gray-400'>To</h2>
            <div className='rounded-full border-[1px] borrder-gray-600 px-2 mx-2 select-none cursor-pointer' onClick={() => { setIsPeopleListOpen(!isPeopleListOpen) }}>
              Memeber
            </div>

          </div>
        </div>
        {isPolishing ? <div className="flex flex-col justify-center items-center"><div className='text-xl text-gray-600'>Polishing...</div></div> :
          <div className='grow flex flex-col overflow-auto' onClick={() => setIsPeopleListOpen(false)}>
            <textarea className="font-sm leading-5 h-full border-0 focus:border-none focus:outline-none p-1" value={emailPrompt} onChange={(e) => setEmailPrompt(e.target.value)}>
            </textarea>
          </div>}
      </div>
      <div className="summary-footer flex  gap-4 text-[13px] px-5 pb-2 pt-1">
        <button className="text-[#06A59A] w-4/12 border-2 border-gray-300 p-1  rounded-md" onClick={() => polish()}>Polish text</button>
        <button className="rounded-md bg-[#06A59A] w-8/12 text-white p-1" onClick={() => sendEmailToMembers()}>Send email</button>
      </div>
      <>
        {
          isPeopleListOpen ?
            <div
              className='absolute top-8 right-8 min-w-[180px] max-h-[180px] bg-white border-[1px] border-[#dedede] shadow-md rounded-md text-sm overflow-x-hidden overflow-y-auto'>
              <div className='people-list-layout w-full grow flex flex-col justify-start items-start shadow-md'>
                {
                  peopleList ? peopleList.map((person, index) => (
                    <div key={person._id} className='flex gap-2 items-center px-3 py-2 w-full hover:bg-[#06A59A] hover:text-white border-b-[1px] border-[#dedede] cursor-pointer'>
                      <input id={`${person._id}`} type='checkbox' onChange={() => handleSelectPeople(person)} checked={selectedPeopleList.findIndex(p => p._id === person._id) !== -1}></input>
                      <label htmlFor={`${person._id}`} className='whitespace-nowrap cursor-pointer'>{person.name}</label>
                    </div>
                  )) : <></>
                }
                <div className='flex gap-2 justify-end items-center w-full p-2'>
                  <button type='button' className='btn btn-link text-[#06A59A]' onClick={() => { setSelectedPeopleList([]); setIsPeopleListOpen(false); }}>Cancel</button>
                  <button type='button' className='btn btn-link text-[#06A59A]' onClick={() => setIsPeopleListOpen(false)}>Apply</button>
                </div>
              </div>
            </div>
            : <></>
        }
      </>
      
    </div>
  )
}

export default MeetingSummary;

