"use client";

import React, { useState, Fragment, useEffect, useRef } from "react";
import IconSearch from "@components/icons/IconSearch";
import { getUserByEmail, getUsers } from "@service/user.service"

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateCalendar, StaticDatePicker, TimeField, TimePicker } from "@mui/x-date-pickers";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

import { getCookie } from "cookies-next";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Dialog, Transition } from "@headlessui/react";
import { getProjects, updateProject } from "../../service/project.service";
import { createEvent, updateEvent } from "@./service/event.service";
import Event from "./Event";
import { Checkbox, ListItemText, OutlinedInput, Typography } from "@mui/material";
import { getPersons, getPersonsByOrganization } from "@service/person.service";
import { useAuthContext } from "@contexts/AuthContext";
import { signOut } from "next-auth/react";
import { createMeeting, deleteMeeting, updateMeeting } from "@service/meeting.service";
import { SketchPicker } from 'react-color';

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

const eventBackColor = {
  "Call": "#FF5BA0",
  "Meeting": "#7B61FF",
  "Send letter/Quote": "#00D079"
}

interface Item {
  kind: string;
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  description: string;
  location: string;
  creator: {
    email: string;
    self: boolean;
  };
  organizer: {
    email: string;
    self: boolean;
  };
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  iCalUID: string;
  sequence: number;
  attendees: [
    {
      email: string;
      responseStatus: string;
      self: boolean;
    }
  ];
  reminders: {
    useDefault: boolean;
  };
  eventType: string;
  conferenceData: {
    createRequest: {
      requestId: string;
      conferenceSolutionKey: {
        type: string;
      };
    };
    conferenceSolution: {
      key: {
        type: string;
      };
      name: string;
      iconUri: string;
    };
    conferenceId: string;
    signature: string;
  };
  hangoutLink: string;
  extendedProperties?: {
    private?: {
      projectId?: string;
      meetingId?: string;
    }
  }
}
interface Event {
  kind: string;
  summary: string;
  items: Item[];
}

