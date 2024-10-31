import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider, Notification } from "@mantine/core";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider withGlobalClasses withCssVariables>
      <Notification>
        <App />
      </Notification>
    </MantineProvider>
  </React.StrictMode>
);
