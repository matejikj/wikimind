import {
  getPodUrlAll,
  getResourceInfo
} from "@inrupt/solid-client";
import { handleIncomingRedirect } from "@inrupt/solid-client-authn-browser";
import React, { useEffect } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LanguageLocalization, UserSession, defaultSessionValue } from "./models/UserSession";
import { AccessControlPolicy } from "./models/enums/AccessControlPolicy";
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
import { isWacOrAcp } from "./service/accessService";
import { checkContainer } from "./service/containerService";
import { SessionContext } from "./sessionContext";
import './styles/style.css';

const STORAGE_DESCRIPTION = "http://www.w3.org/ns/solid/terms#storageDescription"
const WELL_KNOWN = ".well-known"
const App: React.FC = () => {

  const [sessionInfo, setSessionInfo]
    = React.useState<UserSession>(defaultSessionValue);
  const [waiting, setWaiting] = React.useState(false);
  const [toastVisible, setToastVisible] = React.useState(false);

  async function handleLogin(): Promise<void> {
    try {
      const info = await handleIncomingRedirect({
        restorePreviousSession: true
      })
      if (info && info.webId) {
        let podUrl
        const podUrls = (await getPodUrlAll(info.webId))
        if (podUrls && podUrls.length > 0) {
          podUrl = podUrls[0];
        } else {
          const resInfo = await getResourceInfo(info.webId)
          podUrl = resInfo.internal_resourceInfo.linkedResources[STORAGE_DESCRIPTION][0].split(WELL_KNOWN)[0]
        }
        if (podUrl) {
          setWaiting(true)
          const accessControlPolicy: AccessControlPolicy = await isWacOrAcp(podUrl);
          const sessionInfo = {
            isLogged: true,
            webId: info.webId,
            podUrl: podUrl,
            localization: LanguageLocalization.CS,
            podAccessControlPolicy: accessControlPolicy
          }
          await checkContainer(sessionInfo)
          setWaiting(false)
          setSessionInfo(sessionInfo)
        } else {
          setToastVisible(true)
        }
      }
    } catch (error) {
      setToastVisible(true)
    }
  }

  useEffect(() => {
    handleLogin()
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
          } else {
            return (
              <div>
                <ToastContainer
                  className="p-3"
                  position={'top-center'}
                  style={{ zIndex: 1 }}>
                  <Toast
                    show={toastVisible}
                    onClose={() => setToastVisible(false)}
                    bg='danger'
                  >
                    <Toast.Header>
                      <img
                        src="holder.js/20x20?text=%20"
                        className="rounded me-2"
                        alt=""
                      />
                      <strong className="me-auto">WikiMind</strong>
                      <small>Now</small>
                    </Toast.Header>
                    <Toast.Body>Your Solid provider is not comaptible, because of getting pod url</Toast.Body>
                  </Toast>

                </ToastContainer>
                <Login></Login>
              </div>
            )
          }
        })()}
      </BrowserRouter>
    </SessionContext.Provider>

  );
};

export default App;
