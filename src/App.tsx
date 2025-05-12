import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
//import EditorPage from "./pages/EditorPage";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { PhotobookEditorMock } from "./components/PhotobookEditor/PhotobookEditorMock";
import { Cart } from "./components/Cart/Cart";
import { CartProvider } from "./context/CartProvider";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      <CartProvider>
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/editor" element={<PhotobookEditorMock />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
        <Footer />
      </CartProvider>
    </div>
  );
}

export default App;
