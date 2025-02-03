import React, { useEffect, useState } from 'react';

import ToggleButton from "@components/button/ToogleButton";
import Member from "./Member"
import AddMemberLayout from './AddMember';
import { getMeeting, generateEmail } from '@service/meeting.service';
import { IPerson, Meeting } from '@models';
import { getPerson } from '@service/person.service';

// members component
const MemberList = ({ setGenerateEmail, todolistStr, params }) => {

  // state value
  const [persons, setPersons] = useState<IPerson[]>([])
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("")
  const [selectedPersonId, setSelectedPersonId] = useState(-1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [update, setUpdate] = useState()
  // initial state
  useEffect(() => {

    const initialize = async () => {
      try {
        const meeting: Meeting = await getMeeting(params.meetingId);
        
        setPersons(meeting.members);
        setMemberIds(meeting.members.map(member => member._id));
      } catch (error) {
        console.error('MemberList initialize-getMeetingMember error', error)
      }
    }

    initialize();
  }, [])

  const updateMembers = async() => {
    try {
      let member:IPerson = null;
      const tempPersons = [];
      for(let i = 0; i < memberIds.length; i ++) {
        member = await getPerson(memberIds[i]);
        tempPersons.push(member);
        if(i === memberIds.length - 1) {
          setPersons(tempPersons);
        }
      }
    } catch (error) {
      console.error('MemberList initialize-getMeetingMember error', error)
    }
  }

  useEffect(() => {
    updateMembers();
  }, [memberIds]);

  

  // add the user into the database
  const addMember = async () => {
    if (name.length > 0 && email.length > 0) {
      setIsOpen(false);
      clearInputData();
      // const providerToken = getCookie('p_token')
      // const newUser = await createUser({ name: name, email: email, oAuthToken: providerToken});
      // console.log(newUser);
      // persons.push({ name: name, email: email, role: 'Project Manager' });
      // setPersons([...persons])
    }
  }
  // clear the Input data in the input form
  const clearInputData = () => {
    setName("")
    setEmail("")
  }

  // remove all users in the database
  const removeAllUsers = () => {
    setPersons([])
  }

  // TODO generate a email using summary
  const generateMemberEmail = async (id) => {
    try {
      setIsGenerating(true);
      const email = await generateEmail(params.meetingId, {
        role: persons[id].role,
        name: persons[id].name,
        summary: todolistStr,
      })
      setGenerateEmail(email);
    } catch (error) {
      console.error('MemberList generateMemberEmail error', error)
      setIsGenerating(false)
    } finally {
      setIsGenerating(false)
    }
  }

  const Members = () => {
    return (
      <div>
        {persons && persons.map((member, index) => (
          <Member key={index} index={index} name={member.name} email={member.email} role={member.role} setSelectedPersonId={setSelectedPersonId} generate={generateMemberEmail} />
        ))}
      </div>
    )
  }

  return (
    <>
      <AddMemberLayout show={isOpen} setShow={setIsOpen} selectedlMemberIds={memberIds} setSelectedMembersIds={setMemberIds} params={params} />
      <div className="projects-members TodoList rounded-md mx-2 px-2 flex flex-col h-[25%] bg-white shadow-[0px_4px_4px_rgba(1,1,1,0.5)]">
        <div className="todolist-header flex justify-between w-full p-4 items-center">
          <h2 className="font-bold text-[21px]">Meeting related:</h2>
          <div className="flex items-center gap-4">
            <p className="text-[12px]">Matching by AI</p>
            <ToggleButton />
          </div>
        </div>
        <div className="grow flex flex-col overflow-auto">
          {
            isGenerating ? <div className='grow flex flex-col items-center justify-center'>Generating</div> :
            <Members />
          }
        </div>
        <div className="members-footer flex justify-between px-6 mb-4">
          <button className="text-[13px] text-[#06A59A]  hover:text-[#A8EFEA]" onClick={() => { setIsOpen(true); }}>Add members</button>
          <button className="text-[13px] text-[#06A59A]  hover:text-[#A8EFEA]" onClick={() => removeAllUsers()}>Remove All</button>
        </div>
      </div>
    </>
  )
}

export default MemberList;