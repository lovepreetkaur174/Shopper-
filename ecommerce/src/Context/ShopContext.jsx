import React, { createContext, useEffect, useState } from "react";
//remove this all product data after the database connection



export const ShopContext= createContext(null);


// cart item repersent a key value pair where key is product id and value is the quantity of that product.
const getDefaultCart=()=>{
    let cart={};
    for(let index=0;index< 300;index++)
    {
        cart[index]=0;
    }
    return cart;
}

const ShopContextProvider=(props)=>{
   
    const [all_product,setAll_Product]= useState([]);
    const [cartItem,setCartItem]=useState(getDefaultCart());
    
    useEffect(()=>{
        fetch('http://localhost:4000/allproducts')
        .then((respone)=>respone.json())
        .then((data)=>setAll_Product(data))

        if(localStorage.getItem('auth-token'))
        {
            fetch('http://localhost:4000/getcart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:"",
            }).then((respone)=>respone.json())
            .then((data)=>setCartItem(data));
        }

    },[])
    const addToCart=(itemId)=>{
        setCartItem((prev)=>({...prev,[itemId]:prev[itemId]+1}));
        if(localStorage.getItem('auth-token'))
        {
            fetch('http://localhost:4000/addtocart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId}),
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
        }
    }
    
    const removeFromCart=(itemId)=>{
        console.log(itemId,"itemid");
        setCartItem((prev)=>({...prev,[itemId]:prev[itemId]-1}))
        if(localStorage.getItem('auth-token'))
        {
            fetch('http://localhost:4000/removefromcart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itenId":itemId}),
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
        }
    }

    const getTotalCartAmount=()=>{

        let totalAmount=0;
        for(const item in cartItem)
        {
           if(cartItem[item]>0)
           {
              let itemInfo=all_product.find((product)=>product.id===Number(item))
              totalAmount+=itemInfo.new_price * cartItem[item];
           } 
        }
        return totalAmount;
    }
    const getTotalCartItems=()=>{
        let totalItem=0;
        for(const item in cartItem)
        {
            if(cartItem[item]>0)
            {
                totalItem+=cartItem[item];
            }
        }

        return totalItem;
    }
   
    const contextValue = {all_product,cartItem,addToCart,removeFromCart,getTotalCartAmount,getTotalCartItems};
   return (
    <ShopContext.Provider value={contextValue}>
        {props.children}
    </ShopContext.Provider>
   )
   
}
export default ShopContextProvider;