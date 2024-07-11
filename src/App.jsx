import { Route, Routes } from "react-router-dom";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Home from "./pages/Home";
import AuthMiddleware from "./middlewares/AuthMiddleware";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthMiddleware />}>
        <Route index element={<Home />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