export default function Calendar() {
  // attencies
  const [selectedPersonEmailList, setSelectedPersonEmailList] = React.useState<string[]>([]);

  const { user } = useAuthContext();
  // Start and End date that reflect to the calendar 
  const [summary, setSummary] = React.useState('');
  const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs(''));
  const [endDate, setEndDate] = React.useState<Dayjs | null>(dayjs('2022-04-17'));

  // Selected project from the Form
  const [selectedProject, setSelectedProject] = useState("");
  const [allProjects, setAllProjects] = useState([]);

  const [description, setDescription] = useState("");

  // Selected Date by clicking on the calendar with user
  const [currentDateTime, setCurrentDateTime] = useState<Dayjs | null>(dayjs((new Date()).toISOString()));
  // Determine if the calendar is open or closed
  const [isOpen, setIsOpen] = useState(false);
  const [isEditCompShow, setIsEditCompShow] = useState(false);
  const [openModalState, setOpenModalState] = useState("None");
  // Attributes for the calendar
  const [initialEvents, setInitialEvents] = useState([]);

  const [users, setUsers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  //////////////////////////////////////////////////////////////////////////
  const [isPickColorOpen, setIsPickColorOpen] = useState(false)
  const [projectColor, setProjectColor] = useState('#000');
  const [projectColorMap, setProjectColorMap] = useState<Record<string, number>[]>([]);
  //////////////////////////////////////////////////////////////////////////
  const calendarRef: any = useRef();
  const providerToken = getCookie("p_token");
  const INITIAL_EVENTS = [];

  const userId = getCookie("user_id");
  ///////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    const initalize = async () => {
      setCurrentDateTime(dayjs((new Date()).toISOString()));
      await fetchAllProjects();
    }
    initalize();
  }, []);

  useEffect(() => {
    fetchAllProjects();
  }, [isOpen]);

  useEffect(() => {
    setProjectColor(projectColorMap[selectedProject]);
  }, [selectedProject])

  useEffect(() => {
    setSummary(selectedEvent?.event.title);
    setDescription(selectedEvent?.event.extendedProps.description);
    setStartDate(dayjs(selectedEvent?.event.start));
    setEndDate(dayjs(selectedEvent?.event.end));
    getSelectedPersonEmailsFromAttentdees();
    getSelectedProjectIdandColor();
  }, [selectedEvent])

  const getSelectedProjectIdandColor = () => {
    console.log(selectedEvent?.event.extendedProps.projectId);
    setSelectedProject(selectedEvent?.event.extendedProps.projectId);
    setProjectColor(projectColorMap[selectedEvent?.event.extendedProps.projectId as string])
  }

  const getSelectedPersonEmailsFromAttentdees = () => {
    const tempselectedPersonEmailLists = [];
    console.log(selectedEvent?.event.extendedProps.attendees, "attendees")
    const tempAttendees = selectedEvent?.event?.extendedProps?.attendees;
    for (let i = 0; i < tempAttendees?.length; i++) {
      tempselectedPersonEmailLists.push(tempAttendees[i]?.email);
      if (i === tempAttendees.length - 1) {
        setSelectedPersonEmailList(tempselectedPersonEmailLists);
      }
    }
  }

  const editSelectedEvent = async () => {
    setOpenModalState("Update");
    fetchAllUsers();
    fetchAllProjects();
    setIsOpen(true);
  }

  const deleteEventFromCalendar = async () => {
    const url = new URL(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${selectedEvent.event.id}`
    );
    console.log(selectedEvent.event.id, "---------id");
    try {
      await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + providerToken, // Access token for google
        }
      });
      selectedEvent.remove();
    } catch (error) {
      console.log("Delete Event Error", error);
    }
  }

  const handleSelected = (event: SelectChangeEvent<typeof selectedPersonEmailList>) => {
    const {
      target: { value },
    } = event;
    setSelectedPersonEmailList(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  // If summary in the is changed, the new value is added to the summary state;
  const handleChange = (event: SelectChangeEvent) => {
    setSummary(event.target.value as string);
  };

  const fetchAllUsers = async () => {
    let data = await getPersonsByOrganization(user.organization);
    setUsers(data);
  }

  const fetchAllProjects = async () => {
    const tempProjects = await getProjects({ userId: userId });
    const tempProjectColorMap = [];
    for(let i = 0; i < tempProjects.length; i++) {
      tempProjectColorMap[tempProjects[i]._id] = tempProjects[i].color;
    }
    // console.log("temp allProjects before set--------->", allProjects);
    setAllProjects(tempProjects);
    setProjectColorMap(tempProjectColorMap);
    // console.log("temp allProjects after--------->", allProjects);
    return;
  };

  useEffect(() => {
    (async() => {
      await fetchEvents();
    })()
  },[projectColorMap, allProjects]);

  async function fetchEvents() {
    try {
      const allEvents: Response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + providerToken, // Access token for google
          },
        }
      );

      const events: Event = (await allEvents.json()) as Event;
      // Loop through the Google Calendar events and convert them
      const googleEvents = events?.items;
      console.log(googleEvents, "googleEvents");
      console.log(events, "events");
      for (const googleEvent of googleEvents) {
        const eventId = googleEvent.id; // Event ID
        const title = googleEvent.summary; // Event summary
        const description = googleEvent.description;// Event description
        const start = googleEvent.start.dateTime; // Start date
        const end = googleEvent.end.dateTime; // End date
        const attendees = googleEvent.attendees;
        const projectId = googleEvent.extendedProperties?.private.projectId;
        const meeetingId = googleEvent.extendedProperties?.private.meetingId;
        const meetingUrl = googleEvent.hangoutLink;
        console.log(attendees, "attendees getted from google event");
        // const startStr = start?.replace(/T.*$/, "") ?? start;
        // const endStr = end?.replace(/T.*$/, "") ?? end;
        const ievents = INITIAL_EVENTS.filter(
          (evt: { id: string }) => evt.id === eventId
        );
        if (!ievents.length) {
          INITIAL_EVENTS.push({
            id: eventId,
            title: title,
            description: description,
            start: start,
            end: end,
            extendedProps: {
              attendees: attendees,
              projectId: projectId,
              meetingId: meeetingId,
            },
            url: meetingUrl,
            backgroundColor: projectColorMap[projectId],
            borderColor: "transparent",
            // ...googleEvent
          });
        }
        setInitialEvents(INITIAL_EVENTS);
      }
      // Now, INITIAL_EVENTS contains the converted events in the desired format
    } catch (error) {
      console.log(error, 'fetch events from googlecalendar error!');
      // signOut()
    }
  }

  function closeModal() {
    setIsOpen(false);
  }


  const addEvent = async (selectInfo: { start: string; end: string }) => {
    setOpenModalState("Insert")
    setSummary('');
    setDescription('');
    setSelectedProject('');
    setSelectedPersonEmailList([]);
    setStartDate(dayjs(selectInfo.start));
    setEndDate(dayjs(selectInfo.end));
    fetchAllUsers();
    fetchAllProjects();
    setIsOpen(true);
  };

  const getLocalTime = (val) => {
    const date = new Date(val);
    const offset = date.getTimezoneOffset();
    const localTime = new Date(date.getTime() + offset * 60 * 1000)
    // return localTime.toISOString();
    return date.toISOString();
  }

  const onSave = async () => {

    const personIdList = [];
    for (const personEmail of selectedPersonEmailList) {
      personIdList.push((await getPersons({
        email: personEmail
      }))?.at(0)?._id);
    }

    const newMeeting = await createMeeting({
      date: startDate.toDate(),
      audioURL: '',
      summary: summary,
      members: personIdList,
      projectId: selectedProject,
      updatedAt: new Date(),
      createdAt: new Date(),
    })

    let attendees = [];

    for (const user of users) {
      if (selectedPersonEmailList.indexOf(user.email) > -1) {
        attendees.push({
          name: user.name,
          email: user.email,
          responseStatus: "accepted",
          self: true,
        });
      }
    }

    const timestamp = Date.now().toString();
    const requestId = "conference-" + timestamp;


    const event = {
      summary: summary,
      description: description ?? "",
      start: {
        dateTime: getLocalTime(startDate.toISOString()), // Date.ISOString()
        timeZone: Intl.DateTimeFormat().resolvedOptions, // Pakistan/Lahore
      },
      end: {
        dateTime: getLocalTime(endDate.toISOString()),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Pakistan/Lahore
      },
      ...(attendees?.length && { attendees: attendees }),
      conferenceData: {
        createRequest: {
          requestId: requestId,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
      extendedProperties: {
        private: {
          projectId: selectedProject,
          meetingId: newMeeting._id,
        }
      }
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
      },
      body: JSON.stringify(event),
    });

    const eventCreationResponse: { id: string } =
      (await eventCreationRes.json()) as { id: string };

    const eventId = eventCreationResponse.id;

    await updateProject(selectedProject, {
      color:projectColor,
    })
    setIsOpen(false);
    clearData();
  };

  const handleFullcalendarUpdate = async (event: any) => {

    const url = new URL(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${event.id}`
    );
    const updatedEvent = {
      summary: event.title,
      description: event.description ?? "",
      start: {
        dateTime: event.start
      },
      end: {
        dateTime: event.end,
      },
      attendees: event?.extendedProps.attendees,
      extendedProperties: {
        private: {
          projectId: event.extendedProps.projectId,
          meetingId: event.extendedProps.meetingId,
        }
      }
    };
    const eventCreationRes = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + providerToken, // Access token for google
      },
      body: JSON.stringify(updatedEvent),
    });
  }

  const handleChangeEvent = async (info) => {

    handleClickedEvent(info);

    const url = new URL(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${info.event.id}`
    );
    const updatedEvent = {
      summary: info.event.title,
      description: description ?? "",
      start: {
        dateTime: info.event.start
      },
      end: {
        dateTime: info.event.end,
      },
      attendees: info.event.attedeees,
      conferenceData: info.event.conferenceData,
    };
    const eventCreationRes = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + providerToken, // Access token for google
      },
      body: JSON.stringify(updatedEvent),
    });

  }

  const clearData = () => {
    setSummary("");
    setDescription("");
    setStartDate(dayjs(''));
    setEndDate(dayjs(''));
    setSelectedPersonEmailList([]);
    setOpenModalState("None")
  }

  const onChangeDescription = (e: any) => {
    setDescription(e.target.value);
  };
  ////////////////////////////////////////////////////////////////

  // const handleEventClick = (clickInfo) => {
  //   if (
  //     confirm(
  //       `Are you sure you want to delete the event '${clickInfo.event.title}'`
  //     )
  //   ) {
  //     clickInfo.event.remove();
  //   }
  // };

  // const handleEvents = (events) => {
  //   // setCurrentEvents(events);
  // };

  // const renderEventContent = (eventInfo) => {
  //   return (
  //     <>
  //       <b>{eventInfo.timeText}</b>
  //       <i>{eventInfo.event.title}</i>
  //     </>
  //   );
  // };


  const handleSelectChange = (e) => {
    console.log(e.target.value, 'selected project id');
    setSelectedProject(e.target.value);
  };

  const onSaveNew = () => {
    //save 
    clearData();
  }

  const onCancel = () => {
    clearData()
    setIsOpen(false);
  }

  const setStartDate_date = (date) => {
    const start_date = dayjs(date);
    console.log(new Date(start_date.year(), start_date.month(), start_date.day(), startDate.hour(), startDate.minute(), startDate.second()), "error isostrng")
    // setStartDate(dayjs(new Date(start_date.year(), start_date.month(), start_date.day(), startDate.hour(), startDate.minute(), startDate.second()).toISOString()));
  }

  const setStartDate_time = (time) => {

    const start_time = dayjs(time);
    setStartDate(dayjs(new Date(startDate.year(), startDate.month(), startDate.day(), start_time.hour(), start_time.minute(), start_time.second()).toISOString()));
  }

  const setEndDate_date = (date) => {
    const end_date = dayjs(date);
    setEndDate(dayjs(new Date(end_date.year(), end_date.month(), end_date.day(), endDate.hour(), endDate.minute(), endDate.second()).toISOString()));
  }

  const setEndDate_time = (time) => {

    const end_time = dayjs(time);
    setStartDate(dayjs(new Date(endDate.year(), endDate.month(), endDate.day(), end_time.hour(), end_time.minute(), end_time.second()).toISOString()));
  }
  const calendarOptions = {
    initialDate: new Date(),
    events: [
      {
        title: 'Event 1',
        start: new Date(),
        end: new Date(),
      },
      {
        title: 'Event 2',
        start: new Date(),
        end: new Date(),
      },
    ],
  };


  const handleClickedEvent = ((info) => {
    setSelectedEvent(info)
    console.log(info, "selected info")
  })

  const handleUpdate = async () => {


    let attendees = [];

    for (const user of users) {
      if (selectedPersonEmailList.indexOf(user.email) > -1) {
        attendees.push({
          name: user.name,
          email: user.email,
          responseStatus: "accepted",
          self: true,
        });
      }
    }

    const timestamp = Date.now().toString();
    const requestId = "conference-" + timestamp;


    const event = {
      summary: summary,
      description: description ?? "",
      start: {
        dateTime: getLocalTime(startDate.toISOString()), // Date.ISOString()
        timeZone: Intl.DateTimeFormat().resolvedOptions, // Pakistan/Lahore
      },
      end: {
        dateTime: getLocalTime(endDate.toISOString()),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Pakistan/Lahore
      },
      ...(attendees?.length && { attendees: attendees }),
      conferenceData: {
        createRequest: {
          requestId: requestId,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
      extendedProperties: {
        private: {
          meetingId: selectedEvent?.event.extendedProps.meetingId,
          projectId: selectedProject,
        }
      }
    };

    const url = new URL(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${selectedEvent.event.id}`
    );
    const params = { conferenceDataVersion: 1 };
    Object.keys(params).forEach((key) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      url.searchParams.append(key, params[key])
    );

    const eventCreationRes = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + providerToken, // Access token for google
      },
      body: JSON.stringify(event),
    });

    const personIdList = [];
    for (const personEmail of selectedPersonEmailList) {
      personIdList.push((await getUserByEmail(personEmail))?.at(0)?._id);
    }

    await updateMeeting(selectedEvent?.event?.extendedProps?.meetingId, {
      summary:summary,
      date: startDate.toDate(),
      members: personIdList,
      projectId: selectedProject,
      updatedAt: new Date(),
    })
    const resultUpdateProject = await updateProject(selectedEvent?.event?.extendedProps?.projectId, {
      color: projectColor,
    })
    
    console.log(resultUpdateProject, "Result update Project!!!");
    
    projectColorMap[selectedEvent?.event?.extendedProps?.projectId as string] = projectColor;

    setIsOpen(false);
    clearData();
  }

  const getCalendarTitle = () => {
    return calendarRef.current?.getApi().view.title;
  }

  const startMeeting = () => {
    window.open(selectedEvent.event.url, '_blank');
  }

  const goTOMeetingPage = () => {
    window.open(`\\dashboard\\project\\${selectedEvent?.event?.extendedProps.projectId}\\meeting\\${selectedEvent?.event?.extendedProps?.meetingId}`, '_self');
  }

  const removeEvent = () => {
    setIsEditCompShow(false);
    deleteMeeting(selectedEvent?.event?.extendedProps?.meetingId);
    selectedEvent?.event?.remove();
    deleteEventFromCalendar();
    setIsEditCompShow(false)
  }

  return (
    <div className="h-full flex flex-row">
      <div className="flex-[85%] h-full flex flex-col">
        <div className="flex items-center my-[14px] m-[30px] text-[13px]">
          <div className="flex w-[94px] h-[32px] text-[13px] text-white bg-[#349989] items-center rounded-md justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <div onClick={() => { setIsOpen(true) }}>Create</div>
          </div>
          <button onClick={() => { setIsPickColorOpen(true) }}>Show Pick Color</button>
          <div className="flex justify-center w-[85px] h-[32px] mx-[12px] border-2 border-[#349989] rounded-md text-[#349989]">
            <select className="focus:border-none selected:border-none focus:outline-none" defaultValue={'timeGridWeek'} onChange={(e) => { calendarRef.current.getApi().changeView(e.target.value) }}>
              <option value={'timeGridDay'} >Day</option>
              <option value={'timeGridWeek'}>Week</option>
              <option value={'dayGridMonth'}>Month</option>
            </select>
          </div>
          <button className="w-8 h-8 justify-center border-2 mr-[5px] rounded-md border-[#349989] flex items-center" onClick={() => calendarRef.current.getApi().prev()}>
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M7.69141 0.553519L7.69141 11.4458C7.69141 11.7535 7.29141 11.9689 7.01448 11.7227L0.491406 6.39967C0.245252 6.21506 0.245252 5.81506 0.491406 5.63044L7.01448 0.245827C7.29141 0.030442 7.69141 0.215057 7.69141 0.553519Z" fill="#349989" />
            </svg>

          </button>
          <button className="w-8 h-8 justify-center flex items-center border-2 rounded-md border-[#349989]" onClick={() => calendarRef.current.getApi().next()}>
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M0.308594 11.4465L0.308593 0.554174C0.308593 0.246483 0.708593 0.0310983 0.985516 0.277252L7.50859 5.60033C7.75475 5.78494 7.75475 6.18494 7.50859 6.36956L0.985517 11.7542C0.708594 11.9696 0.308594 11.7849 0.308594 11.4465Z" fill="#349989" />
            </svg>

          </button>
          <div className="text-base px-[12px]">{getCalendarTitle()}</div>
        </div>
        <div className="grow">
          <div className="h-full text-[10px]">

            <FullCalendar
              ref={calendarRef}
              key={initialEvents.length}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: "",
                center: "",
                right: "",
              }}
              initialView="timeGridWeek"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              eventResizableFromStart={true}
              events={initialEvents} // alternatively, use the `events` setting to fetch from a feed
              // select={handleDateSelect}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore No overload matches this call.
              select={addEvent}
              eventResize={(info) => {
                handleFullcalendarUpdate(info?.event);
                updateMeeting(info?.event?.extendedProps?.meetingId, {
                  date: new Date(info?.event.start),
                  updatedAt: new Date(),
                })
              }}
              eventDrop={(info) => {
                handleFullcalendarUpdate(info?.event);
                updateMeeting(info?.event?.extendedProps?.meetingId, {
                  date: new Date(info?.event.start),
                  updatedAt: new Date(),
                })
              }}
              eventClick={(info) => { info.jsEvent.preventDefault(); handleClickedEvent(info); setIsEditCompShow(true); setOpenModalState('Update') }}
            />
          </div>
        </div>

        {/* DIALOGUE */}
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-[719px] h-[741px] relative flex flex-col transform overflow-y-auto rounded-2xl bg-white text-left align-middle shadow-xl transition-all ">
                    <div className="new-event-container flex flex-col p-8">
                      <div className="close-btn flex justify-end p-2">
                        {/* <CloseButton /> */}
                      </div>
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
                                sx={{ height: '32px', fontSize: '12px' }}
                                onChange={handleChange}
                                // variant="outlined"
                                IconComponent={() => (<span></span>)}
                                value={summary}
                              >
                                <MenuItem key={0} value={'Call'} sx={{ fontSize: '12px' }}>Call</MenuItem>
                                <MenuItem key={1} value={'Meeting'} sx={{ fontSize: '12px' }}>Meeting</MenuItem>
                                <MenuItem key={2} value={'Send letter/Quote'} sx={{ fontSize: '12px' }}>Send letter/Quote</MenuItem>
                                <MenuItem key={3} value={'Other'} sx={{ fontSize: '12px' }}>Other</MenuItem>
                              </Select>
                            </FormControl>
                            <IconSearch className="absolute right-4 top-2" />
                          </div>
                        </div>
                        <div className="description flex flex-col mt-[30px]">
                          <div className="description-title text-xs">Description</div>
                          <textarea className=" max-h-[659px] h-[80px] border-2 border-gray-300 rounded-md p-2" value={description} onChange={(e) => onChangeDescription(e)}></textarea>
                        </div>
                        <div className="period flex mt-[31px] justify-between">
                          <div className="start-date flex flex-col  w-[303px] h-[82px] justify-between" >
                            <div className="title text-xs font-bold">Start</div>
                            <div className="date flex gap-1">
                              <div className="flex flex-col">
                                <div className="date-title text-xs">Date</div>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <DemoContainer components={['DatePicker']} >
                                    <div className="m-w-[100px]">
                                      <DatePicker
                                        value={startDate}
                                        // renderInput={(props) => <TextField {...props} sx={{ height:'32px'}}/>}
                                        onChange={(newValue) => setStartDate_date(newValue)}
                                      />
                                    </div>
                                  </DemoContainer>
                                </LocalizationProvider>
                              </div>
                              <div className="flex flex-col">
                                <div className="date-title text-xs">Time</div>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                        <div className="guests flex flex-col mt-[32px] mb-[24px]">
                          <div className="guest-title text-xs font-bold p-1">Guests</div>
                          <div className="input-search relative border-2 border-gray-300 m1  rounded-md w-full">
                            <FormControl fullWidth variant="standard">
                              <Select
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                value={selectedPersonEmailList}
                                onChange={handleSelected}
                                input={<OutlinedInput label="Tag" />}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}

                                sx={{ height: '32px', fontSize: '12px' }}
                                IconComponent={() => (<span></span>)}
                              >
                                {users.map((user, index) => (
                                  <MenuItem key={index} value={user.email} sx={{ height: '36px' }}>
                                    <Checkbox checked={selectedPersonEmailList.indexOf(user.email) > -1} />
                                    <ListItemText>
                                      <Typography variant="body2" sx={{ fontSize: '12px', fontFamily: 'Arial' }}>
                                        {user.name}
                                      </Typography>
                                    </ListItemText>
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <IconSearch className="absolute right-4 top-2" />
                          </div>
                        </div>
                        <div className="guests flex flex-col">
                          <div className="guest-title text-xs font-bold p-1">Projects</div>
                          <div className="flex gap-1 items-center">
                            <div className="input-search relative border-2 border-gray-300 m1  rounded-md w-full">
                              <FormControl fullWidth>
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  value={selectedProject}
                                  label="Projects"
                                  sx={{ height: '32px', fontSize: '12px' }}
                                  IconComponent={() => (<span></span>)}
                                  onChange={(e) => handleSelectChange(e)}
                                >
                                  {
                                    allProjects.map((project, index) => (
                                      <MenuItem key={index} sx={{ fontSize: '12px' }} value={project._id}>{project.name}</MenuItem>
                                    ))
                                  }
                                </Select>
                              </FormControl>
                            </div>

                            <button
                              onClick={() => { setIsPickColorOpen(true) }}
                              className={`relative w-8 h-8 rounded-lg`}
                              style={{backgroundColor:`${projectColor}`}} >
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="h-[56px] flex justify-end align-baseline gap-3 mx-[30px]">
                        <button className="text-[#0176D3] w-fit m-w-[10px] h-[32px] px-2 border-2 border-gray-300 rounded-md" onClick={onCancel}>Cancel</button>
                        <button className="text-[#0176D3] w-fit m-w-[10px] h-[32px] px-2 border-2 border-gray-300 rounded-md" onClick={() => { onSaveNew }}>Save & New</button>
                        <button className="bg-[#0176D3] text-white w-fit m-w-[10px] h-[32px] px-2 border-1 border-gray-300 rounded-md" onClick={() => { openModalState === "Insert" ? onSave() : handleUpdate() }}>Save</button>
                      </div>
                    </div>

                    {
                      isPickColorOpen ?
                        <>
                          <div className="pick-color absolute w-full h-full">

                            <div className="h-full w-full">
                              <div className="flex min-h-full items-center justify-center text-center">

                                <div className="w-full flex flex-col p-4 justify-center items-center max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                                  <h1
                                    className="text-xl font-medium leading-6 text-gray-900 m-4"
                                  >
                                    Pick your project color!
                                  </h1>
                                  <div className="mt-2">
                                    <SketchPicker
                                      color={projectColor}
                                      onChange={(color, event) => setProjectColor(color.hex)}
                                    />
                                  </div>

                                  <div className="mt-4 flex gap-2">
                                    <button
                                      type="button"
                                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                      onClick={() => setIsPickColorOpen(false)}
                                    >
                                      OK
                                    </button>
                                    <button
                                      type="button"
                                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                      onClick={() => setIsPickColorOpen(false)}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </> : <></>
                    }
                  </Dialog.Panel>
                </Transition.Child>

              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
      <div className="flex-[15%]">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={[
            'DateCalendar',
          ]}>
            <DateCalendar value={currentDateTime} onChange={(newValue) => { setCurrentDateTime(newValue); calendarRef.current.getApi().gotoDate(newValue.toISOString()) }} />
          </DemoContainer>
        </LocalizationProvider>
        <div className="text-center text-xs cursor-pointer text-[#0B5CAB]" onClick={() => { setCurrentDateTime(dayjs(new Date())); calendarRef.current.getApi().gotoDate(new Date()) }}>Today</div>
      </div>
      {/* <Dialog.Panel className="w-[719px] h-[741px] flex flex-col transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all "></Dialog.Panel> */}
      {/* {isEditCompShow ? <EditEventComponent info={selectedEvent} x={positionX} y={positionY} /> : <></>} */}
      <Transition appear show={isEditCompShow} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsEditCompShow(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="relative min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xs   transform overflow-hidden absolute rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                  style={{ left: `${selectedEvent?.jsEvent.x}px`, top: `${selectedEvent?.jsEvent.y}px` }}>
                  <div className="flex justify-end gap-1 &>svg:hover:bg-gray-500">
                    <svg
                      onClick={() => goTOMeetingPage()}
                      className="w-8 h-8 rounded-md p-1 hover:bg-gray-300"
                      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>

                    <svg
                      onClick={() => { startMeeting() }}
                      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 rounded-md p-1 hover:bg-gray-300">
                      <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    <svg
                      onClick={() => editSelectedEvent()}
                      className="w-8 h-8 rounded-md p-1 hover:bg-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none" viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8 rounded-md p-1 hover:bg-gray-300"
                      onClick={() => { removeEvent() }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none" viewBox="0 0 24 24"
                      strokeWidth={1.5} stroke="currentColor"
                      className="w-8 h-8 rounded-md p-1 hover:bg-gray-300"
                      onClick={() => { setIsEditCompShow(false); setIsEditCompShow(false) }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>

                  </div>
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {selectedEvent?.event?.title}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {selectedEvent?.event?.extendedProps?.description}
                    </p>
                  </div>


                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>


    </div>
  );
}