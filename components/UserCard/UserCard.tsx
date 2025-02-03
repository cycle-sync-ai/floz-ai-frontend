/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { Fragment, useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import Todo from "@models/todo.model";
import { IUser } from "@models";
import { getTodos, deleteTodo, updateTodoStatus } from "@service/todo.service";
import { Dialog, Transition } from "@headlessui/react";
import moment from "moment";

export default function UserCard({
  data
}: {
  data: {
    todos: Todo[] | null,
  };
}) {
  const [currentUser, setCurrentUser] = useState<IUser>();
  const { user } = useAuthContext();
  const [toDoList, setToDoList] = useState<Todo[] | null>(data.todos.filter(todo => todo.status === 'pending'));
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState({ todo: null, modalType: 'delete', isOpen: false });

  useEffect(() => { if (user) { setCurrentUser(user); getTodosList(); } }, [user]);
  const truncateSummary = (summary, maxWords) => {
    const words = summary?.split(' ');
    const truncatedSummary = words?.slice(0, maxWords).join(' ');
    return words?.length > maxWords ? truncatedSummary + '...' : truncatedSummary;
  };
  //Get to do list
  function getTodosList() {
    return getTodos().then((res) => {
      setToDoList(res.filter((todo: any) => todo.status === 'pending'));
      setIsOpenConfirmModal({ todo: null, modalType: 'delete', isOpen: false });

    });
  }

  //Confirm modal delete task
  function onConfirmUpdateStatus(todo: any, modalType) {

    if (modalType === 'delete') {
      deleteTodo(todo._id).then(() => {
        return getTodosList();
      }).catch(console.log);

    } else {
      updateTodoStatus(todo._id, { status: 'completed' }).then((res) => {
        if (res) getTodosList();
      }).catch(console.log);
    }

  }
  return (
    <div className="w-full justify-around bg-emerald-300 bg-opacity-20 py-16 px-10 rounded shadow border border-stone-300 mb-5 grid grid-cols-2">
      <div className="flex items-center">
        <div className="flex flex-col">
          <h1 className="font-bold text-3xl">Welcome{currentUser?.name ? `, ${currentUser?.name}` : ''}</h1>
          <p>Check out these suggestions to start your day!</p>
        </div>
      </div>


      <div className="grid grid-cols-2 gap-4">

        {toDoList.map(todo => (
          <div key={todo._id} className="flex justify-between items-start border rounded border-stone-300 px-3 py-3 bg-white" >
            <div className="pr-2">
              <input type="checkbox" checked={(todo._id == isOpenConfirmModal.todo?._id) && isOpenConfirmModal.modalType != 'delete' ? true : false} className="border-gray-300 cursor-pointer rounded " onChange={(e) => {
                console.log(e, 'event');
                setIsOpenConfirmModal({ modalType: 'update', isOpen: true, todo: todo })
              }} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm">{truncateSummary(todo?.title, 5)}</h3>
              <p className="text-sm" >{typeof todo.meetingId === 'string' ? "" : truncateSummary(todo?.description, 10) || ""}</p>
            </div>
            <div className="flex flex-col justify-between items-end text-right">
              <div>
                <svg className="cursor-pointer" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={(e) => setIsOpenConfirmModal({ todo: todo, modalType: 'delete', isOpen: true })}>
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.53863 7.81555L13.5386 3.78478C13.7232 3.60017 13.7232 3.32324 13.5386 3.13863L12.9232 2.49247C12.7386 2.30786 12.4617 2.30786 12.2771 2.49247L8.24632 6.52324C8.12324 6.64632 7.93863 6.64632 7.81555 6.52324L3.78478 2.4617C3.60017 2.27709 3.32324 2.27709 3.13863 2.4617L2.49247 3.10786C2.30786 3.29247 2.30786 3.5694 2.49247 3.75401L6.52324 7.78478C6.64632 7.90786 6.64632 8.09247 6.52324 8.21555L2.4617 12.2771C2.27709 12.4617 2.27709 12.7386 2.4617 12.9232L3.10786 13.5694C3.29247 13.754 3.5694 13.754 3.75401 13.5694L7.78478 9.53863C7.90786 9.41555 8.09247 9.41555 8.21555 9.53863L12.2463 13.5694C12.4309 13.754 12.7079 13.754 12.8925 13.5694L13.5386 12.9232C13.7232 12.7386 13.7232 12.4617 13.5386 12.2771L9.53863 8.24632C9.41555 8.12324 9.41555 7.93863 9.53863 7.81555Z" fill="#747474" />
                </svg>
              </div>
              <div>
                <p className="todo-card-content-desc mt-2" >{moment(todo?.dueDate).format('MMM Do')}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="z-20 flex gap-x-4">
        <div className="z-20 flex gap-x-4">
          <Transition appear show={isOpenConfirmModal.isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => { setIsOpenConfirmModal({ todo: null, modalType: 'delete', isOpen: false }) }}>
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
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-xl transition-all">
                      <Dialog.Title as="h3" className="text-md mt-4 font-medium leading-6 text-gray-900"  >
                        Are you sure you want to {isOpenConfirmModal.modalType == 'delete' ? 'delete' : 'update status'} this task?
                      </Dialog.Title>
                      <div className="my-4 text-center">
                        <button
                          type="submit"
                          className="mt-1 mx-4 py-2 inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={() => {
                            onConfirmUpdateStatus(isOpenConfirmModal.todo, isOpenConfirmModal.modalType);
                          }}>
                          Confirm
                        </button>
                        <button
                          type="submit"
                          className="mt-1 mx-4 py-2 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={() => { setIsOpenConfirmModal({ todo: null, modalType: 'delete', isOpen: false }) }}>
                          Cancel
                        </button>
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
