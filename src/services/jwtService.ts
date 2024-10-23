import jwt from 'jsonwebtoken';
import { promisify } from 'node:util';
import { getIsDevelopment } from '../utils/env';

const verify = promisify(jwt.verify);

const isDevelopment = getIsDevelopment();
class JwtService {
  secret = 'SECRET';

  createToken = payload => {
    return jwt.sign(payload, this.secret, {
      expiresIn: isDevelopment ? 1000 * 60 * 60 * 24 * 30 : '1d'
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
      if (token) {
        const payload: { id: number } = await verify(token, this.secret);
        return payload;
      }
      return null;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}

export default JwtService;
