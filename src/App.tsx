import { Route, Routes } from "react-router-dom";

import Header from "./Layout/Header";
import Footer from "./Layout/Footer";
import MainContent from "./Layout/MainContent";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import EditorPage from "./pages/EditorPage";
import TemplatesPage from "./pages/TemplatesPage";
import OrdersPage from "./pages/OrdersPage";
import NotFoundPage from "./pages/NotFoundPage";
import { AboutPage, SupportPage, PrivacyPage } from "./pages/InfoPages";
import { CartProvider } from "./Cart/CartProvider";
import { AuthProvider } from "./Auth/AuthContext";

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AuthProvider>
        <CartProvider>
          <Header />
          <MainContent>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/editor" element={<EditorPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </MainContent>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
