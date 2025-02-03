"use client";

import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";

interface ProjectDetailsProps {
  label: string;
  onClick: () => void;
}

// interface Attendee {
//   [
//   {
//     email: string;
//     responseStatus: string;
//     self: boolean;
//   }
// ]
// };

interface Item {
  kind: string;
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  description: string;
  location: string;
  creator: {
    email: string;
    self: boolean;
  };
  organizer: {
    email: string;
    self: boolean;
  };
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  iCalUID: string;
  sequence: number;
  attendees: [
    {
      email: string;
      responseStatus: string;
      self: boolean;
    }
  ];
  reminders: {
    useDefault: boolean;
  };
  eventType: string;
  conferenceData: {
    createRequest: {
      requestId: string;
      conferenceSolutionKey: {
        type: string;
      };
    };
    conferenceSolution: {
      key: {
        type: string;
      };
      name: string;
      iconUri: string;
    };
    conferenceId: string;
    signature: string;
  };
  hangoutLink: string;
}

function FileUpload(props: ProjectDetailsProps) {
  const { label, onClick } = props;
  return (
    <label className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600">
      <p className="text-4xl">{label}</p>
      <div className="flex flex-col items-center justify-center pb-6 pt-5">
        <svg
          className="mb-4 h-8 w-8"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 16"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
          />
        </svg>
        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold">Click to upload</span> or drag and
          drop
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          SVG, PNG, JPG or GIF (MAX. 800x400px)
        </p>
      </div>
      <input
        id="dropzone-file"
        type="file"
        placeholder="Upload"
        onChange={onClick}
        className="hidden"
      />
    </label>
  );
}

function MeetingCard({ event }: { event: Item }) {
  return (
    <div className="b-4 flex w-full max-w-xs flex-col border p-2">
      <p>{event?.summary}</p>
      <p>{format(parseISO(event?.created), "EEEE, MMMM d, yyyy")}</p>
      <p>
        {format(parseISO(event?.start?.dateTime), "h:mm a")} -
        {format(parseISO(event?.end?.dateTime), "h:mm a")}
      </p>
      {event?.attendees?.length ? (
        <p className="mt-1 text-xl font-bold">Attendees</p>
      ) : (
        <></>
      )}
      <ul>
        {event?.attendees?.map((attendee: { email: string }) => (
          <li key={attendee.email}>{attendee.email}</li>
        ))}
      </ul>
      <a
        className="b-4 my-3 w-full rounded-md border border-neutral-200 bg-gray-700 text-center text-white shadow-sm"
        href={event.hangoutLink}
        target="_blank"
      >
        Join the meeting
      </a>
    </div>
  );
}

export default function ProjectDetail(props: { pId: string; events: Item[] }) {
  const router = useRouter();
  const { pId, events } = props;

  const handleOnClick = () => {
    router.push(`/home/${pId}/transcript`);
  };

  return (
    <div className="mt-12 flex flex-col justify-between">
      <div className="flex w-full gap-4">
        <div className="flex w-full items-center justify-center">
          <FileUpload label="Meeting Transcription" onClick={handleOnClick} />
        </div>
        <div className="flex w-full items-center justify-center">
          <FileUpload label="Create your bid" onClick={handleOnClick} />
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-2">
        {events?.length === 0 ? (
          <p className="text-bold text-3xl">No upcoming meetings</p>
        ) : (
          <>
            <p className="text-2xl font-bold">Upcoming Meetings</p>
            <div className="flex gap-4">
              {events?.map((event: Item) => (
                <MeetingCard key={event.id} event={event} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
