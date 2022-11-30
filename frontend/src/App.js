import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* flash messages */
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

/* components */
import NavBar from "components/layout/NavBar";
import Footer from "components/layout/Footer";
import Container from "components/layout/Container";

/* pages */
import Login from "pages/auth/Login";
import Register from "pages/auth/Register";
import Home from "pages/Home";
import Profile from "pages/user/Profile";

/* context */
import { UserProvider } from "context/UserContext";

function App() {
  return (
    <Router>
      <ToastContainer autoClose={3000} />
      <UserProvider>
        <NavBar />
        <Container>
          <Routes>
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />}/>
            <Route path="/user/profile" element={<Profile />}/>
            <Route path="/" element={<Home />}/>
          </Routes>
        </Container>
        <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;
