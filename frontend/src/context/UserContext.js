import { createContext } from "react";

import useAuht from "hooks/useAuth";

const Context = createContext();
Context.displayName = "User Context";

const UserProvider = ({ children }) => {
  
  const { register, authenticated, logout, login } = useAuht();

  return (
    <Context.Provider value={{ register, authenticated, logout, login }}>
      { children }
    </Context.Provider>
  );
};

export { Context, UserProvider };
