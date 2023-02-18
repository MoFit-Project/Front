import axios from 'axios';

//https://jsonplaceholder.typicode.com/todos/1

const TestButton = () => {
  const handleButtonClick = () => {
    axios.get('https://jsonplaceholder.typicode.com/todos/1')
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