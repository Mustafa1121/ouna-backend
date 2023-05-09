const router = require('express').Router()
const controller = require('../../controller/User/UserAuth')

// POST (LOGIN)
router.post('/login', controller.login);
// POST (REGISTER)
router.post('/register', controller.register);
// POST (FORGOT PASSWORD)
router.post('/forgot-password', controller.forgotPassword);
// POST (FORGOT PASSWORD) WITH TOKEN
router.post('/reset-password/:token', controller.resetPassword);
// POST (VERIFY PASSWORD)
router.post('/verify-email', controller.verifyEmail);
// POST (VERIFY PASSWORD) WITH TOKEN
router.get('/verify-email/:token', controller.verifyEmailToken);

module.exports = router