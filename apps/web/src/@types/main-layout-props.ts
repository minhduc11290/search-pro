import { ReactNode } from "react";

export interface MainLayoutProps {
    children: ReactNode;
    currentLink: string;
    isLoading: boolean;
}