import jwt from 'jsonwebtoken';
import { promisify } from 'node:util';

const verify = promisify(jwt.verify);

class JwtService {
  secret = 'SECRET';

  createToken = payload => {
    return jwt.sign(payload, this.secret, {
      expiresIn: '1d'
    });
  };

  getTokenFromRequest(req: Request) {
    const authorization = req.headers.get('Authorization');
    if (!authorization) {
      return null;
    }

    return authorization.slice('Bearer '.length);
  }

  async parsePayload(req: Request) {
    const token = this.getTokenFromRequest(req);
    try {
      const payload: { id: number } = await verify(token, this.secret);
      return payload;
    } catch (e) {
      return null;
    }
  }
}

export default JwtService;
