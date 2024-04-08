import React, { useContext } from 'react'
import './CSS/PlaceOrder.css'
import { ShopContext } from '../Context/ShopContext'
import {loadStripe} from '@stripe/stripe-js';
const PlaceOrder = () => {
    const {getTotalCartAmount,cartItem}=useContext(ShopContext);
    const makePayment= async ()=>{
        const stripe=await loadStripe("pk_test_51P2S7iSEPHE0F36KRxajaAdxH03EUigQ6bGZ2B6KpmvEHfGDfCipR3pXzg738w5PZfVpGuGK8eomtckkZQQwQHke00XYJlpVhs");
        

    }
  return (
    <form className='place-order'>
        <div className="place-order-left">
            <p className='title'>Delivery Information</p>
            <div className="multi-fields">
                <input type='text' placeholder='First Name'/>
                <input type='text' placeholder='Last Name'/>
            </div>
           <input type="email"  placeholder='Email address'/>
           <input type="text"  placeholder='Street' />  
           <div className="multi-fields">
                <input type='text' placeholder='City'/>
                <input type='text' placeholder='State'/>
            </div>
            <div className="multi-fields">
                <input type='text' placeholder='Zip Code'/>
                <input type='text' placeholder='Country'/>
            </div>
            <input type="text"  placeholder='Phone Number'/>
        </div>
        <div className="place-order-right">
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
            <button onClick={makePayment}>Proceed to Payment</button>
        </div>

        </div>
         
    </form>
  )
}

export default PlaceOrder
