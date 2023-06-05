import { AccessControlPolicy } from "./AccessControlPolicy";

export type UserSession = {
    webId: string;
    podUrl: string;
    isLogged: boolean;
    podAccessControlPolicy: AccessControlPolicy | null
}

export const defaultSessionValue: UserSession = {
    webId: "",
    podUrl: "",
    isLogged: false,
    podAccessControlPolicy: null,
}