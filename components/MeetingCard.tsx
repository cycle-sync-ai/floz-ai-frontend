import IconSearch from "./icons/IconSearch";

const MeetingCard = (data) => {

  return (
    <div className="border shadow-lg p-3">
      <div className="gap-3 flex justify-between sm:flex-col 2xl:flex-row">
        <h3 className="text-base font-bold">Meetings</h3>
        <div className="flex gap-3">
          <div className="border rounded py-2 px-5 flex items-center">
            <input type="text" className="focus:outline-none" placeholder="Search for a project"></input>
            <IconSearch></IconSearch>
          </div>
          <div className="border border-green-400 text-green-400 rounded py-2 px-3">New</div>
        </div>
      </div>
      <div className="p-3 mt-10">
        <div className="my-2 flex bg-gray-200 items-center p-5 gap-3">
          <img src="/dropright.svg" alt="image"></img>
          <h3>Today</h3>
        </div>
        <table className="table-fixed w-full">
          <thead>
            <tr>
              <th className="w-3/12"></th>
              <th className="w-6/12"></th>
              <th className="w-3/12"></th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-3 text-center">10:00 AM</td>
              <td className="p-3 font-semibold">Phone call with GC</td>
              <td className="p-3 underline text-center text-blue-500">Details</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 text-center">1:00 PM</td>
              <td className="p-3 font-semibold">Phone call with HVAC</td>
              <td className="p-3 underline text-center text-blue-500">Details</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 text-center">4:00 PM</td>
              <td className="p-3 font-semibold">Meeting with the client</td>
              <td className="p-3 underline text-center text-blue-500">Details</td>
            </tr>
          </tbody>
        </table>
        <div className="my-2 flex bg-gray-200 items-center p-5 gap-3">
          <img src="/dropdown1.svg" alt="image"></img>
          <h3>Tomorrow</h3>
        </div>
        <div className="my-2 flex bg-gray-200 items-center p-5 gap-3">
          <img src="/dropdown1.svg" alt="image"></img>
          <h3>Thursday (Nov.10)</h3>
        </div>
        <div className="my-2 flex bg-gray-200 items-center p-5 gap-3">
          <img src="/dropdown1.svg" alt="image"></img>
          <h3>Friday (Nov.11)</h3>
        </div>
      </div>
      <a href="#" className="underline text-lg text-blue-500 my-2 float-right mr-36">view all</a>
      <br></br><br></br>
    </div>
  )
}

export default MeetingCard;