export default function RoomListComponent() {

    return (
        <div className="w-full rounded-md room-tag" >
            <div className="w-full p-2 inline-flex rounded-lg shadow">
                <div>
                    <img className="w-32 h-20 rounded-md shadow-lg" src="/thumnail.jpg" alt="" />
                </div>
                <div className="flex flex-col w-full justify-between ml-4">
                    <div className="w-full items-start">
                        <p className="rounded-md p-1 bg-sky-500 room-elem">방제목</p>
                    </div>
                    <div className="flex justify-end">
                        <small className="bg-sky-500 rounded-md room-elem p-1">1/2</small>
                    </div>
                </div>
            </div>
            <style jsx>{`
                    .room-tag:active {
                        transform: translateY(3px);
                        border-bottom:2px solid #0081C9;
                    }
                    .room-tag {
                        background-color: #86E5FF;
                        transition:all 0.1s;
                        border-bottom:5px solid #0081C9;
                    }
                        .color-5 {
                        background-color: #86E5FF;
                    }
                        .color-1 {
                        background-color: #0081C9;
                    }

                    .room-elem {
                        box-shadow: 1px 2px;
                    }
                `}</style>
        </div >
    );
}