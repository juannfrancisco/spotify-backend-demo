import { UserData } from "./user-data-response.model";

export interface LoginDataResponse {
    code:number;
    csrfToken:string;
    data: UserData;
    message:string;
    token:string;
}