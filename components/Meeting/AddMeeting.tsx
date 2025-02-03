import React, { useState, Fragment, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { ChevronRightIcon } from "@heroicons/react/20/solid";
import moment, { Moment } from "moment";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterMoment } from '@mui/x-date-pickers-pro/AdapterMoment';
import { DateCalendar, StaticDatePicker, DatePicker, TimePicker } from "@mui/x-date-pickers";

import { Checkbox, ListItemText, OutlinedInput } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import IconSearch from "@components/icons/IconSearch";
import { getProjects } from "@service/project.service";
import { getPersons, getPersonsByOrganization } from "@service/person.service";
import { createMeeting } from "@service/meeting.service";
import { useAuthContext } from "@contexts/AuthContext";
import { createEvent } from "@service/event.service";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const AddMeeting = ({
    children,
    providerToken,
    userId,
    projectId,
    onNewMeeting
}: {
    children: React.ReactNode;
    providerToken?: string;
    userId?: string;
    projectId?: string;
    onNewMeeting?: () => void
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [personName, setPersonName] = useState<string[]>([]);
    const { user } = useAuthContext();


    // Start and End date that reflect to the calendar 
    const [summary, setSummary] = useState('');
    const [startDate, setStartDate] = useState<Moment | null>(moment().startOf('day'));
    const [endDate, setEndDate] = useState<Moment | null>(moment().endOf('day'));
    const [description, setDescription] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedProject, setSelectedProject] = useState<any>(projectId);
    const [allProjects, setAllProjects] = useState([]);

    const fetchAllProjects = async () => {
        const projects = await getProjects({userId:user._id});
        setAllProjects(projects);
    }

    const fetchAllUsers = async () => {
        const users = await getPersonsByOrganization(user?.organization);
        setUsers(users);
    }
    useEffect(() => {
        if (isOpen) {
            fetchAllProjects();
            fetchAllUsers()
        }
    }, [isOpen]);

    const closeModal = () => {
        setIsOpen(false);
    }

    const onCancel = () => {
        clearData()
        setIsOpen(false);
    }

    const onSaveNew = () => {
        //save 
        clearData();
    }

    const clearData = () => {
        setSummary("");
        setDescription("");
        setStartDate(moment().startOf('day'));
        setEndDate(moment().endOf('day'));
        setPersonName([]);
    }

    const handleSelected = (event: SelectChangeEvent<typeof personName>) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleProjectChange = (event: SelectChangeEvent) => {
        setSelectedProject(event.target.value as string);
    }

    const handleChange = (event: SelectChangeEvent) => {
        setSummary(event.target.value as string);
    };

    const onChangeDescription = (e: any) => {
        setDescription(e.target.value);
    };

    const setStartDate_date = (date) => {
        setStartDate(date)
    }

    const setStartDate_time = (time) => {
        setStartDate(time)
    }

    const setEndDate_date = (date) => {
        setEndDate(date)
    }

    const setEndDate_time = (time) => {
        setEndDate(time)
    }

    const onSave = async () => {
        let attendees = [];
        for (const user of users) {
            if (personName.indexOf(user.name) > -1) {
                attendees.push(user._id);
            }
        }

        const meeting = {
            date: startDate.toDate(),
            summary: `${summary} - ${description}`,
            members: attendees,
            projectId: selectedProject
        };

        createMeeting(meeting).then(() => {
            onNewMeeting();
        });
        saveIntoGoogleCalendar();
        setIsOpen(false);
        clearData();
    };

    const saveIntoGoogleCalendar = async () => {
        let attendees = [];
        for (const user of users) {
            if (personName.indexOf(user.name) > -1) {
                attendees.push({email: user.email, displayName: user.name});
            }
        }

        const timestamp = Date.now().toString();
        const requestId = "conference-" + timestamp;

        const event = {
            summary: summary,
            description: description ?? "",
            start: {
                dateTime: startDate.format(),
                timeZone: startDate.format('Z')
            },
            end: {
                dateTime: endDate.format(),
                timeZone: endDate.format('Z')
            },
            ...(attendees?.length && { attendees }),
            conferenceData: {
                createRequest: {
                    requestId: requestId,
                    conferenceSolutionKey: {
                        type: "hangoutsMeet",
                    },
                },
            },
        };

        const url = new URL(
            "https://www.googleapis.com/calendar/v3/calendars/primary/events"
        );
        const params = { conferenceDataVersion: 1 };
        Object.keys(params).forEach((key) =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            url.searchParams.append(key, params[key])
        );

        const eventCreationRes = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + providerToken, // Access token for google
                "Content-Type": "application/json",
            },
            body: JSON.stringify(event),
        });

        const eventCreationResponse: { id: string } = (await eventCreationRes.json()) as { id: string };

        const eventId = eventCreationResponse.id;

        await createEvent({
            eventId: eventId,
            projectId: selectedProject ? selectedProject : allProjects[0]?._id,
        });
    }

    return (
        <>
            <div className="cursor-pointer" onClick={() => setIsOpen(true)}>
                {children}
            </div>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-[719px] h-[741px] flex flex-col transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all ">
                                    <div className="title text-center text-xl p-1">
                                        New Event
                                    </div>
                                    <hr className="border-b-1 border-gray-600" />

                                    <div className="body px-[30px] py-[40px] flex flex-col">
                                        <div className="subject">
                                            <div className="subject-title text-xs font-bold p-1"><span className="text-red-500">*</span> Subject</div>
                                            <div className="input-search relative border-2 border-gray-300 m1  rounded-md w-full">
                                                <FormControl fullWidth variant="standard">
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        sx={{ height: '32px' }}
                                                        onChange={handleChange}
                                                        IconComponent={() => (<span></span>)}
                                                    >
                                                        <MenuItem key={0} value={'Call'}>Call</MenuItem>
                                                        <MenuItem key={1} value={'Meeting'}>Meeting</MenuItem>
                                                        <MenuItem key={2} value={'Send letter/Quote'}>Send letter/Quote</MenuItem>
                                                        <MenuItem key={3} value={'Other'}>Other</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                <IconSearch className="absolute right-4 top-2" />
                                            </div>
                                        </div>
                                        <div className="description flex flex-col mt-[30px]">
                                            <div className="description-title text-xs">Description</div>
                                            <textarea className=" max-h-[659px] h-[80px] border-2 border-gray-300 rounded-md" value={description} onChange={(e) => onChangeDescription(e)}></textarea>
                                        </div>
                                        <div className="period flex mt-[31px] justify-between">
                                            <div className="start-date flex flex-col  w-[303px] h-[82px] justify-between" >
                                                <div className="title text-xs font-bold">Start</div>
                                                <div className="date flex gap-1">
                                                    <div className="flex flex-col">
                                                        <div className="date-title text-xs">Date</div>
                                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                                            <DemoContainer components={['DatePicker']}>
                                                                <div className="m-w-[100px]">
                                                                    <DatePicker
                                                                        value={startDate}
                                                                        onChange={(newValue) => setStartDate_date(newValue)}
                                                                    />
                                                                </div>
                                                            </DemoContainer>
                                                        </LocalizationProvider>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <div className="date-title text-xs">Time</div>
                                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                                            <DemoContainer components={['TimePicker']}>
                                                                <div className="m-w-[100px] ">
                                                                    <TimePicker
                                                                        value={startDate}
                                                                        onChange={(newValue) => setStartDate_time(newValue)}
                                                                    />
                                                                </div>
                                                            </DemoContainer>
                                                        </LocalizationProvider>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="end-date flex flex-col w-[303px] h-[82px] justify-between" >
                                                <div className="title text-xs font-bold">End</div>
                                                <div className="date flex gap-1">
                                                    <div className="flex flex-col">
                                                        <div className="date-title text-xs">Date</div>
                                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                                            <DemoContainer components={['DatePicker']}>
                                                                <div className="m-w-[100px]">

                                                                    <DatePicker
                                                                        value={endDate}
                                                                        onChange={(newValue) => setEndDate_date(newValue)}
                                                                    />
                                                                </div>
                                                            </DemoContainer>
                                                        </LocalizationProvider>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <div className="date-title text-xs">Time</div>
                                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                                            <DemoContainer components={['TimePicker']}>
                                                                <div className="m-w-[100px]">

                                                                    <TimePicker
                                                                        value={endDate}
                                                                        onChange={(newValue) => setEndDate_time(newValue)}
                                                                    />
                                                                </div>
                                                            </DemoContainer>
                                                        </LocalizationProvider>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="guests flex flex-col mt-[32px] mb-[12px]">
                                            <div className="guest-title text-xs font-bold p-1">Guests</div>
                                            <div className="relative border-gray-300 rounded-md w-full">
                                                <FormControl fullWidth variant="standard">
                                                    <Select
                                                        labelId="demo-multiple-checkbox-label"
                                                        id="demo-multiple-checkbox"
                                                        multiple
                                                        value={personName}
                                                        onChange={handleSelected}
                                                        input={<OutlinedInput label="Tag" />}
                                                        renderValue={(selected) => selected.join(', ')}
                                                        MenuProps={MenuProps}

                                                        sx={{ height: '32px', fontSize: '12px' }}
                                                        IconComponent={() => (<span></span>)}
                                                    >
                                                        {users.map((user, index) => (
                                                            <MenuItem key={index} value={user.name}>
                                                                <Checkbox checked={personName.indexOf(user.name) > -1} />
                                                                <ListItemText primary={user.name} />
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                <IconSearch className="absolute right-4 top-2" />
                                            </div>
                                        </div>
                                        <div className="guests flex flex-col mt-[16px] mb-[24px]">
                                            <div className="guest-title text-xs font-bold p-1">Project</div>
                                            <div className="border border-gray-300 rounded-md w-full">
                                                <FormControl fullWidth variant="standard">
                                                    <Select
                                                        id="project-list"
                                                        onChange={handleProjectChange}
                                                        value={selectedProject}
                                                    >
                                                        {allProjects.map((project) => {
                                                            return (
                                                                <MenuItem key={project._id} value={project._id}>{project.name}</MenuItem>
                                                            )
                                                        })}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                        </div>
                                        <div className="w-full border-1 rounded-md bg-gray-200 my-[6px] flex justify-start h-8">
                                            <ChevronRightIcon className="pl-2 w-8 h-8" />
                                            <div className='content text-base'>TBD</div>
                                        </div>
                                    </div>
                                    <div className="h-[56px] flex justify-end align-baseline gap-3 mx-[30px]">
                                        <button className="text-[#0176D3] w-fit m-w-[10px] h-[32px] px-2 border-2 border-gray-300 rounded-md" onClick={onCancel}>Cancel</button>
                                        <button className="text-[#0176D3] w-fit m-w-[10px] h-[32px] px-2 border-2 border-gray-300 rounded-md" onClick={onSaveNew}>Save & New</button>
                                        <button className="bg-[#0176D3] text-white w-fit m-w-[10px] h-[32px] px-2 border-1 border-gray-300 rounded-md" onClick={onSave}>Save</button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default AddMeeting;