const express = require('express');
const router = express.Router();
const { renderJoin, renderMain, renderProfile} = require('../controllers/page');
const {isLoggedIn, isNotLoggedIn} = require("../middlewares");

router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followingIdList = [];
    next();
})

router.get('/profile', isLoggedIn, renderProfile);  // 로그인한 사람은 프로필 창을 보여주고
router.get('/join', isNotLoggedIn, renderJoin);     // 로그인 하지 않으면 로그인창 보여주기
router.get('/', renderMain);

module.exports = router;
