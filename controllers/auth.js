const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
exports.join = async (req, res, next) => {
    const { nick, email, password } = req.body;
    try {
        const exUser = await User.findOne({where:{email}});
        if (exUser) {
            return res.redirect('/join?error=exist');   // 이미 존재하는 유저의 이메일로 가입한다면
        }
        const hash = await bcrypt.hash(password, 12);   // bcrypt로 비밀번호 암호화
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.login = (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => { // localStrategy가 실행됨
        if (authError) {    // 서버실패
            console.error(authError);
            return next(authError);
        }
        if (!user) {    // 로직실패
            return res.redirect(`/?loginError=${info.message}`);
        }

        // 여기까지 왔으면 로그인 성공
        return req.login(user, (loginError) => {
            if (loginError) {   // 그래도 항상 에러가 날 상황을 대비
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        })
    })(req, res, next);
}

exports.logout = (req, res, next) => {  // {12321312 : nodejsID} 이걸 지워버림. 그래서 로그아웃 후 새로고침을 하게 되면 이게 지워져있어서 로그아웃처리되는거임
  req.logout(() => {
    res.redirect('/');
  })  
}