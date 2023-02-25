import { useState, useEffect, useRef } from 'react';
import { OpenVidu } from 'openvidu-browser';
import OvVideo from './OvVideo';
import { getToken } from '../../public/createToken.js';
import { useRouter } from 'next/router';

export default function OpenViduComponent({ roomName, userName, token }) {

    const [OV, setOV] = useState(null);
    const [mySessionId, setMySessionId] = useState(roomName);
    const [myUserName, setMyUserName] = useState(userName);

    const [session, setSession] = useState(undefined);
    const [mainStreamManager, setMainStreamManager] = useState(undefined);
    const [publisher, setPublisher] = useState(undefined);
    const [subscribers, setSubscribers] = useState([]);
    const router = useRouter();

    const currentVideoDeviceRef = useRef(null);


    useEffect(() => {
        window.addEventListener('beforeunload', onbeforeunload);
        return () => {
            window.removeEventListener('beforeunload', onbeforeunload);
        };
    }, []);

    useEffect(() => {
        joinSession();
    }, []);

    const onbeforeunload = (event) => {
        leaveSession();
    };

    const deleteSubscriber = (streamManager) => {
        let newSubscribers = subscribers;
        let index = newSubscribers.indexOf(streamManager, 0);
        if (index > -1) {
            newSubscribers.splice(index, 1);
            setSubscribers(newSubscribers)
        }
    }

    const leaveSession = () => {
        const mySession = session;

        if (mySession) {
            mySession.disconnect();
        }

        setOV(null);
        setSession(undefined);
        setSubscribers([]);
        setMainStreamManager(undefined);
        setPublisher(undefined);

        router.push(`/room`);
    }

    useEffect(() => {
        if (session !== undefined) {
            var mySession = session;

            mySession.on('streamCreated', (event) => {
                // Subscribe to the Stream to receive it. Second parameter is undefined
                // so OpenVidu doesn't create an HTML video by its own
                var newsubscriber = mySession.subscribe(event.stream, undefined);

                // Update the state with the new subscribers
                setSubscribers([...subscribers, newsubscriber]);
            });

            // On every Stream destroyed...
            mySession.on('streamDestroyed', (event) => {
                // Remove the stream from 'subscribers' array
                deleteSubscriber(event.stream.streamManager);
            });

            // On every asynchronous exception...
            mySession.on('signal:game_start', (event) => {
                console.log(event.data); // Message
                //console.log(event.from); // Connection object of the sender
                console.log(event.type); // The type of message
            });

            // On every asynchronous exception...
            mySession.on('exception', (exception) => {
                console.warn(exception);
            });

            getToken(mySessionId, token).then((token) => {
                // First param is the token got from the OpenVidu deployment. Second param can be retrieved by every user on event
                // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
                mySession.connect(token, { clientData: myUserName })
                    .then(async () => {
                        // --- 5) Get your own camera stream ---

                        // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
                        // element: we will manage it on our own) and with the desired properties
                        let publisher = await OV.initPublisherAsync(undefined, {
                            audioSource: undefined, // The source of audio. If undefined default microphone
                            videoSource: undefined, // The source of video. If undefined default webcam
                            publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
                            publishVideo: true, // Whether you want to start publishing with your video enabled or not
                            resolution: '320x240', // The resolution of your video
                            frameRate: 30, // The frame rate of your video
                            insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
                            mirror: false, // Whether to mirror your local video or not
                        });

                        // --- 6) Publish your stream ---

                        mySession.publish(publisher);

                        // Obtain the current video device in use
                        var devices = await OV.getDevices();
                        var videoDevices = devices.filter(device => device.kind === 'videoinput');
                        var currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
                        var currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId);

                        // Set the main video in the page to display our webcam and store our Publisher
                        currentVideoDeviceRef.current = currentVideoDevice;
                        setMainStreamManager(publisher);
                        setPublisher(publisher);
                    })
                    .catch((error) => {
                        console.log('There was an error connecting to the session:', error.code, error.message);
                    });
            });

        }
    }, [session]);

    const joinSession = async () => {
        const newOV = new OpenVidu();
        newOV.enableProdMode();
        setOV(newOV);

        const newSession = newOV.initSession();
        setSession(newSession);
    }

    return (
        <div className='h-screen'>
            <div className='flex justify-center border-solid hover:border-dotted' style={{ border: 'solid black' }}>
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
                    <div id="session">
                        {mainStreamManager !== undefined ? (
                            <div id="main-video" className="col-md-6">
                                <OvVideo streamManager={mainStreamManager} />
                            </div>
                        ) : null}
                        <div id="sub-video" className="col-md-6">
                            {subscribers.map((sub, i) => (
                                <div key={i} className="stream-container col-md-6 col-xs-6">
                                    <OvVideo streamManager={sub} />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
} 