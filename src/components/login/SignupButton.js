export default function SignupButton() {

    return (
        <div className="text-center">
            <button
                className=" w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
            >
                회원가입
            </button>

            <style jsx>{`
                    button:active {
                        transform: translateY(3px);
                        border-bottom:2px solid #f00303;
                    }
                    
                    button{
                        background-color: #f00303;
                        transition:all 0.1s;
                        border-bottom:5px solid #5c0606;
                        font-size: 18px;
                    }
                `}</style>
        </div>
    )
}