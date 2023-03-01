import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
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
        const response = await axios.get(API_URL + "/ranking", {
          headers: { Authorization: `Bearer ${assessToken}` },
        });
        console.log(response);
        setData((data) => [...data, ...response.data]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="background-div " style={{}}>
      <>
        <LayoutAuthenticated>
          <Navbar />
          <div className="flex-col items-center flex">
            <div className="mt-2 w-8/12 flex">
              <table className="w-full table-auto">
                <thead>
                  <tr className="text-white">
                    <th className="w-1/4 py-2 px-4">RANK</th>
                    <th className="w-1/4 py-2 px-4">Id</th>
                    <th className="w-1/4 py-2 px-4">win</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr
                      className="bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                      key={item}
                    >
                      <td className="py-7 px-4 text-center whitespace-nowrap font-bold">
                        {index + 1}
                      </td>
                      <td className="py-7 px-4 text-center font-bold">
                        {item.userId}
                      </td>
                      <td className="py-7 px-4 text-center font-bold">
                        {item.win}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </LayoutAuthenticated>
      </>
      <style jsx>{`
        .background-div {
          background-image: url("background-img.jpg");
          background-size: cover;
          background-position: center;
          overflow: hidden;
          z-inex: -1;
        }

        table {
          border: 10px solid #0d4c92;
          background: linear-gradient(to right, #0096ff, #00d7ff);
        }
        .btn-1 {
          background: rgb(6, 14, 131);
          background: linear-gradient(
            0deg,
            rgba(6, 14, 131, 1) 0%,
            rgba(12, 25, 180, 1) 100%
          );
          border: none;
        }
        .btn-1:hover {
          background: rgb(0, 3, 255);
          background: linear-gradient(
            0deg,
            rgba(0, 3, 255, 1) 0%,
            rgba(2, 126, 251, 1) 100%
          );
        }
        table tr {
          border-bottom: 1px solid #e5e5e5;
        }
      `}</style>
    </div>
  );
}
