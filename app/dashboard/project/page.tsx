import ProjectItems from "@components/ProjectItems/ProjectItems";
import { cookies } from "next/headers";
import { getProjects } from "@service/project.service";
import { getPersons } from "@service/person.service";
import Sidebar from "@components/sidebar/Sidebar";

export const revalidate = 0;

export default async function Page() {
  const cookieStore = cookies();
  const userId = cookieStore.get("user_id")?.value;
  const organization = cookieStore.get("user_organization")?.value;

  // Get projects from backend api
  const projects = await getProjects({ userId });
  const persons = await getPersons({ organization });

  return (
    <>
      <div className="w-full items-center justify-between h-full">
        <div className="grid grid-cols-5 gap-4 h-full">
          <div className="col-span-1 border rounded border-stone-300 px-3 py-3 bg-white card_shadow">
            <Sidebar persons={persons} projects={projects} />
          </div>

          <div className="col-span-3">
            <ProjectItems projects={projects} />
          </div>
        </div>
      </div>
    </>
  );
}
