import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Crypto from "./pages/Crypto/Crypto";
import SubmitBlog from "./pages/SubmitBlog/SubmitBlog";
import Error from "./pages/Error/Error"; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import styles from "./App.module.css";
import Protected from "./components/Protected/Protected";
import { useSelector } from "react-redux";
import Blog from "./pages/Blog/Blog";
import BlogDetails from "./pages/BlogDetails/BlogDetails";
import BlogUpdate from "./pages/BlogUpdate/BlogUpdate";

function App() {
  const isAuth = useSelector((state) => state.user.auth);
  return (
    <div className={styles.container}>
      <BrowserRouter>
        <div className={styles.layout}>
          <Navbar />
          <Routes>
            <Route
              path="/"
              exact
              element={
                <div className={styles.main}>
                  <Home />
                </div>
              }
            />

            <Route
              path="crypto"
              exact
              element={<div className={styles.main}><Crypto /></div>}
            />
            <Route
              path="blogs"
              exact
              element={
                <Protected isAuth={isAuth}>
              <div className={styles.main}><Blog /></div>
                </Protected>
            }
            />
            <Route
              path="blog/:id"
              exact
              element={
                <Protected isAuth={isAuth}>
              <div className={styles.main}><BlogDetails /></div>
                </Protected>
            }
            />
            <Route
              path="blog-update/:id"
              exact
              element={
                <Protected isAuth={isAuth}>
              <div className={styles.main}><BlogUpdate /></div>
                </Protected>
            }
            />
            <Route
              path="submit"
              exact
              element={
              <Protected isAuth={isAuth}>
              <div className={styles.main}><SubmitBlog /></div>
              </Protected>
              }
            />
            <Route
              path="login"
              exact
              element={<div className={styles.main}><Login /></div>}
            />
            <Route
              path="signup"
              exact
              element={<div className={styles.main}><Signup /></div>}
            />
            <Route path="*" exact element={<div className={styles.main}><Error /></div>} />
          </Routes>

          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
