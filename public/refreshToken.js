import Cookies from "js-cookie";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const refreshToken = async () => {

  try {
    const refreshToken = Cookies.get("refresh");
    const accessToken = Cookies.get("token");
    if (!refreshToken) window.location.href = "/login";

    const response = await axios.post(API_URL + "/refresh", {
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    
    const newAccessToken = response.data.access_token;
    Cookies.set("token", newAccessToken);
    console.log("Token is refreshed!");
    window.location.reload();

  } catch (error) {
    console.error(error);
    Cookies.remove("token");
    Cookies.remove("refresh");
    console.log("Token is removed!");
    window.location.href = "/login";
  }
};