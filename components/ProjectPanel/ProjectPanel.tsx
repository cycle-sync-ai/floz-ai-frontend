/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { IProject } from "@models";
import moment from "moment";
import { createProject, getProjects } from "@./service/project.service";
import { Meeting } from "@models/meeting.model";
import AddMeeting from "@components/Meeting/AddMeeting";
import { getMeetings } from "@service/meeting.service";
import dynamic from 'next/dynamic';

function setMeetingsDay(meetingsList) {
  // filter meetings for week days today, tomorrow, this week
  const meetingsByDay = meetingsList.reduce((acc, meeting) => {
    const date = new Date(meeting.date);
    const currentDate = new Date();
    const dayDiff =
      (date.getTime() - currentDate.getTime()) / (24 * 60 * 60 * 1000);
    let dayLabel = "";

    if (dayDiff < 0.5 && dayDiff > -0.5) {
      dayLabel = "Today";
    } else if (dayDiff < 1 && dayDiff > 0.5) {
      dayLabel = "Tomorrow";
    } else {
      dayLabel = date.toLocaleDateString("en-US", { weekday: "long" });
    }

    const existingDay = acc.find((item) => item.label === dayLabel);

    if (existingDay) {
      existingDay.meetings.push(meeting);
    } else {
      acc.push({ label: dayLabel, meetings: [meeting] });
    }

    return acc;
  }, []);

  return meetingsByDay;
}

