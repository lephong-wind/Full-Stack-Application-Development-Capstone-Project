import LoginPanel from "./components/Login/Login"
import Register from "./components/Register/Register"
import { Link, Navigate, Routes, Route } from "react-router-dom";
import Dealers from './components/Dealers/Dealers';
import Dealer from "./components/Dealers/Dealer"
import PostReview from "./components/Dealers/PostReview"
import Header from "./components/Header/Header"



function Home() {
  return (
    <>
      <Header />
      <main className="container" style={{ padding: "3rem 1rem" }}>
        <h1>Welcome to our Dealerships!</h1>
        <p>Find a dealership and read customer reviews.</p>
        <Link className="btn btn-info" to="/dealers">View Dealerships</Link>
      </main>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPanel />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dealers" element={<Dealers/>} />
      <Route path="/dealer/:id" element={<Dealer/>} />
      <Route path="/postreview/:id" element={<PostReview/>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
export default App;
