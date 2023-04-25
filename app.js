const express = require('express'); 
const cookieParser = require('cookie-parser');
const morgan = require('morgan'); // 요청과 응답을 위한 morgan
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks'); 
const dotenv = require('dotenv');
const {sequelize} = require('./models');

// 자바스크립트는 위에서부터 읽기 때문에 여기는 아직 process.env를 모름
dotenv.config(); // process.env 파일을 읽어옴.
const pageRouter = require('./routes/page');

const app = express();
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
  });
sequelize.sync({force:false})
  .then(() => {
    console.log('데이터베이스 연결 성공')
  })
  .catch((err) => {
    console.error(err);
  })
app.use(morgan('dev'));  // 로깅을 개발모드로
app.use(express.static(path.join(__dirname, 'public')));    // public 폴더는 프론트가 접근 할 수 있도록 허용
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie : {
        httpOnly: true,
        secure: false,
    }
}));

app.use('/', pageRouter);
app.use((req, res, next) => {   // 404 NOT FOUND 에러 처리
    const error = new Error (`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);    // error 발생 시 error처리로 넘어감
});
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err: {}; // 에러 로그를 서비스한테 넘김
    res.status(err.status || 500);
    res.render('error'); // 에러 발생 시 error.html이 보여짐
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});