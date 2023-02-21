import OvVideo from './OvVideo';


export default function UserVideo(props) {
    // const getNicknameTag = () => {
    //     return JSON.parse(props.streamManager.stream.connection.data).clientData;
    // };
    return (
        <div>
            {props.streamManager !== undefined ? (
                <div className="streamcomponent">
                    <OvVideo streamManager={props.streamManager} />
                </div>
            ) : null}
        </div>
    );
}
