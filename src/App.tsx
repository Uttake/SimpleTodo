import "./App.css";
import PrivateRoute from "./components/PrivateRoute";
import TodoWrapper from "./components/ui/TodoWrapper";

function App() {
  return (
    <PrivateRoute>
      <TodoWrapper />
    </PrivateRoute>
  );
}

export default App;
