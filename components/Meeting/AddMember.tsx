
import { useState, useEffect } from 'react'

import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';


import { createPerson, getPerson, getPersons, getPersonsByOrganization } from "@service/person.service";
import ModalLayout from '@components/ModalLayout';
import { getAllMeetings, getMeeting, getMeetings, updateMeeting } from '@service/meeting.service';
import { useAuthContext } from '@contexts/AuthContext';

import { Meeting } from '@models';
import { useRouter } from 'next/navigation'

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;


const AddMemberLayout = ({ show, setShow, selectedlMemberIds, setSelectedMembersIds, params }) => {

  const [people, setPeople] = useState([]);
  const [selectedPeople, setSelectedPeople] = useState(selectedlMemberIds);


  const [organizationPeople, setOrganizationPeople] = useState([]);
  const [selectedOrganizationPeople, setSelectedOrganizationPeople] = useState(selectedlMemberIds);

  const { user } = useAuthContext();
  useEffect(() => {
    const initialize = async () => {

      const meetings: any = await getAllMeetings({ projectId: params?.projectId ? params?.projectId : '655d220b2128b99ad7088376' });
      console.log(meetings, "=======================");
      const tempPeopleIds = [];

      for (let j = 0; j < meetings.length; j++) {
        if (meetings[j]["members"] !== null && meetings[j]["members"].length > 0) {

          for (let i = 0; i < meetings[j]["members"].length; i++) {
            if (!tempPeopleIds.includes(meetings[j]["members"][i])) {
              tempPeopleIds.push(meetings[j]["members"][i]);
            }
            if (j === meetings.length - 1) {
              setPeople(tempPeopleIds);
            }
          }
        }
      }
      const tempPeople = [];
      for (let i = 0; i < tempPeopleIds.length; i++) {
        tempPeople.push(await getPerson(tempPeopleIds[i]));
        if (i === tempPeopleIds.length - 1) {
          setPeople(tempPeople);
        }
      }
      const tempOrganizationPeople = await getPersonsByOrganization(user?.organization ? user?.organization : "Floz");
      
      setOrganizationPeople([...tempOrganizationPeople.filter(person => !tempPeopleIds.includes(person._id))]);
    }

    initialize();
  }, []);

  useEffect(() => {
    setOrganizationPeople(organizationPeople.filter(person => !selectedPeople.includes(person._id)));
  }, [selectedPeople])

  const handleChange = (event, value) => {
    setSelectedPeople(value);
  }

  const handleOrganizationChange = (event, value) => {
    setSelectedOrganizationPeople(value);
  }



  useEffect(() => {
    setSelectedPeople(people.filter((person) => selectedlMemberIds.includes(person._id)));
  }, [selectedlMemberIds])


  const addMemberInMeeting = async () => {
    const selectedIds = [];
    for (let i = 0; i < selectedPeople.length; i++) {
      selectedIds.push(selectedPeople[i]._id);
      if (i === selectedPeople.length - 1) {
        updateMeeting('655d242b2128b99ad7088381', {
          members: selectedIds,
        });
        setSelectedMembersIds(selectedIds);
      }
    }
    for (let i = 0; i < selectedOrganizationPeople.length; i++) {
      selectedIds.push(selectedOrganizationPeople[i]._id);
      if (i === selectedOrganizationPeople.length - 1) {
        updateMeeting('655d242b2128b99ad7088381', {
          members: selectedIds,
        });
        setSelectedMembersIds(selectedIds);
      }
    }
  }

  return (
    <>
      {
        show ?
          <div className="fixed w-screen h-screen flex flex-col justify-center items-center top-0 left-0 bg-[rgba(0,0,0,0.1)]">
            <div className="w-1/3 h-2/3 bg-white shadow-lg flex flex-col">
              <div className='flex justify-end'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 m-2" onClick={() => setShow(false)}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>

              </div>
              <h1 className="text-2xl font-bold text-center p-4">Add Member</h1>
              <div className="w-full h-1 bg-gray-200"></div>
              <div className="people-list overflow-auto flex flex-col items-center gap-4 pt-8 justify-center p-4">
                {
                  <Autocomplete
                    multiple
                    sx={{width:'90%'}}
                    id="checkboxes-tags-demo"
                    options={people}
                    disableCloseOnSelect
                    value={selectedPeople}
                    getOptionLabel={(option) => option.name}
                    defaultChecked={selectedPeople}
                    onChange={handleChange}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.name + "-" + option.email + "-" + option.role}
                      </li>
                    )}
                    style={{ width: 500 }}
                    renderInput={(params) => (
                      <TextField {...params} label="Team Members" placeholder="Select your member" />
                    )}
                  />

                }
                <Autocomplete
                  multiple
                  sx={{width:'90%'}}
                  id="checkboxes-tags-demo"
                  options={organizationPeople}
                  disableCloseOnSelect
                  value={selectedOrganizationPeople}
                  getOptionLabel={(option) => option.name}
                  onChange={handleOrganizationChange}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.name + "-" + option.email + "-" + option.role}
                    </li>
                  )}
                  style={{ width: 500 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Organization Members" placeholder="Select your member" />
                  )}
                />

              </div>
            <div className='flex justify-end mx-8'>
              <button className='p-1 border-[1px] border-gray-500 rounded-md' onClick={() => { addMemberInMeeting(); setShow(false) }}>Add Member</button>
            </div>
            </div>
          </div > : <></>
      }
    </>

  )
}

export default AddMemberLayout;