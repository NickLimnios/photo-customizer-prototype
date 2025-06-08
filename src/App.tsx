import Header from "./Layout/Header";
import Footer from "./Layout/Footer";
import Home from "./pages/Home";
//import EditorPage from "./pages/EditorPage";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { PhotobookEditorMock } from "./components/PhotobookEditorMock";
import { CartProvider } from "./Cart/CartProvider";
import { AuthProvider } from "./Auth/AuthContext";
import CartPage from "./pages/CartPage";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      <AuthProvider>
        <CartProvider>
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/editor" element={<PhotobookEditorMock />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </main>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
