import api from '../api/api';
import { IUser, Meeting, Todo } from '../models';
import { IResponse } from '@types';



export const updateUser = async (id: string, user: IUser) => {
    const resp: IResponse = await api.patch(`/users/${id}`, user);
    const updatedUser: IUser = resp?.data && resp.data.data as IUser;
    return updatedUser;
}

export const getUser = async (id: string) => {
    const resp: IResponse = await api.get(`/users/${id}`);
    const user: IUser = resp?.data && resp.data.data as IUser;
    return user;
}

export const getUserMeetings = async (id: string) => {
    const resp: IResponse = await api.get(`/users/${id}/meetings`);
    const meetings: Meeting[] = resp?.data && resp.data.data as Meeting[];
    return meetings;
}

export const getUserTodos = async (id: string) => {
    const resp: IResponse = await api.get(`/users/${id}/todos`);
    const todos: Todo[] = resp?.data && resp.data.data as Todo[];
    return todos;
}

export const getUserByEmail = async (email: string): Promise<IUser[] | null> => {
    const resp: IResponse = await api.get(`/users?email=${email}`);
    const user = resp?.data && resp.data.data as IUser[];
    return user;

}

export const signInUser = async (user: IUser) => {
    const resp: IResponse = await api.post('/users/signIn', user);
    const signedInUser: IUser = resp?.data && resp.data.data as IUser;
    return signedInUser;
}

export const createUser = async (user: IUser): Promise<IUser> => {
    const resp: IResponse = await api.post('/users', user);
    const newUser: IUser = resp?.data?.data as IUser && resp.data.data as IUser;
    return newUser;
}

export const getUsers = async () => {
    const resp: IResponse = await api.get('/users');
    const users: IUser[] = resp?.data && resp.data.data as IUser[];
    return users;
}