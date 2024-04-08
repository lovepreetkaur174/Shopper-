const port=4000;
//import dependencies
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const multer=require("multer");
const path=require("path");
const cors=require("cors");
const { type } = require("os");
mongoose.connect("mongodb+srv://lovepreetkaur:9877348749@cluster0.vhcpjpr.mongodb.net/e-commerce");

app.use(express.json()); // every request will parse through json
app.use(cors()); // helps to connect to express through 4000 port(frontend to backend connection)

// database connection with mongodb

const connection = mongoose.connection;
connection.on('connected'  , ()=>{
    console.log('Mongo DB Connection Successful');
})

connection.on('error'  , (err)=>{
    console.log('Mongo DB Connection Failed');
})
// API creation
app.get("/",(req,res)=>{
    res.send("Express app is running")
})  

// Image storage engine

const storage = multer.diskStorage({
    destination: './upload/images', //path of the folder to store images
    filename : (req,file,cb)=>{ // arrow function to generate the file name
         return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload=multer({storage:storage})
// Creating upload endpoint for images
app.use('/images',express.static('upload/images'))
// product is the fieldname 
app.post("/upload",upload.single('product'),(req,res)=>{

    res.json({
        success :1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`,
    })
})
// schema for creating products

const Product=mongoose.model("Product",{
    id:{
        type: Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,

    },
    available:{
        type:Boolean,
        default:true,
    },
})


app.post('/addproduct',async (req,res)=>{
    // logic to automaically generate the id 
    // we will find all the products first 
    //products is the array in which all the products that are in database is present 
    let products=await Product.find({}); 
    let id;
    if(products.length>0)
    { // incermenting the id by one from last product...
        let last_product_array=products.slice(-1);
        let last_product=last_product_array[0];
        id=last_product.id+1;
    }
    else{
        // if first product is added into database let its id=1
        id=1;
    }
    //creating a product to be uploaded in the database... using schema we created
    const product=new Product({
        id: id,        // (req.body.id) no need to take id through req
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,

    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})
// creating api for deleting product
app.post('/removeproduct',async (req,res)=>{
   
    // remove 
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success: true,
        name:req.body.name, 
    })
})

// creating api for getting all product that has been added into database
app.get('/allproducts', async (req,res)=>{
  let products= await Product.find({});
  console.log("All product fetched");
  res.send(products);
})

//  Schema creating for user model

const Users= mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    },
})
// creating EndPoint for registering the user
app.post('/signup', async (req,res)=>{
 
    // checking if user is already signed up in database
      let check=await Users.findOne({email:req.body.email});
      if(check)
      {
        // if yes then sending an error
        return res.status(400).json({success:false,errors:"existing user found with same email address"});
      }
      // creating user and itializing its cart as empty
      let cart={};
      for(let i=0;i<300;i++)
      {
        cart[i]=0;
      }
      const user =new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
      })
      // saving the user in database...
      await user.save();
      // granting permission to user using jwt authentication..
      const data={
        user:{
            id:user.id
        }
      }
      const token=jwt.sign(data,'secret_ecom');
      // sendong the response 
      res.json({success:true,token})
})

// creating endpoint for user login
app.post('/login',async  (req,res)=>{
   let user =await Users.findOne({email:req.body.email});
   if(user){
    const passCompare=req.body.password === user.password;
    if(passCompare)
    {
        const data={
            user:{
                id:user.id
            }
        }
        const token=jwt.sign(data,'secret_ecom');
        res.json({success:true,token});
    }
    else{
        res.json({success:false,errors:"Wrong Password"});
    }
   }else{
    res.json({success:false,errors:"User Not Found"});
   }
})
// creating endpoint for new collection
app.get('./newcollections',async (req,res)=>{
    let products =await Product.find({});
    let  newcollection =products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollection);

})
//  Creating endpoint in popular in women
app.get('/popularinwomen',async (req,res)=>{
    let products =await Product.find({category: "women"});
    let popular_in_women=products.slice(0,4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);
})

// creating a middleware to fetch user
const fetchUser=async (req,res,next)=>{
    
    const token = req.header('auth-token');
    if(!token)
    {
        res.status(401).send({errors:"Please authenticate using valid token"});
    }
    else{
        try{
            const data=jwt.verify(token,'secret_ecom');
            req.user=data.user;
            next();
        }catch (error)
        {
            res.status(401).send({errors:"Please authethicate using avalid token"});   
        }
    }

}
// creating endpoint for adding products in cartdata
app.post('/addtocart',fetchUser ,async (req,res)=>{
   // console.log(req.body,req.user);
    console.log("added",req.body.itemId);
    let userData=await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId]+=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added")
})

// Creating endpoint to remove product from cartdata
app.post('/removefromcart',fetchUser, async (req,res)=>{

    console.log("removed",req.body.itemId);
    let userData=await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId]-=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("Removed")
})

//creating endpoint for geting cartdata
app.post('/getcart',fetchUser, async (req,res)=>{
    console.log("GetCart");
    let userData=await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})
// const Orders= mongoose.model('Orders',{
//     user:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"Users",
//         required:true
//     },
//     shippingInfo:{
//         firstname:{
//             type:String,
//             required:true,
//         },
//         lastName :{
//             type:String,
//             required:true,
//         },
//         address:{
//             type:String,
//             required:true,
//         },
//         city:{
//             type:String,
//             required:true,
//         },
//         state:{
//             type:String,
//             required:true,
//         },
//         pincode:{
//             type:Number,
//             required:true,
//         },  
//     },
//     paymentInfo :{
//         razorpayOrderId:{
//             type:String,
//             required:true,
//         },
//         razorpayPaymentId:{
//             type:String,
//             required:true,
//         }
//     }
// })


app.listen(port,(err)=>{
    if(!err)
    {
        console.log("server running on port "+port)
    }
    else{
        console.log("error"+err);
    }
})