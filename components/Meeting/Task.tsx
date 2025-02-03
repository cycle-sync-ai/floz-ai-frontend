
import CloseButton from '@components/button/CloseButton';

import { parseISO, format } from 'date-fns';
import { useState, useEffect } from 'react';

// Component that display the data into Nov 17 type
const DateConverter: React.FC<{ dateString: string }> = ({ dateString }) => {


  const formattedDate = format((new Date(dateString)), 'MMM d');

  return <div className="text-gray-700">{formattedDate}</div>;
};

// Task component
const Task = ({ taskList, personName = 'Someone', handleRemove, editTask, ...children }) => {

  return (
    <div className='relative'>
      <div
        {...children}
        className="p-1 text-xs m-1 border-2 rounded-md
                    border-[#C9C9C9] border-solid flex flex-col hover:bg-[#FBF3E0]">
        <div className='flex justify-between font-md mb-2'>
          <p className='text-xs text-gray-500'>{personName}</p>
        </div>
        <div className='flex justify-between gap-2'>
          <div className='ml-2 text-[13px] flex flex-col gap-2 w-full'>
            {
              taskList?.map((task, index) => (
                task ?
                  <div key={index} className='flex w-full justify-between items-start' >
                    <div className='flex grow' onClick={(e) => {e.preventDefault(); editTask(task)}}>

                      <div className='bg-gray-100 border-[1px] rounded-md grow border-gray-100 shadow-sm p-1'>
                        <div>{task.title}</div>
                        <div className='ml-2'>{task.description}</div>
                      </div>
                    </div>
                    <div className='flex'>
                      <div className='date h-full flex flex-col  text-left'>
                        <DateConverter dateString={task.dueDate} />
                      </div>
                      <button className='w-4 hover:bg-gray-200' onClick={(e) => {e.preventDefault(); handleRemove(task._id) }} >X</button>
                    </div>
                  </div> : <></>
              ))
            }
          </div>
        </div>
      </div>
    </div>

  )
}

export default Task;