"use client";

import Select from "@components/Select/Select";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import React from "react";

export default function Transcript() {
  const testData = [
    {
      name: "Speaker 1",
      content:
        "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available. ",
    },
    {
      name: "Speaker 2",
      content:
        "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available. ",
    },
    {
      name: "Speaker 3",
      content:
        "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available. ",
    },
    {
      name: "Speaker 4",
      content:
        "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available. ",
    },
    {
      name: "Speaker 5",
      content:
        "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available. ",
    },
    {
      name: "Speaker 6",
      content:
        "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available. ",
    },
    {
      name: "Speaker 7",
      content:
        "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available. ",
    },
    {
      name: "Speaker 8",
      content:
        "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available. ",
    },
  ];

  const handleSelectChange = (id: string) => {
    // console.log(`Selected option id: ${id}`);
    return id;
  };

  return (
    <div>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="ml-3 mt-2 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 sm:hidden"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="h-6 w-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      {/* CONTENT */}
      <div className="flex gap-x-6 py-4">
        {/* TRANSCRIPT PART */}
        <div className="h-full rounded-md border border-neutral-200 bg-white shadow-md">
          <div className="flex h-32 items-center justify-center border-b border-neutral-200">
            <p>Overview in meeting</p>
          </div>

          <div className="flex max-h-[38rem] flex-col space-y-12 overflow-y-auto py-10 pe-40 ps-10 ">
            {testData.map((item) => (
              <div key={item.name}>
                <h3 className="text-xl font-bold">{item.name}</h3>
                <p>{item.content}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          {/* TODO LIST */}
          <div className="relative me-4 w-full overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    To do list
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Deadline
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
                  <th
                    scope="row"
                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                  >
                    Email Joseph
                  </th>
                  <td className="px-6 py-4">12 Nov</td>
                  <td className="px-6 py-4 text-right">
                    <a
                      href="#"
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      Edit
                    </a>
                  </td>
                </tr>
                <tr className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
                  <th
                    scope="row"
                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                  >
                    Send GC the updated permit set
                  </th>
                  <td className="px-6 py-4">Yesterday</td>
                  <td className="px-6 py-4 text-right">
                    <a
                      href="#"
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      Edit
                    </a>
                  </td>
                </tr>
                <tr className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-600">
                  <th
                    scope="row"
                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                  >
                    Call Procurement team
                  </th>
                  <td className="px-6 py-4">2 Dec</td>

                  <td className="px-6 py-4 text-right">
                    <a
                      href="#"
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      Edit
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ROLES AND PERMISSIONS */}
          <div className="mt-6 w-[30rem] flex flex-col space-y-6 rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-x-6">
              <div className="flex items-center gap-x-2">
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=4&w=256&h=256&q=80"
                  alt="person-img"
                  className="h-10 w-10 rounded-md bg-neutral-500"
                />
                <div>
                  <p>Name Here</p>
                  <p className="-mt-1">name@name.com</p>
                </div>
              </div>

              <div className="flex gap-x-4">
                <Select
                  options={[
                    { id: "1", name: "Project Manager" },
                    { id: "2", name: "Software Engineer" },
                    { id: "3", name: "Web Developer" },
                  ]}
                  onChange={handleSelectChange}
                  label="Role"
                />

                <button className="flex shrink-0 items-center rounded-md bg-gray-700 px-1 text-sm text-white shadow-sm">
                  Generate Email
                </button>
              </div>
            </div>

            <div className="flex items-center gap-x-6">
              <div className="flex items-center gap-x-2">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=4&w=256&h=256&q=80"
                  alt="person-img"
                  className="h-10 w-10 rounded-md bg-neutral-500"
                />
                <div>
                  <p>Name Here</p>
                  <p className="-mt-1">name@name.com</p>
                </div>
              </div>

              <div className="flex gap-x-4">
                <Select
                  options={[
                    { id: "1", name: "Project Manager" },
                    { id: "2", name: "Software Engineer" },
                    { id: "3", name: "Web Developer" },
                  ]}
                  onChange={handleSelectChange}
                  label="Role"
                />

                <button className="flex shrink-0 items-center rounded-md bg-gray-700 px-1 text-sm text-white shadow-sm">
                  Generate Email
                </button>
              </div>
            </div>
          </div>

          {/* MEETING SUMMARY */}
          <div className="mt-6 flex flex-col space-y-8 rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
            <div>
              <div className="flex flex-col space-y-2">
                <h3 className="text-l font-bold">Meeting Summary</h3>
                <textarea className="h-32">
                  In publishing and graphic design, Lorem ipsum is a placeholder
                  text commonly used to demonstrate the visual form of a
                  document or a typeface without relying on meaningful content.
                  Lorem ipsum may be used as a placeholder before final copy is
                  available.
                </textarea>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for enhancements in text"
                  className="mt-4 w-full rounded-md border-2 border-neutral-500 px-10 py-3 "
                />
                <MagnifyingGlassIcon className="absolute left-3 top-8 h-5 w-5 text-neutral-500 " />
              </div>
              <button
                className="my-2 w-full rounded-md border border-neutral-300 bg-gray-800 p-2 text-white"
                type="button"
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
