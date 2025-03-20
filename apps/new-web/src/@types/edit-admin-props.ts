import { UserInfo } from "./user-props";

export interface EditAdminProps {
    opened: boolean;
    userInfo: UserInfo;
    close: (reload: boolean) => void;
}