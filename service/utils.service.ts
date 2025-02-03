import api from '../api/api';
import { IResponse } from '@types';


export const sendEmail = async (email: Array<string>, content: string, oAuthToken: string, refreshToken: string) => {
    const resp: IResponse = await api.post(`/sendEmail`, {
        email,
        content,
        oAuthToken,
        refreshToken
    });

    return resp;
}