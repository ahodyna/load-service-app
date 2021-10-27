const router = require("express").Router();

const {authContoller} = require('../controllers');
const userMiddlewares = require('../middlewares/user.middlewares');

router.post('/register', userMiddlewares.isValidUserData, authContoller.register);
router.post('/login',userMiddlewares.isValidUserDataLogin, authContoller.login);
router.post('/forgot_password', authContoller.forgotPassword)

module.exports = router;