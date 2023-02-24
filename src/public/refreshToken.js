import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export function refreshToken() {
  const refreshToken = Cookies.get("refresh");
  if (!refreshToken) {
    // 로그인 페이지로 리다이렉트
    window.location.href = "/login";
    return;
  }
  fetchAccessToken();
}

const fetchAccessToken = async () => {
  try {
    const response = await axios.post("/mofit/refresh", {
      refresh_token: refreshToken,
    });

    const accessToken = response.data.access_token;
    Cookies.set("token", accessToken);
    console.log("Access Token is Refreshed");

    // 토큰이 갱신되면 페이지를 새로고침하여 새로운 토큰으로 데이터를 가져옵니다.
    router.reload();
  } catch (error) {
    console.error(error);

    const { response } = error;

    if (response) {
      switch (response.status) {
        case 401:
          // refresh 토큰이 만료되었을 때 로그인 페이지로 리다이렉트
          Cookies.remove("token");
          Cookies.remove("refresh");
          router.push("/login");
          break;
        default:
          console.log("Unexpected Error");
      }
    } else {
      console.log("Network Error");
    }
  }
};

