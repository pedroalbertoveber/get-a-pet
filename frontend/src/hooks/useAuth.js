/* api */
import api from "utils/api";

/* hooks */
import { useState, useEffect } from "react";

/* external modules */
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const useAuht = () => {
  const navigate = useNavigate();
  const [ authenticated, setAuthenticated ] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if(token) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      setAuthenticated(true);
    }
  }, []);

  const authUser = async (data) => {
    setAuthenticated(true);
    localStorage.setItem("token", JSON.stringify(data.token));
    navigate("/");
  };

  const logout = () => {
    toast.success("Deslogado com sucesso!");

    setAuthenticated(false);
    localStorage.removeItem("token");
    api.defaults.headers.Authorization = undefined;
    navigate("/");
  };

  const register = async (user) => {
    try {
      const data = await api.post("/users/register", user)
      .then((response) => {
        toast.success(response.data.message);
        return response.data; 
      });

      await authUser(data);

    } catch(err) {
      toast.error(err.response.data.message);
    }
  };

  const login = async (user) => {
    try {
      const data = await api.post("/users/login", user)
      .then((response) => {
        toast.success(response.data.message);
        return response.data;
      });

      await authUser(data);

    } catch(err) {
      toast.error(err.response.data.message);
    }
  }

  return { register, authenticated, logout, login };
};

export default useAuht;