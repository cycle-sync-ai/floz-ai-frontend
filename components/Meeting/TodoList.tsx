"use client"

import { useEffect, useState, Fragment } from 'react'
import ToggleButton from "@components/button/ToogleButton";
import Task from "./Task";
import Todo from '@models/todo.model'
import { createTodo, getTodosByMeetingId, deleteTodo, deleteTodosByMeetingId, updateTodo } from 'service/todo.service'
import { id } from 'date-fns/locale';
import { log } from 'console';
import { Dialog, Transition } from '@headlessui/react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { Meeting } from '@models';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';

// for the test data
const testData = [
  {
    title: 'Joseph',
    content: '- Work on cost estimation for adding a new window to the bathroomn\n- Send different window types with prices to Hanian\n- Make a note to send a follow-up email to Hania',
    date: '2023-11-17T11:41:25.267Z'
  },
  {
    title: 'Hania',
    content: '- Receive cost estimation for new windown\n- Receive different window types with pricesn\n- Receive follow-up email from Joseph',
    date: '2023-11-17T11:41:25.267Z'
  }
]

// the list of tasks in the meeting summary
const TaskList = ({ data: todoList, assignedPersonList, editTask, handleClick, handleRemove }) => {
  const [personList, setPersonList] = useState([]);
  useEffect(() => {
    setPersonList(assignedPersonList)
  }, [])
  console.log(assignedPersonList, "assignedpersonList");
  return (
    <>
      {

        assignedPersonList.map((assignedPerson, index) => (
          <Task
            editTask={editTask}
            key={index}
            personName={assignedPerson}
            taskList={(todoList?.filter((task) => task.assignedPerson === assignedPerson))}
            handleRemove={handleRemove}
            handleClick={handleClick} />
        ))
      }

    </>
  );
};

