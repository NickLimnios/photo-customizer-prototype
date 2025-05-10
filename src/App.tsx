import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import EditorPage from "./pages/EditorPage";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
