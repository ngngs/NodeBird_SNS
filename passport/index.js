const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
    passport.serializeUser((user, done) => {    // user = exUser
        done(null, user.id);                    // user id만 추출하는 이유는 {세션쿠키 : 유저아이디} 이런 식으로 메모리에 저장하기 때문(user 정보 전체를 저장하면 메모리 폭파)
    });   

    passport.deserializeUser((id, done) => {
        User.findOne({where:{id}})
            .then((user) => done(null, user))
            .catch(err => done(err));
    });

    local();
};