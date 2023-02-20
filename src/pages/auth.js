import Cookies from 'js-cookie';

// 로그인 후 서버에서 받은 토큰을 쿠키에 저장하는 함수
const setAuthToken = (token) => {
  Cookies.set('token', token);
};

// 쿠키에서 토큰을 제거하는 함수
const removeAuthToken = () => {
  Cookies.remove('token');
};

// 쿠키에서 토큰을 가져오는 함수
const getAuthToken = () => {
  return Cookies.get('token');
};

export { setAuthToken, removeAuthToken, getAuthToken };