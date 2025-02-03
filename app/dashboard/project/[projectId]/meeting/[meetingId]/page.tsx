'use client'

import { useState, useEffect } from 'react'
import Sidebar from "@components/sidebar/Sidebar";
import Transcript from "@components/Meeting/Transcript";
import TodoList from "@components/Meeting/TodoList";
import MemberList from "@components/Meeting/MemberList";
import MeetingSummary from "@components/Meeting/MeetingSummary";
import Record from "@components/Record/Record";
import { getMeetingData } from '@service/meeting.service';
import { useRouter } from "next/navigation";
import UploadAudioModal from "@components/UploadAudioModal/UploadAudioModal";
import { useAuthContext } from '@contexts/AuthContext';
import { getPersons } from '@service/person.service';
import { getProjects } from "@service/project.service";
import { IUser } from '@models';
import { ToastContainer } from 'react-toastify';

import { getTodosByMeetingId } from '@service/todo.service';

interface pageProps {
  projectId: string;
  meetingId: string;
}
const Page = ({ params }: { params: pageProps }) => {
  const router = useRouter();
  const { user } = useAuthContext();
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [isTodosLoading, setIsTodosLoading] = useState(true);
  const [isEmailSummaryLoading, setIsEmailSummaryLoading] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [todoList, setTodoList] = useState({});
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isUploadAudioModal, setIsUploadAudioModal] = useState(false);
  const [peopleList, setPeopleList] = useState([]);
  const [projects, setProjects] = useState([]);
  let pollingInterval;

  const getTrascriptData = async () => {
    try{
      const meetingData = await getMeetingData(params.meetingId);
      if (meetingData.transcriptSummary || meetingData.todos || meetingData.emailSummary) {
        if (meetingData.transcriptSummary) {
          setTranscript(meetingData.transcriptSummary);
          setAudioUrl(meetingData.audioFileUrl)
          setIsSummaryLoading(false);
        }

        if (meetingData.todos) {
          setTodoList(await getTodosByMeetingId(params.meetingId));
          setIsTodosLoading(false);
        }

        if (meetingData.emailSummary) {
          setGeneratedEmail(meetingData.emailSummary);
          setIsEmailSummaryLoading(false);
        }

        if (meetingData.transcriptSummary && meetingData.todos && meetingData.emailSummary) {
          clearInterval(pollingInterval);
        }
        return;
      }
    } catch (error) {
      if (error?.response?.status === 404 && (error?.response?.data?.message == "Document not found" || error?.response?.data?.message == "Transcript not found")) {
        clearInterval(pollingInterval);
        router.push(`/dashboard/project/${params.projectId}`);
        return;
      }
      console.log("getMeetingData error", error?.response?.data);
    }
  }

  const getIntialData = async (user: IUser) => {
    try {
      const dbPersons = await getPersons({ organization: user.organization});
      if (dbPersons.length > 0) {
        setPeopleList(dbPersons);
      }

      const dbProjects = await getProjects({ userId: user._id });
      if (dbProjects.length > 0) {
        setProjects(dbProjects);
      }
    } catch (error) {
      console.log("getPersons error", error?.response?.data);
    }
  }

  useEffect(() => {
    getTrascriptData()
    // Polling mechanism with a 5-second interval
    pollingInterval = setInterval(() => {
      getTrascriptData();
    }, 5000); // 5 seconds interval

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(pollingInterval);
    };
  }, [])

  useEffect(() => {
    if (user && user.organization) {
      getIntialData(user);
    }
  }, [user])

  const onUploadComplete = () => {
    setIsSummaryLoading(true);
    setIsTodosLoading(true);
    setIsEmailSummaryLoading(true);
    getTrascriptData()
    // Polling mechanism with a 5-second interval
    pollingInterval = setInterval(() => {
      getTrascriptData();
    }, 5000);
  }

  return (
    <div className="projects-layout bg-gray-100 flex flex-row h-full">
      <div className="sidebar shadow-md w-[21%] rounded-md mx-[26px] flex flex-col  bg-white">
        <div className="grow ">
          <Sidebar persons={peopleList} projects={projects} />
        </div>
      </div>
      <div className="main-layout shadow-md rounded-md w-[52%]  flex flex-col  bg-white">
        <div className="flex w-full h-full flex-col pt-[46px] gap-4 p-4 mb-[26px] shadow-md px-[43px] 2xl:px-[80px]">
          {
            isSummaryLoading ? (
              <div className="flex flex-col justify-center items-center">
                <div className='text-[20px] text-bold text-gray-500 text-center'>Processing your audio for transcription...</div>
              </div>
            )
            :
            (
              <>
                <div className="flex justify-between items-center">
                  <div className='text-2xl font-bold'>Meeting summary by Floz:</div>
                  <div>
                    <button onClick={() => setIsUploadAudioModal(true)} className='bg-[#06A59A] hover:bg-[#28C3BB] text-white font-bold py-2 px-4 rounded'>Re-upload Audio</button>
                  </div>
                </div>
                <Record audioUrl={audioUrl} />
                <Transcript transcript={transcript}/>
              </>
            )
          }
        </div>
      </div>
      <div className="beside-layout flex flex-col h-full mr-[20px] ml-[27px] w-[28%] overflow-auto">
        <div className="grow flex flex-col overflow-auto justify-between">
          {
            isTodosLoading ? (
              <div className="flex flex-col justify-center items-center">
                <div className='text-[20px] text-bold text-gray-500 text-center'>Loading tasks from meeting...</div>
              </div>
            )
            :
            (
              <>
                <TodoList todoListData={todoList} meetingId={params.meetingId} projectId={params.projectId} />
                <MemberList  setGenerateEmail={setGeneratedEmail} todolistStr={JSON.stringify(todoList)} params={params} />
              </>
            )
          }
          {
            isEmailSummaryLoading ? (
              <div className="flex flex-col justify-center items-center">
                <div className='text-[20px] text-bold text-gray-500 text-center'>Loading meeting summary...</div>
              </div>
            )
            :
            (
              <MeetingSummary email={generatedEmail} peoples={peopleList}/>
            )
          }
        </div>
      </div>
      {
        isUploadAudioModal ? 
          <UploadAudioModal projectId={params.projectId} meetingId={params.meetingId} isShow={isUploadAudioModal} setShow={setIsUploadAudioModal} onUploadComplete={onUploadComplete} /> 
        : 
          <></>
      }

      <ToastContainer />
    </div>
  );
}

export default Page;