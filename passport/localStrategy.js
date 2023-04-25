const passport = require('passport');
const { Strategy : LocalStrategy } = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');
module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',     // req.body.email
        passwordField: 'password',  // req.body.password
        passReqToCallback : false
    }, async(email, password, done) => {    // 로그인 시켜도 될지 안 될지 확인
        try {   
            const exUser = await User.findOne({where:{email}});
            if (exUser) {
                const result = await bcrypt.compare(password, exUser.password)  // 비밀번호 일치 여부 확인
                if (result) {
                    done(null, exUser);
                } else {
                    done(null, false, { message : '비밀번호가 일치하지 않습니다.'});
                }
            } else {
                done(null, false, { message : '가입되지 않은 회원입니다'});
            }
        } catch (error) {
            console.error(error);
            done(error);    // 예상하지 못한 실패로 서버가 죽을 때
        }
    }));
};