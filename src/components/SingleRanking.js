import { useState, useEffect } from "react";
import Navbar from "../components/Navbar"
import axios from "axios";
import LayoutAuthenticated from "../components/LayoutAuthticated";
import Cookies from "js-cookie";

export default function Ranking() {
  const [data, setData] = useState([]);
  const [isSingle, setIsSingle] = useState(true); 

  const handleClick = () => {
    setIsSingle(!isSingle);
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  // useEffect(() => {
  //   // 데이터 가져오는 코드
  //   setData(sampleData);
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      const assessToken = Cookies.get("token");
      try {

        const response = await axios.get(API_URL + `/ranking/multi`, {
          headers: { Authorization: `Bearer ${assessToken}` },
        });
        setData((data) => [...data, ...response.data]);

      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
          <div className="ranking-box">
              <table className="ranking-list">
                <thead>
                  <tr className="table-title">
                    <td className="table-title-row">랭킹</td>
                    <td className="table-title-row">아이디</td>
                    <td className="table-title-row">시간</td>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item,index) => (
                    <tr className="table-data hover:bg-blue-500" key={item}>
                      <td className="table-data-row">
                        {index === 0 && <span role="img" aria-label="crown">👑</span>}
                        {index === 1 && <span role="img" aria-label="second place">🥈</span>}
                        {index === 2 && <span role="img" aria-label="third place">🥉</span>}
                        {index >= 3 && index + 1}
                      </td>
                      <td className="table-data-row">{item.id}</td>
                      <td className="table-data-row">{item.win} 초</td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
      <style jsx>{`
        .background-div {
          background-image: url('background-img.jpg');
          background-size: cover;
          background-position: center;
          overflow: hidden;
          z-inex: -1;
          padding: 1px;
          height: 100vh;
        }

        .center-container {
          display: flex;
          justify-content: center;
        }

        .ranking-container{
          
          background-color: transparent;
          width: 780px;
          border: none;
          padding: 5px;
          
          height: 680px;
        }
        .ranking-title{
          font-size: 40px;
          color:white;
          font-weight: bold;
         
          margin-left: 20px;

        }
        .ranking-box{
          background-color: #02339A;
          width: 97%;
          margin-left: 10px;
          margin-top: 5px;
          table-layout: auto;
          padding: 1px;
          height: 780px;
          box-shadow: 1px 1px 3px 3px #053B58;
          overflow: auto;
        }
        .ranking-list{
          background-color: #005ED4;
          box-shadow: 2px 2px 1px 1px #053B58;
          box-shadow: -1px -1px 3px 1px #053B58;
          width: 97%;
          height: 100px;
          margin: 10px 10px 10px 10px;
          border-radius: 10px;
          padding: 20px;
          text-align: center;
          
        }
        .table-title{
          width: 90%;
          background-color: #013B9A;
          color: yellow;
          text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
          height:10px;
          font-size: 25px;
          box-shadow: 2px 2px 3px 3px #053B58;
          box-shadow: -1px -1px 3px 1px #053B58;
          
        }
        .table-data{
          color: white;
          text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
          font-size: 20px;
          height: 50px
          
        }
        // .btn-1 {
        //   background: linear-gradient(0deg,
        //   rgba(6, 14, 131, 1) 0%,
        //   rgba(12, 25, 180, 1) 100%);
        //   border-radius: 10px;
        // }

        .btn-1:hover {
          background: rgb(0, 3, 255);
          background: linear-gradient(0deg,
          rgba(0, 3, 255, 1) 0%,
          rgba(2, 126, 251, 1) 100%);
        }

        button:active {
          transform: translateY(3px);
          border-bottom:2px solid #0081C9;
        }
        
        button{
            background-color: #0014FF;
            transition:all 0.1s;
            border-bottom:5px solid #050141;
            font-size: 18px;
            border-radius: 10px;
        }

        .change-btn {
          color: white;
          width: 125px;
          height: 45px;
          margin-left: 440px;
          margin-top: 10px;
        }
        .table-title-row{
        }
        .table-data-row{
        }
        ::-webkit-scrollbar {
          display: none;
        }

      `}</style>
      </>
  );   
};