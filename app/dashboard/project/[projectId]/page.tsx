import ProjectView from "@components/ProjectView/ProjectView";

import { cookies } from "next/headers";
import { getProject } from "@service/project.service";
import { getTodos, getAllTodos} from "@service/todo.service";
import { getMeetings,getAllMeetings } from "@service/meeting.service";

interface pageProps {
  projectId: string;
}

export default async function Page({ params }: { params: pageProps }) {
  const cookieStore = cookies();
  const userId = cookieStore.get("user_id")?.value;
  const providerToken = cookieStore.get("p_token")?.value;
  const project = await getProject(params.projectId);
  const meetings = await getAllMeetings({ projectId: params.projectId });
  const todolist = await getAllTodos(params.projectId);

  return (
    <>
      <ProjectView data={{ project, todolist, meetings, userId, providerToken }} />
    </>
  );
}


