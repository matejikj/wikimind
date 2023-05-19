import { Session, getDefaultSession } from "@inrupt/solid-client-authn-browser";
import React, { useEffect, createContext, useState, FC } from "react";

export type UserData = {
  webId: string;
  isLogged: boolean;
}
export const defaultSessionValue: UserData = {
  webId: "",
  isLogged: false,
}

interface ContextProps {
  sessionInfo: UserData;
  setSessionInfo: (userData: UserData) => void;
}

export const SessionContext = createContext<ContextProps>({
  sessionInfo: defaultSessionValue,
  setSessionInfo: () => null,
});


