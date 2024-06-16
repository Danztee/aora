import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getCurrentUser } from "@/lib/appwrite";

// Define the types for your context state
interface GlobalContextState {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: any | null;
  setUser: React.Dispatch<React.SetStateAction<any | null>>;
  isLoading: boolean;
}

// Define the initial state for your context
const initialState: GlobalContextState = {
  isLoggedIn: false,
  user: null,
  isLoading: false,
  setIsLoggedIn: () => {},
  setUser: () => {},
};

// Create the context with the initial state
const GlobalContext = createContext<GlobalContextState>(initialState);

// Custom hook to use the GlobalContext
export const useGlobalContext = () => useContext(GlobalContext);

// Define the props for your provider component
interface GlobalProviderProps {
  children: ReactNode;
}

const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    initialState.isLoggedIn
  );
  const [user, setUser] = useState<any | null>(initialState.user);
  const [isLoading, setIsLoading] = useState<boolean>(initialState.isLoading);

  useEffect(() => {
    setIsLoading(true);
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setUser(res);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, user, setUser, isLoading }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
