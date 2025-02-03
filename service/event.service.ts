import api from '../api/api';
import { IEvent } from '../models';
import { IResponse } from '@types';


export const updateEvent = async (id: string, body: IEvent) => {
    const resp: IResponse = await api.patch(`/events/${id}`, body);
    const updated: IEvent | null = resp?.data && resp.data.data as IEvent;
    return updated;
}

export const getEvent = async (id: string) => {
    const resp: IResponse = await api.get(`/events/${id}`);
    const data : IEvent | null = resp?.data && resp.data.data as IEvent;
    return data;
}

export const createEvent = async (body: IEvent) => {
    const resp: IResponse = await api.post('/events', body);
    const data: IEvent | null = resp?.data && resp.data as IEvent;
    return data;
}

export const getEvents = async (query: any) => {
    const queryParams = new URLSearchParams(query).toString();
    const resp: IResponse = await api.get(`/events?${queryParams}`);
    const data: IEvent[] = resp?.data && resp.data.data as IEvent[];
    return data;
}

export const deleteEvent = async (id: string) => {
    const resp: IResponse = await api.delete(`/events/${id}`);
    return resp;
}