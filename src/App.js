import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LoginPage from "./pages/LoginPage";
import Canvas from "./pages/Canvas";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import BoardProvider from "./store/BoardProvider";
import ToolboxProvider from "./store/ToolboxProvider";
import SocketProvider from "./store/SocketProvider";

function App() {
  return (
    <SocketProvider>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route
            path="/canvas/:id"
            element={
              <BoardProvider>
                <ToolboxProvider>
                  <Canvas />
                </ToolboxProvider>
              </BoardProvider>
            }
          />
        </Routes>
      </Router>
    </SocketProvider>
  );
}

export default App;
