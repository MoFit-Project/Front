const background = () => (
    <div>
        <img className={"bg-video"} src="dragon.gif" />
        <style jsx>{`
          .bg-video {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            z-index: -1;
            object-fit: cover;
            opacity:0.8;          
            }
        `}
        </style>
    </div>
);
export default background;