export default function ProjectPanel({
  data,
}: {
  data: {
    projects: IProject[] | null;
    meetings?: Meeting[] | null;
    userId?: string;
    providerToken?: string;
  };
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [allProjects, setAllProjects] = useState<IProject[] | null>(
    data.projects
  );
  const [thisMonthProjects, setThisMonthProjects] = useState<
    IProject[] | null
  >();
  const [nextMonthProjects, setNextMonthProjects] = useState<
    IProject[] | null
  >();
  const [meetings, setMeetings] = useState<Meeting[] | null>(data.meetings);
  const [meetingsByDays, setMeetingsByDays] = useState(
    setMeetingsDay(data.meetings)
  );
  const [searchProject, setSearchProject] = useState('');
  const [searchMeeting, setSearchMeeting] = useState('');

  useEffect(() => {
    // filter this month and next month project
    let thisMonth = allProjects.filter((project) => {
      const date = new Date(project.createdAt);
      return (searchProject !== '' ? project.name.search(new RegExp(`(${searchProject})`, "i")) !== -1 : true) && date.getMonth() === new Date().getMonth();
    });
    let nextMonth = allProjects.filter((project) => {
      const date = new Date(project.createdAt);
      return (searchProject !== '' ? project.name.search(new RegExp(`(${searchProject})`, "i")) !== -1 : true) && date.getMonth() === new Date().getMonth() + 1;
    });
    setThisMonthProjects(thisMonth);
    setNextMonthProjects(nextMonth);
  }, [data, allProjects, searchProject]);

  useEffect(() => {
    setMeetingsByDays(setMeetingsDay (meetings.filter((meeting) => (searchMeeting !== '' ? meeting.summary.search(new RegExp(`(${searchMeeting})`, "i")) !== -1 : true))))
  }, [searchMeeting])

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  //get time from date using moment js
  const getTime = (date: string) => {
    return moment(date).format("hh:mm A");
  };
  // get month name with date using moment js
  const getMonth = (date: any) => {
    return moment(date).format("MMM Do");
  };

  const refreshMeetings = async () => {
    const updatedMeetings = await getMeetings();
    setMeetings(updatedMeetings);
    setMeetingsByDays(setMeetingsDay(updatedMeetings))
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    // Access the form element by name
    const projectName = form.get("name"); // Assuming your form input has a name attribute

    if (projectName) {
      const savedProject = await createProject({ name: projectName.toString(), userId: data.userId });

      if (savedProject) {
        const projects = await getProjects({});
        if (projects) setAllProjects(projects);
      }

      setIsOpen(false);
    }
  };

  const CurrentTimeDynamic = dynamic(
    () => import('../People/ShowingCurrentTime'),
    { ssr: false }
  );

  return (
    <div className="mb-5 w-full items-center justify-between">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 rounded border border-stone-300 bg-white p-3">
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="flex justify-between">
                <div className="flex">
                  <h3 className="my-auto pr-2 text-sm font-bold">Project</h3>
                  <p className="my-auto text-sm">
                    As of today at <CurrentTimeDynamic />
                  </p>
                </div>
                <div className="flex">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={searchProject}
                    onChange={(e)=>{setSearchProject(e.target.value)}}
                    required
                    placeholder="Search Project"
                    className={`w-full rounded-md border p-2 px-4 outline-none `}
                  />
                  <button
                    style={{
                      color: "#349989",
                      borderRadius: "4px",
                      border: "1px solid var(--Tone, #349989)",
                      background: "var(--foundation-gray-neutral-100, #FFF)",
                    }}
                    type="button"
                    onClick={openModal}
                    className="right-0 top-0 ms-4 rounded-md border border-neutral-300 bg-gray-700 px-4 text-lg font-bold text-white"
                  >
                    New
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <div className="rounded-md bg-white">
                  <div>
                    <h2 className="title_color mb-4 text-sm font-bold">
                      This month
                    </h2>
                    <div>
                      {thisMonthProjects?.length === 0 ? (
                        <p className="my-4" style={{ textAlign: "center" }}>
                          No Projects
                        </p>
                      ) : (
                        <div>
                          <div className="text-black-400 text-md grid grid-cols-12 bg-gray-100 px-4 py-2 font-bold">
                            <div className="col-span-1">
                              <input
                                type="checkbox"
                                className=""
                                id="checkbox"
                              />
                            </div>
                            <div className="col-span-3">
                              <span>Name</span>
                            </div>
                            <div className="col-span-3">
                              <span className="m0-important">Phase</span>
                            </div>
                            <div className="col-span-2">
                              <span>Due Date</span>
                            </div>
                            <div className="col-span-2">
                              <span></span>
                            </div>
                            <div className="col-span-1">
                              <span></span>
                            </div>
                          </div>
                          <div>
                            {thisMonthProjects?.map((project) => (
                              <div
                                key={project._id}
                                className="grid grid-cols-12 space-x-4 border-b px-4 py-2 text-sm font-normal"
                              >
                                <div className="col-span-1">
                                  <input
                                    type="checkbox"
                                    className=""
                                    id="checkbox"
                                  />
                                </div>

                                <div className="m0-important col-span-3">
                                  <span className="m0-important f-small">
                                    {project.name}
                                  </span>
                                </div>
                                <div className="m0-important f-small col-span-3">
                                  <span>phase</span>
                                </div>
                                <div className="m0-important f-small col-span-2">
                                  <span>{getMonth(project.createdAt)}</span>
                                </div>
                                <div className="m0-important f-small col-span-2">
                                  <span className="title_color">
                                    {" "}
                                    <Link
                                      href={`/dashboard/project/${project._id}`}
                                      key={project._id}
                                    >
                                      <h4 className="f-small text-sm">
                                        Go to project
                                      </h4>
                                    </Link>
                                  </span>
                                </div>
                                <div className="col-span-1 mx-0">
                                  <select style={{ float: "right" }}>
                                    <option value={""}></option>
                                    <option value={""}>Admin</option>
                                    <option value={""}>User</option>
                                  </select>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 rounded-md bg-white">
                  <div>
                    <h2 className="title_color mb-4 text-sm font-bold">
                      Next month
                    </h2>
                    <div>
                      {nextMonthProjects?.length === 0 ? (
                        <p className="my-4" style={{ textAlign: "center" }}>
                          No Projects
                        </p>
                      ) : (
                        <div>
                          <div className="text-black-400 text-md grid grid-cols-6 bg-gray-100 px-4 py-2 font-bold">
                            <div>
                              <input
                                type="checkbox"
                                className=""
                                id="checkbox"
                              />
                            </div>
                            <div>
                              <span>Name</span>
                            </div>
                            <div>
                              <span className="m0-important">Phase</span>
                            </div>
                            <div>
                              <span>Due Date</span>
                            </div>
                            <div>
                              <span></span>
                            </div>
                            <div>
                              <span></span>
                            </div>
                          </div>
                          <div>
                            {nextMonthProjects?.map((project) => (
                              <div
                                key={project._id}
                                className="mt-4 grid grid-cols-6 space-x-4 border-t px-4 text-sm font-normal"
                              >
                                <div>
                                  <input
                                    type="checkbox"
                                    className=""
                                    id="checkbox"
                                  />
                                </div>

                                <div className="m0-important f-small">
                                  <span className="m0-important">
                                    {project.name}
                                  </span>
                                </div>
                                <div className="m0-important f-small">
                                  <span>phase</span>
                                </div>
                                <div className="m0-important f-small">
                                  <span>{getMonth(project.createdAt)}</span>
                                </div>
                                <div className="m0-important f-small">
                                  <span className="title_color">
                                    {" "}
                                    <Link
                                      href={`/project/${project._id}`}
                                      key={project._id}
                                    >
                                      <h4 className="f-small text-sm">
                                        Go to project
                                      </h4>
                                    </Link>
                                  </span>
                                </div>
                                <div>
                                  <select style={{ float: "right" }}>
                                    <option value={""}></option>
                                    <option value={""}>Admin</option>
                                    <option value={""}>User</option>
                                  </select>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="title_color view-all">
              <Link href="/dashboard/project">
                <h4 className="f-small text-sm">View All</h4>
              </Link>
            </div>
          </div>
        </div>

        <div className="relative col-span-1 rounded border border-stone-300 bg-white p-3">
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="flex justify-between">
                <div className="flex">
                  <h3 className="my-auto pr-2 text-sm font-bold">Meetings</h3>
                </div>
                <div className="flex">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={searchMeeting}
                    onChange={(e) => {setSearchMeeting(e.target.value)}}
                    required
                    placeholder="Search Meetings"
                    className={`w-full rounded-md border p-2 px-4 outline-none `}
                  />

                  <AddMeeting providerToken={data.providerToken} userId={data.userId} onNewMeeting={refreshMeetings}>
                    <button
                      style={{
                        color: "#349989",
                        borderRadius: "4px",
                        border: "1px solid var(--Tone, #349989)",
                        background: "var(--foundation-gray-neutral-100, #FFF)",
                      }}
                      type="button"
                      className="h-full px-3 ml-3 rounded-md border border-neutral-300 bg-gray-700 text-lg font-bold text-white"
                    >
                      New
                    </button>
                  </AddMeeting>
                </div>
              </div>

              <div className="mt-4">
                <div className="rounded-md bg-white">
                  <div>
                    <div>
                      {meetingsByDays?.length === 0 ? (
                        <p>{""}</p>
                      ) : (
                        <div>
                          {meetingsByDays?.map(
                            (
                              day: {
                                label: string;
                                meetings: Meeting[];
                              },
                              index: number
                            ) => (
                              <section
                                key={day.label}
                                className="accordion mb-4"
                              >
                                <div className="tab bg-white-100 text-black-400 text-md">
                                  <label
                                    htmlFor={`accordion-${index}`}
                                    className="tab__label font-bold"
                                  >
                                    {day.label}
                                  </label>
                                  <input
                                    type="checkbox"
                                    name={`accordion-${index}`}
                                    id={`accordion-${index}`}
                                  />
                                  <div className="tab__content">
                                    {day.meetings?.map(
                                      (meetings: Meeting) => (
                                        <div
                                          key={meetings._id}
                                          className="font-small grid grid-cols-4 space-x-4 border-b px-2 py-4 text-sm"
                                        >
                                          <div className="m0-important f-small col-span-1">
                                            <span>
                                              {getTime(meetings.date.toString())}
                                            </span>
                                          </div>
                                          <div className="m0-important col-span-2 text-sm">
                                            <span className="m0-important f-small font-bold">
                                              {meetings.summary}
                                            </span>
                                          </div>
                                          <div className="m0-important col-span-1 text-right">
                                            <span className="title_color">
                                              {" "}
                                              <Link
                                                href={`/dashboard/project/${meetings.projectId}/meeting/${meetings._id}`}
                                                key={meetings._id}
                                              >
                                                <h4 className="f-small text-sm">
                                                  Details
                                                </h4>
                                              </Link>
                                            </span>
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </section>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {meetings?.length === 0 ? (
              <p>{""}</p>
            ) : (
              <div className="title_color view-all">
                <Link href="/dashboard/calendar">
                  <h4 className="f-small text-sm">View All</h4>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="z-20 flex gap-x-4">
        <div className="z-20 flex gap-x-4">
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
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Create new Project
                      </Dialog.Title>
                      <div className="my-10">
                        <form onSubmit={handleSubmit}>
                          <label className="text-sm font-bold">
                            Project Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            placeholder="Project X"
                            className={`w-full rounded-md border p-2 px-4 outline-none `}
                          />
                          <button
                            type="submit"
                            className="mt-3 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          >
                            Submit
                          </button>
                        </form>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </div>
      </div>
    </div>
  );
}
