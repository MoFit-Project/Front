import { useState } from 'react';
import axios from 'axios';
import Image from "next/image";

function SignupForm() {
  const [id, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/api/signup', { id, password });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
        <img class="mx-auto h-12 w-auto" src="https://cdn-icons-png.flaticon.com/512/7420/7420915.png" alt="Your Company"></img>
        <h1 className="text-4xl font-bold text-center mb-8 text-green-700">Mofit</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 ">
            <label htmlFor="id" className="block text-gray-700 font-bold mb-2">
              아이디
            </label>
            <input
              type="id"
              id="id"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder=""
              value={id}
              onChange={(event) => setEmail(event.target.value)}
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