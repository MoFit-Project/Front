import { useState } from 'react';
import axios from 'axios';
import Image from "next/image";

function SignupForm() {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://15.164.145.252:8080/register', { "username":id, "password":password });
      console.log(response.data);

      // 가입에 성공한 경우, 첫 로그인 화면으로 이동
      window.location.href = '/';
    } catch (error) {
      console.error(error);
      // 가입에 실패한 경우,

    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
        <img class="mx-auto h-12 w-auto" src="https://cdn-icons-png.flaticon.com/512/7420/7420915.png" alt="Your Company"></img>
        <h1 className="text-4xl font-bold text-center mb-8 text-green-700">Mofit</h1>
        <form onSubmit={handleSubmit}>
          {/* <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
              이름
            </label>
            <input
              type="text"
              id="name"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder=""
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div> */}
          <div className="mb-4 ">
            <label htmlFor="id" className="block text-gray-700 font-bold mb-2">
              아이디
            </label>
            <input
              type="text"
              id="id"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder=""
              value={id}
              onChange={(event) => setId(event.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder=""
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              가입하기
            </button>
          </div>
        </form>
      
    </div>
  );
}

export default SignupForm;
