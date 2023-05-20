import { AccessRequest } from "@inrupt/solid-client-access-grants"

export type ClassRequest = {
    accessRequest: AccessRequest;
    className: string;
    requestFile: string;
}