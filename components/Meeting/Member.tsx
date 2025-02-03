import UserIcon from "@components/icons/iconUser"
import { useState } from "react";

const Member = ({ index: id, name, email, role, setSelectedPersonId: setId, generate }) => {

  return (
    <div key={id} className="p-1" onClick={() => { setId(id) }}>
      <div className="member px-1 flex justify-between gap-1 overflow-hidden">
        <div className="flex w-1/2 gap-1 overflow-hidden">
          <div className="flex items-center">
            <UserIcon />
          </div>
          <div className="flex flex-col justify-center text-gray-500">
            <h3 className="text-[13px]">{name}</h3>
            <h3 className="text-[10px]">{email}</h3>
          </div>
        </div>
        <div className="flex w-1/2 max-h-[60px] gap-1 justify-between">
          <div className="border-2 border-solid min-h-[40px] flex flex-col justify-center items-center text-gray-500 w-1/2 border-[#C9C9C9] rounded-xl text-[13px] font-bold">{role}</div>
          <button className="bg-[#06A59A] rounded-md text-[10px] w-1/2 text-white " onClick={() => { generate(id) }}>Generate<br />Email</button>
        </div>
      </div>
    </div>
  )
}

export default Member;