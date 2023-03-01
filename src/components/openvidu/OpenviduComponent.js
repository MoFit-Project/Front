import { useState, useEffect, useRef } from 'react';
import { OpenVidu } from 'openvidu-browser';
import OvVideo from './OvVideo';
import { getToken } from '../../../public/createToken.js';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { isRoomHostState } from "../../recoil/states";
import SubVideo from './SubVideo';

export default function OpenViduComponent({ roomName, userName, jwtToken }) {

    // 1) OV 오브젝트 생성
    const [OV, setOV] = useState(null);
    const [session, setSession] = useState(undefined);
    const [publisher, setPublisher] = useState(undefined);
    const [subscribers, setSubscribers] = useState([]);

    const router = useRouter();
    const [isRoomHost, setIsRoomHost] = useRecoilState(isRoomHostState);
    const currentVideoDeviceRef = useRef(null);

    useEffect(() => {
        joinSession();
        return () => {
            leaveSession();
        };
    }, []);


    const onbeforeunload = (event) => {
        leaveSession();
    };

    const deleteSubscriber = (streamManager) => {
        let newSubscribers = [...subscribers];
        setSubscribers(newSubscribers.filter((v) => v !== streamManager))
    }

    const leaveSession = () => {
        const mySession = session;

        if (mySession) {
            mySession.disconnect();
        }

        setOV(null);
        setSession(undefined);
        setSubscribers([]);
        setPublisher(undefined);
        router.push(`/room`);
    }

    // 세션이 생성 됐을 때,
    useEffect(() => {
        if (session !== undefined) {
            let mySession = session;

            mySession.on('streamCreated', (event) => {
                var newsubscriber = mySession.subscribe(event.stream, undefined);
                setSubscribers((curr) => [...curr, newsubscriber]);
            });

            mySession.on('connectionCreated', (event) => {
                console.log(event.connection);
            })

            mySession.on('streamDestroyed', (event) => {
                // if (!isRoomHost.isHost) {
                //     leaveSession();
                // }
                deleteSubscriber(event.stream.streamManager);
            });

            // On every asynchronous exception...
            mySession.on('exception', (exception) => {
                console.warn(exception);
            });

            getToken(roomName, jwtToken).then((token) => {
                mySession.connect(token, { clientData: userName })
                    .then(async () => {

                        let publisher = await OV.initPublisherAsync(undefined, {
                            audioSource: undefined, // The source of audio. If undefined default microphone
                            videoSource: undefined, // The source of video. If undefined default webcam
                            publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
                            publishVideo: true, // Whether you want to start publishing with your video enabled or not
                            resolution: '480x520', // The resolution of your video
                            frameRate: 30, // The frame rate of your video
                            insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
                            mirror: false, // Whether to mirror your local video or not
                        });

                        mySession.publish(publisher);

                        var devices = await OV.getDevices();
                        var videoDevices = devices.filter(device => device.kind === 'videoinput');
                        var currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
                        var currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId);

                        currentVideoDeviceRef.current = currentVideoDevice;
                        setPublisher(publisher);
                    })
                    .catch((error) => {
                        console.log('There was an error connecting to the session:', error.code, error.message);
                    });
            });

        }
    }, [session]);

    const joinSession = async () => {
        let newOV = new OpenVidu();
        setOV(newOV);
        newOV.enableProdMode();

        // 2) session 초기화 -> useEffect 호출
        setSession(newOV.initSession());
    }

    return (

        <div className='h-screen'>
            <div className='flex justify-center' style={{ border: 'solid black' }}>
                <h1 id="session-title">{roomName}</h1>
                <button
                    className=""
                    id="buttonLeaveSession"
                    onClick={leaveSession}
                >
                    방 나가기
                </button>
            </div>

            <div className="flex justify-center">
                {session !== undefined ? (
                    <div id="session" className='flex'>
                        {publisher !== undefined ? (
                            <div id="main-video" className="col-md-6">
                                <OvVideo streamManager={publisher} userName={userName} />
                            </div>
                        ) : <div role="status">
                            <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>}

                        <div id="sub-video" className="col-md-6">
                            {subscribers.map((sub, i) => (
                                <div key={i} className="stream-container col-md-6 col-xs-6">
                                    <SubVideo streamManager={sub} />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
} 