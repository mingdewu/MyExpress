const expressEdge = require('express-edge');
const express = require('express');
const edge= require("edge.js");
const mongoose = require('mongoose');
const bodyParse = require('body-parser');
const fileUpload = require("express-fileupload");
const expressSession = require('express-session');
const connectMongo = require('connect-mongo');
const storePost = require('./middleware/storePost')
const auth = require("./middleware/auth");
const redirectIfAuthenticated = require("./middleware/redirectIfAuthenticated")
const connectFlash = require("connect-flash");
const lougoutController = require("./controllers/logout");
const createPostController= require('./controllers/createPost');
const homePageController = require('./controllers/homePage');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPost');
const createUserController = require("./controllers/createUser");
const storeUserController = require('./controllers/storeUser');
const loginController = require("./controllers/login");
const loginUserController = require('./controllers/loginUser');
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated');
const app = new express();

app.use(expressSession({
    secret:'secret'
}));
app.use(connectFlash());
mongoose.connect('mongodb://localhost:27017/node-blog',{ useNewUrlParser: true })
.then(() => 'You are now connected to Mongo!')
    .catch(err => console.error('Something went wrong', err))

const mongoStore = connectMongo(expressSession)

app.use(expressSession({
    secret: 'secret',
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    })
}));

app.use(fileUpload());
app.use(express.static('public'));
app.use(expressEdge);
app.set('views',__dirname+'/views');

app.use('*',(req,res,next)=>{
    edge.GLOBALS('auth',req.session.userId)
    next()
});
app.use(bodyParse.json())
app.use(bodyParse.urlencoded({
    extended:true
}));


app.use('/posts/store',storePost)

app.get("/",homePageController);
app.get("/post/:id",getPostController);
app.get("/posts/new",auth,createPostController);
app.post("/posts/store",storePostController);
app.get("/auth/login",redirectIfAuthenticated,loginController);
app.get("/auth/logout",redirectIfAuthenticated,lougoutController);
app.post("/users/login",redirectIfAuthenticated,loginUserController);
app.get("/auth/register",redirectIfAuthenticated,createUserController);
app.post("/users/register",redirectIfAuthenticated,storeUserController);
app.listen(4000,()=>{
    console.log('Listening on port 4000')
});