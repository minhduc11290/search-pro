import { endpoint } from "../constants/api";

export function getLink(fileName: string) {
    //return `http://localhost:6868/files/${fileName}`;
    return `${endpoint}/files/${fileName}`;
}