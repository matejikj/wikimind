import {
  handleIncomingRedirect,
  logout,
  onSessionRestore
} from "@inrupt/solid-client-authn-browser";
import React, { useEffect } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LanguageLocalization, UserSession, defaultSessionValue } from "./models/UserSession";
import { AccessControlPolicy } from "./models/enums/AccessControlPolicy";
import BrowserPage from "./pages/BrowserPage";
import ChatListPage from "./pages/ChatListPage";
import ChatPage from "./pages/ChatPage";
import ClassListPage from "./pages/ClassListPage";
import ClassPage from "./pages/ClassPage";
import EditorPage from "./pages/EditorPage";
import ExamPage from "./pages/ExamPage";
import LoginPage from './pages/LoginPage';
import MinaMapListPage from "./pages/MindMapListPage";
import ProfilePage from "./pages/ProfilePage";
import { getPodUrl, isWacOrAcp } from "./service/accessService";
import { checkContainer } from "./service/containerService";
import { SessionContext } from "./sessionContext";
import './styles/style.css';
import Cookies from 'js-cookie';

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
      localStorage.clear()
      if (info && info.webId) {
        const podUrl = await getPodUrl(info.webId)
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
      setWaiting(false)
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
                <Route path="/" element={<MinaMapListPage />} />
                <Route path="/editor" element={<EditorPage />} />
                <Route path="/classes" element={<ClassListPage />} />
                <Route path="/class" element={<ClassPage />} />
                <Route path="/browser" element={<BrowserPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/chats" element={<ChatListPage />} />
                <Route path="/chat" element={<ChatPage />} />
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
                <LoginPage></LoginPage>
              </div>
            )
          }
        })()}
      </BrowserRouter>
    </SessionContext.Provider>

  );
};

export default App;
