import axios from "axios";
import API from "./API";

const checkAdminAuth = async () => {
  try {
    const res = await axios.get(`${API}/admin/is-authenticated`, {
      withCredentials: true
    });
    return res.data.isAuthenticated;
  } catch {
    return false;
  }
};

export default checkAdminAuth;