const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const cookieParser = require('cookie-parser'); // ✅ Add this

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());
app.use(cookieParser()); 

app.use(session({
    secret: "fingerprint_customer",
    resave: false,  // Change this to `false` (prevents unnecessary session overwrites)
    saveUninitialized: false,  // Change this to `false` (only save sessions when data exists)
    cookie: { httpOnly: true, secure: false, maxAge: 3600000 }  // 1-hour expiration
}));

app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session && req.session.authorization) {
        const token = req.session.authorization.accessToken;
        
        jwt.verify(token, "secret_key", (err, user) => {
            if (!err) {
                req.user = user;
                return next();
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));