'use client'
import { useAuthContext } from "@contexts/AuthContext";
import { updateUser } from "@service/user.service";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { isEmpty } from "@utils/func.utils";

const Page = () => {
  const [value, setValue] = useState('');
  const router = useRouter();
  const { user, setUser } = useAuthContext();
  
  if(!isEmpty(user?.organization)) {
    router.push('/dashboard/home');
  }

  const handleClicked = async (e) => {
    user.organization = value;
    await updateUser(user._id, {
      organization: value
    });
    setUser(user);
    router.push('/dashboard/home')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-96 h-96 bg-white shadow-md m-1 rounded-lg flex flex-col p-8 justify-between items-center">
        <h1 className="text-center font-bold text-[36px] ">
          Welcome to Floz!
        </h1>
        <div className="flex flex-col justify-center items-center">

          <label htmlFor="organization" className="text-lg">Organization</label>
          <input
            type="text"
            id="organization"
            value = {value}
            onChange={(e) => setValue(e.target.value)}
            className="w-[90%] rounded-md border text-center border-slate-300 m-2 p-2 pl-4
            focus:outline-gray-400 focus:border-none focus:shadow-lg"
            placeholder="Organization Name " />
            <br></br>
            <button 
            className="w-24 border-[1px] rounded-md
             bg-[#349989] focus:shadow-md text-lg p-1
              text-white"
              onClick={(e) => handleClicked(e)}>O&nbsp;&nbsp;K</button>
        </div>
      </div>
    </div>
  )
}

export default Page;