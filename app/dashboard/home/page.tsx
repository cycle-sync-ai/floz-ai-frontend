import ProjectPanel from "@components/ProjectPanel/ProjectPanel";
import UserCard from "@components/UserCard/UserCard";
import { getProjects } from "@service/project.service";
import { cookies } from "next/headers";
import { getUserMeetings, getUserTodos } from "@service/user.service";
import { IProject, Meeting, Todo } from "@models";

export const revalidate = 0;

export default async function Page() {
  const cookieStore = cookies();
  const userId = cookieStore.get("user_id")?.value;
  const providerToken = cookieStore.get("p_token")?.value;

  let projects: IProject[] = [];
  let meetings: Meeting[] = [];
  let todos: Todo[] = [];

  try {
    // Get projects from backend api
    projects = await getProjects({ userId });

    // Get meetings from backend api
    meetings = await getUserMeetings(userId);

    // Get todos from backend api
    todos = await getUserTodos(userId);
  } catch (error) {
    // Handle errors here, if needed
    console.error("Could not load projects, meetings, or todos:", error);
  }

  return (
    <div className="flex flex-col">
      <UserCard data={{ todos }} />
      <ProjectPanel data={{ projects, meetings, userId, providerToken }} />
    </div>
  );
}
