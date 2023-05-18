import { Session, getDefaultSession } from "@inrupt/solid-client-authn-browser";
import React, { useEffect, createContext, useState, FC } from "react";

export type UserData = {
  session: any;
  isLogged: boolean;
  sess: Session;
}
export const defaultSessionValue: UserData = {
    session: undefined,
    isLogged: false,
    sess: getDefaultSession()
  }
interface ContextProps {
  userData: UserData | null;
  setUserData: (userData: UserData) => void;
}

export const SessionContext = createContext<ContextProps>({
  userData: null,
  setUserData: () => null,
});


