export type UserSession = {
    webId: string;
    podUrl: string;
    isLogged: boolean;
}

export const defaultSessionValue: UserSession = {
    webId: "",
    podUrl: "",
    isLogged: false,
}