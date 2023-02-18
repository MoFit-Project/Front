import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

function LoginForm() {
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://ena.jegal.shop:8080/register', { "username":username, "password":password });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const router = useRouter();

  const handleRegisterClick = () => {
  router.push('/signup');
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <img class="mx-auto h-12 w-auto" src="https://cdn-icons-png.flaticon.com/512/7420/7420915.png" alt="Your Company"></img>
      <h1 className="text-4xl font-bold text-center text-green-800">Mofit</h1>
      <form className="bg-white rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            아이디
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            username="username"
            type="text"
            value={username}
            onChange={(event) => setEmail(event.target.value)}
            placeholder=""
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            비밀번호
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            username="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder=""
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            로그인
          </button>
        </div>
        
        <div className="flex justify-end mt-4">
        <a
            className="inline-block align-baseline font-bold text-sm text-green-500 hover:text-green-800"
            href="#" onClick={handleRegisterClick}
            
          >
            회원가입
          </a>
        </div>
        
      </form>
    </div>
  );
}

export default LoginForm;