export default function Loading() {

    return (
        <div role="status" className='spinner-container'>
            <img src="/loading.svg" alt="loading img"/>
            <span className='loading-tag'>로딩중...</span>
            <style jsx>{`
                .spinner-container{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    z-index: 3;
                    color: white;
                    font-size: 24px;
                }
            `}</style>
        </div>
    )
}