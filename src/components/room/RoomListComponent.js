export default function RoomListComponent({ roomName, person }) {

    return (
        <div className="container w-80">
            <div className=" w-full p-3 inline-flex rounded-lg shadow ">
                <div className="flex flex-col w-full justify-between">
                    <div className="w-full items-start">
                        <p className="inset-shadow elem-contents rounded-md p-2 text-md room-elem">{roomName ? roomName : '방 제목'}</p>
                    </div>
                    <div className="flex justify-between mt-2">
                        <button className="elem-contents enter-btn w-32 room-elem rounded-md text-sm">입장</button>
                        <small className="inset-shadow elem-contents rounded-md room-elem p-1">{person ? person : 1}/2</small>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .container {
                    margin: 0px auto;
                    background-color: #12DEFF;
                    border-radius: 10px;
                    box-shadow: 1px 1px 1px 1px #006ECC;
                    border-top:2px solid #ffff;
                    border-left:2px solid #ffff;
                }
                .inset-shadow {
                    box-shadow: .4px .4px .4px .4px inset #053b58;
                }
                .enter-btn {
                    border-bottom: 3px solid #034279;
                    border-right: 1.5px solid #034279;
                    border-top: 1px solid white;
                    border-left: .5px solid white;
                    transition:all 0.1s;
                }
                .enter-btn:active {
                    transform: translateY(2px);
                    border-bottom: 1px solid #034279;
                    border-right: 0px solid #034279;
                }
                
                .elem-contents{
                    background-color: #0594E0;
                }
                .room-elem {
                    background-color: #0081C9;
                    {/* border-top:1px solid #ffff;
                    border-left:1px solid #ffff; */}
                    color: white;
                    -webkit-text-stroke: 0.3px black;
                    text-stroke: 0.5px black;
                    
                }
                p,small,button {
                }
            `}</style>
        </div >
    );
}