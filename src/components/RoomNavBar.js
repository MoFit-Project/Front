export default function RoomNavBar({ roomName }) {
    return (
        <>
            <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-2 mx-auto rounded" style={{ width: "30vw" }}>
                <div className="flex items-center flex-shrink-0 text-white mr-6">
                    <svg className="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"></svg>
                    <span className="font-semibold text-xl tracking-tight">MOFIT</span>
                </div>
                <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                    <div className="text-sm lg:flex-grow">
                        <span className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                            {roomName}
                        </span>
                        <a className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                            랭킹
                        </a>
                    </div>

                </div>
            </nav>
            {children}
        </>
    )
}
