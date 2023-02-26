import { useState, useEffect } from "react";
import Navbar from "../components/Navbar"

const sampleData = [
  { rank: 1, name: "John", score: 300 },
  { rank: 2, name: "George", score: 100 }
];

export default function Ranking() {
  const [data, setData] = useState([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  // useEffect(() => {
  //   // 데이터 가져오는 코드
  //   setData(sampleData);
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL+"/ranking");
        setData((data) => [...data, ...response.data]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
    <Navbar />
    <div className="container mx-auto my-10 mt-2" style={{ width: "60vw" }}>
      <div className="mt-2 rounded-lg">
        <table className="table-fixed w-full">
          <thead>
            <tr className="bg-green-200 text-green-600 text-sm uppercase">
              <th className="w-1/5 py-3 px-4 font-semibold">RANK</th>
              <th className="w-1/5 py-3 px-4 font-semibold">NICK NAME</th>
              <th className="w-1/5 py-3 px-4 font-semibold">SCORE</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-bold">
            {data.map((item) => (
              <tr className="border-b border-gray-200 hover:bg-gray-100" key={item.rank}>
                <td className="py-3 px-4 text-center whitespace-nowrap">{item.rank}</td>
                <td className="py-3 px-4 text-center">{item.name}</td>
                <td className="py-3 px-4 text-center">{item.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
    
  );
};
