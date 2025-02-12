import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import'./css/bootstrap.min.css';
import'./css/icons.css';
import'./css/app.css';
import'./css/pace.min.css';
import Man from './pages/Man';
import ShoppingCart from './pages/ShoppingCart';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './components/CheckoutSuccess';
import ProductDetails from './pages/ProductDetails';
import Woman from './pages/Woman';
import Accesories from './pages/Accesories';
import Others from './pages/Others';

function App() {
  return (
    <Router>
      <div className="wrapper">
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/man" element={<Man />} />
          <Route path="/women" element={<Woman />} />
          <Route path="/accessories" element={<Accesories />} />
          <Route path="/others" element={<Others />} />
          <Route path="/cart" element={<ShoppingCart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout-success" element={<CheckoutSuccess />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
