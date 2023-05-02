import React, { useEffect, createContext, useState, FC } from "react";

export type UserData = {
  session: any;
  isLogged: boolean;
}
export const defaultSessionValue: UserData = {
    session: undefined,
    isLogged: false
  }
interface ContextProps {
  userData: UserData | null;
  setUserData: (userData: UserData) => void;
}

export const SessionContext = createContext<ContextProps>({
  userData: null,
  setUserData: () => null,
});


