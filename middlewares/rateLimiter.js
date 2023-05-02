const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 5, 
	standardHeaders: true, 
	legacyHeaders: false, 
})

// Apply the rate limiting middleware to all requests
module.exports={limiter}