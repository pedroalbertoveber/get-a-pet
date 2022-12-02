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
import MyPets from "pages/pets/MyPets";
import AddPet from "pages/pets/AddPet/index";
import EditPet from "pages/pets/EditPet";
import PetDetails from "pages/pets/PetDetails";
import MyAdoptions from "pages/pets/MyAdoptions";

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
            <Route path="/pet/mypets" element={<MyPets />}/>
            <Route path="/pet/add" element={<AddPet />}/>
            <Route path="/pet/myadoptions" element={<MyAdoptions />}/>
            <Route path="/pet/:id" element={<PetDetails />}/>
            <Route path="/pet/edit/:id" element={<EditPet />}/>
            <Route path="/" element={<Home />}/>
          </Routes>
        </Container>
        <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;
