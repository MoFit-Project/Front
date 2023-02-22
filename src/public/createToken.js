import axios from 'axios';

const APPLICATION_SERVER_URL = "https://ena.jegal.shop:8080/";
// 커스텀 APPLICATION_SERVER_URL: api 대신 mofit으로 대체하기.
//const APPLICATION_SERVER_URL = "http://localhost:5000/";

export const getToken = async (mySessionId) => {
    const sessionId = await createSession(mySessionId);
    return await createToken(sessionId);
}

const createSession = async (sessionId) => {
    console.log(sessionId);
    const response = await axios.post(APPLICATION_SERVER_URL + 'mofit/sessions', { customSessionId: sessionId }, {
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response.data; // The sessionId
}

const createToken = async (sessionId) => {
    const response = await axios.post(APPLICATION_SERVER_URL + 'mofit/sessions/' + sessionId + '/connections', {}, {
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response.data; // The token
}