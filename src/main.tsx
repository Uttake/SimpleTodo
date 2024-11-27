import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/index.ts";
import { ThemeProvider } from "./Context/ContextTheme.tsx";
import RoutesContainer from "./RoutesContainer.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <RoutesContainer />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
