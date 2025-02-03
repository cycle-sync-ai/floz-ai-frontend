import api from '../api/api';
import { ITranscript } from '../models';
import { Meeting } from '../models/meeting.model';

export const updateMeeting = async (id: string, meeting: Meeting) => {
    const resp = await api.patch(`/meetings/${id}`, meeting);
    const updatedMeeting = resp.data?.data;
    return updatedMeeting;
}

export const deleteMeeting = async (id: string) => {
    const resp = await api.delete(`/meetings/${id}`);
    const deletedMeeting = resp.data?.data;
    return deletedMeeting;
}

export const getMeeting = async (id: string) => {
    const resp = await api.get(`/meetings/${id}`);
    const meeting = resp.data?.data;
    return meeting;

}
export const getAllMeetings = async (query: any) => {
    const queryParams = new URLSearchParams(query).toString();
    const resp = await api.get(`/meetings?${queryParams}`);
    console.log(resp.data?.data);
    
    const meetings = resp.data?.data || [];
    return meetings;
}
export const createMeeting = async (meeting: Meeting) => {
    const resp = await api.post('/meetings', meeting);
    const newMeeting = resp.data?.data;
    return newMeeting;

}

export const getMeetings = async () => {
    const resp = await api.get('/meetings');
    const meetings = resp.data?.data || [];
    return meetings;
}

export const getMeetingData = async (meetingId: string): Promise<ITranscript> => {
    const resp = await api.get(`/meetings/${meetingId}/meetingData`);
    const meetingData = resp.data?.data || { transcriptSummary: "", todos: {} };
    return meetingData;
}

export const generateEmail = async (meetingId: string, body: any) => {
    const resp = await api.post(`/meetings/${meetingId}/generateEmail`, body);
    const email = resp.data?.data || "";
    return email;
}