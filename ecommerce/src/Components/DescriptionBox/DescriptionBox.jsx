import React from 'react'
import './DescriptionBox.css'
const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
       <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">
            Description
        </div>
        <div className="descriptionbox-nav-box fade">
            Review (122)
        </div>
       </div>
       <div className="descriptionbox-description">
        <p>E-commerce, short for electronic commerce, has revolutionized the way businesses operate and 
            consumers shop. It refers to the buying and selling of goods and services over the internet,
            facilitated through websites and online platforms. Since its inception, e-commerce has witnessed
            exponential growth, reshaping traditional retail landscapes and empowering businesses of all sizes
            to reach global markets with ease.</p>
            <p>
            One of the primary advantages of e-commerce is its convenience. Consumers can browse through a vast
            array of products and services from the comfort of their homes or on the go, eliminating the need 
            for physical travel to brick-and-mortar stores. With just a few clicks or taps, purchases can be made,
            making the shopping experience seamless and efficient.
            </p>
       </div>
    </div>
  )
}

export default DescriptionBox
