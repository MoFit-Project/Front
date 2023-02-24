const background = () => (
    <div>
        <video className="bg-video" autoPlay loop muted>
            <source src="/dragon.mp4" type="video/mp4"/>
        </video>
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