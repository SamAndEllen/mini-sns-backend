const jwt = require('jsonwebtoken');
const secret_key = process.env.JWT_SECRET_KEY;

function generateToken(payload) {
  return new Promise(
    (resolve, reject) => {
      jwt.sign(payload, secret_key, {
        expiresIn: '7d'
      }, (error, token) => {
        if(error) reject(error);
        resolve(token);
      });
    }
  );
}

function decodeToken(token) {
  return new Promise(
    (resolve, reject) => {
      jwt.verify(token, secret_key, (error, decoded) => {
        if(error) reject(error);
        resolve(decoded);
      });
    }
  );
}

const jwtMiddleware = async (ctx, next) => {
    const token = ctx.cookies.get('access_token');
    if(!token) return next();

    try {
        const decoded = await decodeToken(token);

        // 토큰 만료일이 하루밖에 안남으면 토큰을 재발급
        if(Date.now() / 1000 - decoded.iat > 60 * 60 * 24) {
            // 하루가 지나면 갱신해준다.
            const { userName } = decoded;
            const freshToken = await generateToken({ userName }, 'user');
            ctx.cookies.set('access_token', freshToken, {
                maxAge: 1000 * 60 * 60 * 24 * 7,
                httpOnly: false
            });
        }

        ctx.request.user = decoded;
    } catch (e) {
        // token validate 실패
        ctx.request.user = null;
    }

    return next();
};

exports.generateToken = generateToken;
exports.decodeToken = decodeToken;
exports.jwtMiddleware = jwtMiddleware;
