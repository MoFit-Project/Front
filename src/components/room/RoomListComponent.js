export default function RoomListComponent() {

    return (
        <a className="inline-flex flex-col items-between rounded-lg shadow hover:bg-gray-100">
            <img className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg" src="/docs/images/blog/image-4.jpg" alt="" />
            <div className="flex flex-col justify-between p-4 ">
                <p className="bg-slate-50">방제목</p>
                <small className="text-right">1/2</small>
            </div>
        </a>
    );
}