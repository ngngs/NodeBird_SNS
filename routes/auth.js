const express = require('express');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { join, login, logout } = require('../controllers/auth'); 
const router = express.Router();

router.post('/join', isNotLoggedIn, join);
router.post('/login', isNotLoggedIn, login);
router.get('/logout', isLoggedIn, logout);

// 카카오 로그인
router.get('/kakao', passport.authenticate('kakao'))
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect : '/?loginError=카카오로그인 실패',         // passport-kakao 홈페이지 접속해서 양식 그대로 따라하면 됨
}), (req, res) => {
    res.redirect('/');
});

module.exports = router;