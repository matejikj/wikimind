import React, { useEffect } from "react";
import './styles/style.css';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from "./pages/Dashboard";
import Visualisation from "./pages/Visualisation";
import { handleIncomingRedirect } from "@inrupt/solid-client-authn-browser";
import { BrowserRouter } from 'react-router-dom';
import { checkContainer } from "./service/containerService";
import Classes from "./pages/Classes";
import Messages from "./pages/Messages";
import ProfileView from "./pages/ProfileView";
import Class from "./pages/Class";
import { UserSession, defaultSessionValue } from "./models/types/UserSession";
import { SessionContext } from "./sessionContext";
import PrivateChat from "./pages/PrivateChat";
import ExamPage from "./pages/ExamPage";
import HistoryPage from "./pages/HistoryPage";

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
                <Route path="/visualisation" element={<Visualisation />} />
                <Route path="/classes" element={<Classes />} />
                <Route path="/class" element={<Class />} />
                <Route path="/profile" element={<ProfileView />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/chat" element={<PrivateChat />} />
                <Route path="/exam" element={<ExamPage />} />
                <Route path="/history" element={<HistoryPage />} />
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
