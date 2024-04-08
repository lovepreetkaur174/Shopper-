import './App.css';
import Navbar from './Components/Navbar/Navbar';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import ShopCategory from './Pages/ShopCategory';
import Shop from './Pages/Shop';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Footer from './Components/Footer/Footer';
import men_banner from './Components/Assets/banner_mens.png'
import women_banner from './Components/Assets/banner_women.png'
import kid_banner from './Components/Assets/banner_kids.png'
import PlaceOrder from './Pages/PlaceOrder';

function App() {
  return (
    <div >
      <BrowserRouter>
         <Navbar/>
         <Routes>
          <Route path='/' element={<Shop/>}/>
          <Route path='/Men' element={<ShopCategory banner={men_banner}  category="men"/>}/>
          <Route path='/Women' element={<ShopCategory banner={women_banner} category="women"/>}/>
          <Route path='/Kids' element={<ShopCategory banner={kid_banner} category="kid"/>}/>
          <Route path='/product' element={<Product/>}/>
          <Route path='/product/:productId' element={<Product/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/login' element={<LoginSignup/>}/>
          <Route path='/order' element={<PlaceOrder/>}/>
         </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
