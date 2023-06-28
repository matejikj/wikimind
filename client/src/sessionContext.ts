import { createContext } from "react";
import { UserSession, defaultSessionValue } from "./models/types/UserSession";

interface ContextProps {
  sessionInfo: UserSession;
  setSessionInfo: (userData: UserSession) => void;
}

export const SessionContext = createContext<ContextProps>({
  sessionInfo: defaultSessionValue,
  setSessionInfo: () => null,
});


