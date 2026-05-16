const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//@desc register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
const {username, email, password} = req.body;
if(!username || !email || !password){
    res.status(400);
    throw new Error("Please fill all the fields");
}
    const userAvailabe = await User.findOne({email});
    if(userAvailabe){
        res.status(400);
        throw new Error("Email already exists");
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password", hashedPassword);
    const user = await User.create({
        username,
        email,
        password: hashedPassword
    });

    console.log(`User created ${user}`);    
    if(user){
        res.status(201).json({
            _id: user.id,
            username: user.username,
            email: user.email,
        });
    }else {
            res.status(400);
            throw new Error("User data is not valid");
        };
    res.status(201).json(user);
});

//@desc login a user
//@route POST /api/users/register
//@access public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        res.status(400);
        throw new Error("Please fill all the fields");
    }

    const user = await User.findOne({email});

    //Compare password with hashed password
    if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
            },
        },
        process.env.ACCESS_TOKEN_SECRET, 
        {expiresIn: '15m'}
    );
    res.status(200).json({accessToken});
    }else{
        res.status(401);
        throw new Error("Invalid credentials");
    }
});


//@desc Current user
//@route GET /api/users/register
//@access private
const currentUser = asyncHandler(async (req, res) => {
    // Handle user registration
    res.status(201).json(req.user);
});




module.exports = { registerUser, loginUser, currentUser };