
if (process.env.NODE_ENV !="production"){
    require("dotenv").config();
}

const express =require("express");
const app = express();
const mongoose =require("mongoose");
const path = require("path");
const mehtodOverride = require("method-override");
const ejsMate =require("ejs-mate"); //Helps to creae tempaltes
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport =require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter =require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter =require("./routes/user.js")


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(mehtodOverride("_method"));
app.use(express.static(path.join(__dirname,"./public")));
app.engine("ejs",ejsMate); //way of using it
app.use(express.json());//Extra add from the chatGPT
//Creating the server as wanderlust


const dbUrl = process.env.ATLASDB_URL;


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24 *3600,
});

store.on("error",()=>{
    console.log("Error in the mongo session store ",err);
});

const sessionOptions = {
    store,
    secret:process.env.SECRET,
     resave:false ,
     saveUninitialized: true,
     cookie:{
        express : Date.now() + 7*24*60*60*1000,
        maxAge:  7*24*60*60*1000,
        httpOnly: true,
     },
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// Serialize and deserialize user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();

});

app.get("/demouser",async(req,res)=>{
    
    let fakeUser = new User({
        email:"vk367@gmail.com",
        username:"vysakh",
    });
    let registeredUser =await User.register(fakeUser,"helloworld");
    res.send(registeredUser);
    
});




// Try to connect to DB  
async function main(){
    await mongoose.connect(dbUrl);
}
//Show connection states 
main().then(()=>{
    console.log("connected to DB");  
})
.catch((err)=>{
    console.log(err);
});



app.use("/listings",listingRouter)


// Post Review route
app.use("/listings/:id/reviews", reviewsRouter);

app.use("/",userRouter)

//Error Handling
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode = 500 ,message ="Something went wrong! "} = err;
    res.status(statusCode).render("./error.ejs",{message}); 
    
}); 

app.listen("8080",()=>{
    console.log("Server is listening to port 8080");
});

