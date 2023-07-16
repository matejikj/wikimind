import { handleIncomingRedirect } from "@inrupt/solid-client-authn-browser";
import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LanguageLocalization, UserSession, defaultSessionValue } from "./models/types/UserSession";
import Browser from "./pages/Browser";
import Chat from "./pages/Chat";
import Chats from "./pages/Chats";
import Class from "./pages/Class";
import Classes from "./pages/Classes";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import ExamPage from "./pages/ExamPage";
import Login from './pages/Login';
import ProfileView from "./pages/ProfileView";
import { checkContainer } from "./service/containerService";
import { SessionContext } from "./sessionContext";
import './styles/style.css';

const App: React.FC = () => {

  const [sessionInfo, setSessionInfo]
    = React.useState<UserSession>(defaultSessionValue);
  const [waiting, setWaiting] = React.useState(false);

  useEffect(() => {
    handleIncomingRedirect({
      restorePreviousSession: true
    }).then((info) => {
      if (info?.isLoggedIn && info?.webId !== undefined) {
        try {
          setWaiting(true)
          checkContainer(info?.webId).then((value) => {
            setSessionInfo({
              isLogged: true,
              webId: info?.webId!,
              podUrl: value.podUrl,
              localization: LanguageLocalization.CS,
              podAccessControlPolicy: value.accessControlPolicy
            })
            setWaiting(false)
          })
        } catch (error) {
          console.log("There is problem when logging: ", error)
        }
      }
    })
  }, []);

  return (
    <SessionContext.Provider value={{
      sessionInfo,
      setSessionInfo
    }}>
      <BrowserRouter>
        {(() => {
          if (sessionInfo.isLogged) {
            return (
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/classes" element={<Classes />} />
                <Route path="/class" element={<Class />} />
                <Route path="/browser" element={<Browser />} />
                <Route path="/profile" element={<ProfileView />} />
                <Route path="/chats" element={<Chats />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/exam" element={<ExamPage />} />
              </Routes>
            )
          } else if (!sessionInfo.isLogged && waiting) {
            return (
              <div className="loader-wrapper">
                <div className="loader">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )
          } else if (window.location.href.includes('/browser')) {
            return (
              <Browser></Browser>
            )
          } else {
            return (
              <Login></Login>
            )
          }
        })()}
      </BrowserRouter>
    </SessionContext.Provider>

  );
};

export default App;