const TodoList = ({ todoListData, meetingId, projectId }) => {

  const [formData, setFormData] = useState({ _id: '', assignedPerson: '', title: '', description: '', meetingId: '', dueDate: null });
  const [isOpenAddTask, setIsOpenAddTask] = useState({ modalType: 'add', isOpen: false });
  const [assignedPersonList, setAssignedPersonList] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [todoList, setTodoList] = useState([]);
  const [selectedId, setSelectedTodoId] = useState(-1);
  const [dueDate, setDueDate] = useState<Date | any>(null);

  useEffect(() => {
    setTodoList(todoListData);
  }, []);

  useEffect(() => {
    const tempAssignList = [];
    todoList.forEach((todo, index) => {
      if (!tempAssignList.includes(todo.assignedPerson)) {
        tempAssignList.push(todo.assignedPerson);
      }
    })
    setAssignedPersonList(tempAssignList);
  }, [todoList])

  const handleClickedTodo = (id) => {
    setSelectedTodoId(id);
  }

  const handleRemove = async (id) => {
    setTodoList(todoList.filter((todo, index) => todo._id !== id));
    await deleteTodo(id);
  }

  const clearTodoList = async () => {
    setTodoList([]);
    await deleteTodosByMeetingId(meetingId);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    // Access the form element by name
    const title = form.get("title");
    const description = form.get("description");
    const assignedPerson = form.get("assignedPerson");
    // const meetingId = form.get("meetingId");
    // const dueDate = form.get("dueDate");
    setIsSubmit(true);

    if (description && title) {
      let projectReq = {
        assignedPerson: assignedPerson.toString(),
        title: title.toString(),
        description: description.toString(),
        projectId: projectId,
        status: 'pending',
        meetingId: meetingId,
        dueDate: formData.dueDate
      }
      if (projectReq.title === "" || projectReq.description === "" || projectReq.meetingId === "" || projectReq.dueDate === "") {
        alert("Please fill all the fields");
        setIsSubmit(false);
        return;
      }
      if (isOpenAddTask.modalType === 'edit' && formData._id) {

        const updateTask = await updateTodo(formData._id, { ...projectReq, });
        if (updateTask) {
          const updateTodo = todoList.filter((todo) => todo._id === formData._id)[0];
          updateTodo.title = title.toString();
          updateTodo.description = description.toString()
          updateTodo.dueDate = formData.dueDate
        }
        setIsSubmit(false);
        setIsOpenAddTask({ modalType: 'add', isOpen: false });
      } else {

        const savedProject = await createTodo(projectReq);
        if (savedProject) setTodoList([...todoList, savedProject]);
        setIsSubmit(false);
        setIsOpenAddTask({ modalType: 'add', isOpen: false });
      }
    }
  };

  function onAddTask() {
    setDueDate(null);
    setIsOpenAddTask({ modalType: 'add', isOpen: true });
    setFormData({ _id: '', assignedPerson: '', title: '', description: '', meetingId: '', dueDate: null });
  }

  function closeModal() { setIsOpenAddTask({ modalType: 'add', isOpen: false }); }

  function onEditTask(task) {
    setDueDate(new Date(task.dueDate));
    setSelectedTodoId(task._id);
    setIsOpenAddTask({ modalType: 'edit', isOpen: true });
    setFormData({ _id: task._id,assignedPerson:task.assignedPerson, title: task.title, description: task.description, meetingId: task.meetingId, dueDate: task.dueDate });
  }

  return (
    <div className="todoList h-[35%] mx-2 flex flex-col 
      justify-center rounded-xl bg-white shadow-[0px_4px_4px_rgba(1,1,1,0.5)]"
      style={{ scrollbarWidth: 'none' }}>
      <div className="todolist-header flex justify-between w-full p-4 items-center">
        <h2 className="font-bold text-[21px]">To do list:</h2>
        <div className="flex items-center gap-4">
          <p className="text-[12px]">Matching tasks by AI</p>
          <ToggleButton />
        </div>
      </div>
      <div className="grow todolist-tasks flex flex-col gap-1 px-6 overflow-auto">
        <TaskList data={todoList} handleClick={handleClickedTodo} editTask={ onEditTask} assignedPersonList={assignedPersonList} handleRemove={handleRemove} />
      </div>
      <div className="todolist-footer flex justify-between px-6 my-2">
        <button className="text-[13px] text-[#06A59A]  hover:text-[#A8EFEA]" onClick={() => onAddTask()}>Add taks</button>
        <button className="text-[13px] text-[#06A59A]  hover:text-[#A8EFEA]" onClick={() => { clearTodoList() }}>Remove All</button>
      </div>
      <div className="z-20 flex gap-x-4">
        <div className="z-20 flex gap-x-4">
          <Transition appear show={isOpenAddTask.isOpen} as={Fragment}>
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
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900"  >
                        {isOpenAddTask.modalType == 'add' ? 'Add' : 'Edit'} new task
                      </Dialog.Title>
                      <div className="my-10">
                        <form onSubmit={handleSubmit}>
                          <input
                            type="text"
                            id="assignedPerson"
                            name="assignedPerson"
                            required
                            value={formData.assignedPerson}
                            placeholder="Assigned Person"
                            onChange={(e) => setFormData({ ...formData, assignedPerson: e.target.value })}
                            className={`w-full rounded-md border p-2 my-1 px-4 outline-none ${formData.assignedPerson == '' && isSubmit ? 'border-red-500' : 'border-gray-300'}}`}
                          />
                          <input
                            type="text"
                            id="name"
                            name="title"
                            required
                            value={formData.title}
                            placeholder="Title"
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className={`w-full rounded-md border p-2 my-1 px-4 outline-none ${formData.title == '' && isSubmit ? 'border-red-500' : 'border-gray-300'}}`}
                          />
                          <input
                            type="text"
                            id="name"
                            name="description"
                            required
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className={`w-full rounded-md border p-2 px-4 my-2 outline-none `}
                          />
                          <div>
                            {/* <select id="countries" className={`bg-gray-50 my-1 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${selectedMeetingId == '' && isSubmit ? 'dark:border-red-600 border-red-500' : 'dark:border-gray-600 border-gray-300'}`}
                              // defaultValue={'Select Meeting'}
                              onChange={(event) => {
                                setFormData({ ...formData, meetingId: event.target.value });
                                setSelectedMeetingId(event.target.value)
                              }}
                              value={meetings.findIndex((meeting) => meeting._id == selectedMeetingId) > -1 ? meetings[meetings.findIndex((meeting) => meeting._id == selectedMeetingId)]._id : ''}
                            >
                              <option selected>Select Meeting</option>
                              {meetings.map((meeting: Meeting) => (<option value={meeting?._id}>{meeting?.summary}</option>))}
                            </select> */}

                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DemoContainer components={['DatePicker']}>
                                <div className="m-w-[100px]">
                                  <DatePicker
                                    value={moment(dueDate)}
                                    slotProps={{ textField: { placeholder: 'Due Date' } }}
                                    onChange={(newValue) => setFormData({ ...formData, dueDate: newValue })}
                                  />
                                </div>
                              </DemoContainer>
                            </LocalizationProvider>
                          </div>
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
  )
}

export default TodoList;