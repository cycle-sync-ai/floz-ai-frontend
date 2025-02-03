"use client"

import CloseButton from "@components/button/CloseButton";
import IconSearch from "@components/icons/IconSearch";


import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimeField, TimePicker } from "@mui/x-date-pickers";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

const Event = ({onSave, onCancel, onSaveNew}) => {
  const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs('2022-04-17'));
  const [startTime, setStartTime] = React.useState<Dayjs | null>(dayjs('2022-04-17T15:30'));
  const [endDate, setEndDate] = React.useState<Dayjs | null>(dayjs('2022-04-17'));
  const [endTime, setEndTime] = React.useState<Dayjs | null>(dayjs('2022-04-17T16:30'));
  return (
    <div className="w-[719px] h-[741px] flex flex-col">
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
            <input type="text" className="subject-input w-[98%] m-1 focus:border-none focus:outline-none" placeholder="Type in to choose" />
            <IconSearch className="absolute right-4 top-2" />
          </div>
        </div>
        <div className="description flex flex-col mt-[30px]">
          <div className="description-title text-xs">Description</div>
          <textarea className="w-[659px] h-[80px] border-2 border-gray-300 rounded-md"></textarea>
        </div>
        <div className="period flex mt-[31px] justify-between">
          <div className="start-date flex flex-col  w-[303px] h-[82px] justify-between" >
            <div className="title text-xs font-bold">Start</div>
            <div className="date flex gap-1">
              <div className="flex flex-col">
                <div className="date-title text-xs">Date</div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <div className="m-w-[100px]">
                      <DatePicker
                        value={startDate}
                        // renderInput={(props) => <TextField {...props} sx={{ height:'32px'}}/>}
                        onChange={(newValue) => setStartDate(newValue)}
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
                        value={endTime}
                        onChange={(newValue) => setEndTime(newValue)}
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
                        onChange={(newValue) => setEndDate(newValue)}
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
                        value={endTime}
                        onChange={(newValue) => setEndTime(newValue)}
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
            <input type="text" className="subject-input w-[98%] m-1 focus:border-none focus:outline-none" placeholder="Search for people" />
            <IconSearch className="absolute right-4 top-2" />
          </div>
        </div>
        <div className="w-full border-1 rounded-md bg-gray-200 my-[6px] flex justify-start h-8">
          <ChevronRightIcon className="pl-2 w-8 h-8" />
          <div className='content text-base'>TBD</div>
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
    </div>
  )
}

export default Event;