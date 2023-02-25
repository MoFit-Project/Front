import axios from 'axios';


// 커스텀 APPLICATION_SERVER_URL: api 대신 mofit으로 대체하기.
//const APPLICATION_SERVER_URL = "http://localhost:5000/";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getToken = async (mySessionId, jwtToken) => {
    const sessionId = await createSession(mySessionId, jwtToken);
    return await createToken(sessionId, jwtToken);
}

const createSession = async (sessionId, jwtToken) => {
    const response = await axios.post(API_URL + '/mofit/sessions', { customSessionId: sessionId }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
        },
    });
    return response.data; // The sessionId
}

const createToken = async (sessionId, jwtToken) => {
    const response = await axios.post(API_URL + '/mofit/sessions/' + sessionId + '/connections', {}, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
        },
    });
    return response.data; // The token
}