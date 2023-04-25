const User = require('../models/user');
const bcrypt = require('bcrypt');

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

exports.login = () => {
    
}

exports.logout = () => {
    
}