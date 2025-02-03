import IconSearch from "./icons/IconSearch";

const ProjectCard = () => {
  return (
    <div className="w-full border shadow-lg p-3 h-fit">
      <div className="flex justify-between items-center flex-col sm:flex-row">
        <div className="flex gap-3 my-5 sm:my-0">
          <h3 className="text-base font-bold">Projects</h3>
          <h4>As of today at 10:54 AM</h4>
          <a href="#" className="text-blue-500 underline">refresh</a>
        </div>
        <div className="gap-3 flex items-center">
          <div className="border rounded py-2 px-5 flex items-center">
            <input type="text" className="focus:outline-none" placeholder="Search for a project"></input>
            <IconSearch></IconSearch>
          </div>
          <div className="border border-green-400 text-green-400 rounded py-2 px-3">New</div>
        </div>
      </div>
      <div className="w-full border-b py-8 px-3">
        <div>
          <h3 className="text-lg font-bold text-blue-700">This month</h3>
          <table className="table-fixed w-full mt-5">
            <thead>
              <tr className="bg-gray-100">
                <th className="w-1/12 px-4 py-2"><input type="checkbox"></input></th>
                <th className="flex gap-2 w-4/12 px-4 py-2">Name<img src="/arrow.svg" alt="image"></img></th>
                <th className="w-1/12 px-4 py-2">Phase</th>
                <th className="w-2/12 px-4 py-2">Due Date</th>
                <th className="w-2/12 px-4 py-2"></th>
                <th className="w-2/12 px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2 text-center"><input type="checkbox"></input></td>
                <td className="px-4 py-2">Project 1</td>
                <td className="px-4 py-2 text-center">SD</td>
                <td className="px-4 py-2 text-center">Nov 14</td>
                <td className="px-4 py-2 text-blue-500 underline"><a href="#">Go to project</a></td>
                <td className="px-4 py-2 text-right"><select className="border rounded"></select></td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 text-center"><input type="checkbox"></input></td>
                <td className="px-4 py-2">Project 2</td>
                <td className="px-4 py-2 text-center">SD</td>
                <td className="px-4 py-2 text-center">Nov 25</td>
                <td className="px-4 py-2 text-blue-500 underline"><a href="#">Go to project</a></td>
                <td className="px-4 py-2 text-right"><select className="border rounded"></select></td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 text-center"><input type="checkbox"></input></td>
                <td className="px-4 py-2">Project 3</td>
                <td className="px-4 py-2 text-center">DD</td>
                <td className="px-4 py-2 text-center">Nov 20</td>
                <td className="px-4 py-2 text-blue-500 underline"><a href="#">Go to project</a></td>
                <td className="px-4 py-2 text-right"><select className="border rounded"></select></td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 text-center"><input type="checkbox"></input></td>
                <td className="px-4 py-2">Project 4</td>
                <td className="px-4 py-2 text-center">CD</td>
                <td className="px-4 py-2 text-center">Nov 30</td>
                <td className="px-4 py-2 text-blue-500 underline"><a href="#">Go to project</a></td>
                <td className="px-4 py-2 text-right"><select className="border rounded"></select></td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 text-center"><input type="checkbox"></input></td>
                <td className="px-4 py-2">Project 5</td>
                <td className="px-4 py-2 text-center">SD</td>
                <td className="px-4 py-2 text-center">Nov 30</td>
                <td className="px-4 py-2 text-blue-500 underline"><a href="#">Go to project</a></td>
                <td className="px-4 py-2 text-right"><select className="border rounded"></select></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <h3 className="text-lg font-bold text-blue-700 mt-5">Next month</h3>
          <table className="table-fixed w-full mt-5">
            <thead>
              <tr className="bg-gray-100">
                <th className="w-1/12 px-4 py-2"><input type="checkbox"></input></th>
                <th className="flex gap-2 w-4/12 px-4 py-2">Name<img src="/arrow.svg" alt="image"></img></th>
                <th className="w-1/12 px-4 py-2">Phase</th>
                <th className="w-2/12 px-4 py-2">Due Date</th>
                <th className="w-2/12 px-4 py-2"></th>
                <th className="w-2/12 px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2 text-center"><input type="checkbox"></input></td>
                <td className="px-4 py-2">Project 6</td>
                <td className="px-4 py-2 text-center">SD</td>
                <td className="px-4 py-2 text-center">Dec 12</td>
                <td className="px-4 py-2 text-blue-500 underline"><a href="#">Go to project</a></td>
                <td className="px-4 py-2 text-right"><select className="border rounded"></select></td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 text-center"><input type="checkbox"></input></td>
                <td className="px-4 py-2">Project 7</td>
                <td className="px-4 py-2 text-center">SD</td>
                <td className="px-4 py-2 text-center">Dec 16</td>
                <td className="px-4 py-2 text-blue-500 underline"><a href="#">Go to project</a></td>
                <td className="px-4 py-2 text-right"><select className="border rounded"></select></td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 text-center"><input type="checkbox"></input></td>
                <td className="px-4 py-2">Project 8</td>
                <td className="px-4 py-2 text-center">DD</td>
                <td className="px-4 py-2 text-center">Dec 30</td>
                <td className="px-4 py-2 text-blue-500 underline"><a href="#">Go to project</a></td>
                <td className="px-4 py-2 text-right"><select className="border rounded"></select></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <a href="#" className="underline text-lg text-blue-500 my-2 float-right mr-36">view all</a>
      <br></br><br></br>
    </div>
  )
}

export default ProjectCard;