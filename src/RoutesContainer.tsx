import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import Authorization from "./components/ui/Authorization/Authorization";

const RoutesContainer = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Authorization />} />
        <Route path="/todo" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesContainer;
