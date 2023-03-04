import { useState, useEffect } from "react";
import Navbar from "../components/Navbar"
import axios from "axios";
import LayoutAuthenticated from "../components/LayoutAuthticated";
import Cookies from "js-cookie";

export default function Ranking() {
  const [data, setData] = useState([]);
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
    <div className="background-div ">
    <>
    <LayoutAuthenticated>
    <Navbar />
      <div className="center-container mt-2">
        <div className="ranking-container">
          <h2 className="ranking-title">랭킹 게시판</h2>
          <div className="ranking-box">
            <table className="ranking-list">
              <thead>
                <tr className="table-title">
                  <td className="table-title-row">랭킹</td>
                  <td className="table-title-row">아이디</td>
                  <td className="table-title-row">전적</td>
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
                    <td className="table-data-row">{item.win}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </LayoutAuthenticated>
      </>
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
          background-color: #0DDFFF;
          width: 750px;
          border-radius: 10px;
          padding: 5px;
          box-shadow: 3px 3px 8px .1px #053B58;
          height: 680px;
        }
        .ranking-title{
          font-size: 33px;
          color:white;
          font-weight: bold;
          -webkit-text-stroke-width: 1px;
	        -webkit-text-stroke-color: #005ED4;
          margin-left: 10px;

        }
        .ranking-box{
          background-color: #02339A;
          border-radius: 10px;
          width: 97%;
          margin-left: 10px;
          margin-top: 5px;
          table-layout: auto;
          padding: 1px;
          height: 611px;
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
        .table-title-row{
        }
        .table-data-row{
        }


      `}</style>
      </div>
  );
};
