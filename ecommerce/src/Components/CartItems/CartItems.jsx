import React, { useContext  } from 'react'
import { useNavigate } from 'react-router-dom';
import './CartItems.css'
import { ShopContext } from '../../Context/ShopContext'
import remove_icon from '../Assets/cart_cross_icon.png'
const CartItems = () => {
    const {all_product , cartItem ,removeFromCart,getTotalCartAmount}=useContext(ShopContext);
    
    const navigate =useNavigate();
  return (
    <div className='cartitems'>
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr/>
      {all_product.map((e)=>{
        console.log(cartItem);
          if(cartItem[e.id]>0)
          {
             return <div>
             <div className="cartitems-format cartitems-format-main">
               <img src={e.image} className="carticon-product-icon"/>
               <p>{e.name}</p>
               <p>${e.new_price}</p>
               <button className='cartitems-quantity'>{cartItem[e.id]}</button>
               <p>$ {e.new_price*cartItem[e.id]}</p>
               <img src={remove_icon} onClick={()=>{
                console.log(e.id);
                removeFromCart(e.id)}}/>
             </div>
             <hr/>
           </div>
            
          }
      })}
     
      <div className="cartitems-down">
        <div className="cartitems-total">
            <h1>Cart Totals</h1>
            <div>
                <div className="cartitems-total-item">
                    <p>Subtotal</p>
                    <p>${getTotalCartAmount()}</p>
                </div>
                <hr/>
                <div className="cartitems-total-item">
                    <p>Shipping Fee</p>
                    <p>Free</p>
                </div>
                <hr/>
                <div className="cartitems-total-item">
                    <h3>Total</h3>
                    <h3>${getTotalCartAmount()}</h3>
                </div>
            </div>
            <button onClick={()=>navigate('/order')}>Proceed to checkout</button>
        </div>
        <div className="cartitems-promocode">
            <p>If you have a promo code ,Enter it here </p>
              <div className="cartitems-promobox">
                <input type='text' placeholder='promo code'/>
                <button>Submit</button>
              </div>
        </div>
      </div>
    </div>
  )
}

export default CartItems
