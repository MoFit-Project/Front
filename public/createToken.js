import axios from 'axios';
import { refreshToken } from './refreshToken';

// 커스텀 APPLICATION_SERVER_URL: api 대신 mofit으로 대체하기.
//const APPLICATION_SERVER_URL = "http://localhost:5000/";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getToken = async (mySessionId, jwtToken) => {
    const sessionId = await createSession(mySessionId, jwtToken);
    return await createToken(sessionId, jwtToken);
}

const createSession = async (sessionId, jwtToken) => {
    let response;
    try {
        response = await axios.post(API_URL + '/sessions', { customSessionId: sessionId }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
            },
        });
    } catch (error) {
        const { response } = error;
        refreshToken();
    }

    return response.data; // The sessionId
}

const createToken = async (sessionId, jwtToken) => {
    let response;
    try {
        response = await axios.post(API_URL + '/sessions/' + sessionId + '/connections', {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
            },
        });
    } catch (error) {
        refreshToken();
    }

    return response.data; // The token
}