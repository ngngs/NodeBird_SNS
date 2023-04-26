const passport = require('passport');
const {Strategy : KakaoStrategy} = require('passport-kakao');
const User = require('../models/user');
module.exports = () => {
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID, // KAKAO Developers에서 REST API를 받아올 수 있다.
        callbackURL : '/auth/kakao/callback',   // Kakao 로그인 Redirect URL에 입력해줘야 함
    }, async (accessToken, refreshToken, profile, done) => {    // profile은 카카오가 제공하는 거에 따라 다르기 때문에 콘솔을 찍어보자
        console.log('profile', profile);
        try{
            const exUser = await User.findOne({
                where: { snsId: profile.id, provider: 'kakao'}
            });
            if (exUser) {
                done(null, exUser);
            } else {
                const newUser = await User.create({
                    email: profile._json?.kakao_account?.email,
                    nick: profile.displayName,
                    snsId : profile.id,
                    provider: 'kakao',
                })
                done(null, newUser);
            }
        } catch (error) {
            console.error(error);
            done(error)
        }
    }));
};