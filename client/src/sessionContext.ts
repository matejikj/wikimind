import { Session, getDefaultSession } from "@inrupt/solid-client-authn-browser";
import React, { useEffect, createContext, useState, FC } from "react";
import { UserSession, defaultSessionValue } from "./models/types/UserSession";

interface ContextProps {
  sessionInfo: UserSession;
  setSessionInfo: (userData: UserSession) => void;
}

export const SessionContext = createContext<ContextProps>({
  sessionInfo: defaultSessionValue,
  setSessionInfo: () => null,
});


