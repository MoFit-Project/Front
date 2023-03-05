const background = ({children}) => (
        <div style={{
            position:'relative',
            width: '100vw',
            height: '100vh'
        
        }}
        >
        <img className={"bg-video"} src="gameBoy.gif" />
        
        <div style={{
            position:'absolute', 
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
            
        }}>
        {children}
        </div>
        <style jsx>{`
          .bg-video {
            
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