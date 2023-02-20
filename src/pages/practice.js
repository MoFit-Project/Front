import axios from 'axios';

//https://jsonplaceholder.typicode.com/todos/1

const TestButton = () => {
  const handleButtonClick = () => {
    axios.get('http://175.126.107.18:8080/naver')
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <button className="bg-green-500" onClick={handleButtonClick}>테스트</button>
  );
};

export default TestButton;