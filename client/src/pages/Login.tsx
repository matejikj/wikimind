import { IonPage, IonList, IonButton, IonSelect, IonSelectOption, IonItem, IonCol, IonGrid, IonRow } from '@ionic/react';
import { LoginButton } from "@inrupt/solid-ui-react";
import './Login.css';
import React, { useEffect, useState } from "react";

const authOptions = {
  clientName: "Learnee",
};

const Login: React.FC = () => {
  const providerOptions = [
    'https://datapod.igrant.io/',
    'https://inrupt.net'
  ];
  const [currentProvider, setCurrentProvider] = useState<string>('');
  return (
    <IonPage>
      <IonGrid>
        <IonRow>
          <IonCol>Prihlaseni</IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonList>
              <IonItem>
                <IonSelect
                  placeholder="Select provider"
                  onIonChange={(e) => {
                    setCurrentProvider(e.detail.value);
                    // console.log(e.detail.value)
                  }}
                >
                  {providerOptions.map((provider) => (
                    <IonSelectOption key={provider} value={provider}>
                      {provider}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </IonList>
          </IonCol>
        </IonRow>
        <IonRow className="message">
          <IonCol>
              <LoginButton
                oidcIssuer={currentProvider}
                redirectUrl="https://main.d28bhutklw4odo.amplifyapp.com/"
                authOptions={authOptions}
              >
                <IonButton>Download</IonButton>
              </LoginButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonPage>
  );
};

export default Login;
