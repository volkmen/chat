import jwt from 'jsonwebtoken';
import { IncomingMessage } from 'http';
import { promisify } from 'node:util';
import { UnAuthorisedError } from '../utils/errors';

const verify = promisify(jwt.verify);

class JwtService {
  secret = 'SECRET';

  createToken = payload => {
    console.log(this.secret);
    return jwt.sign(payload, this.secret, {
      expiresIn: '1d'
    });
  };

  async verify(req: IncomingMessage) {
    const token = req.headers.authorization.slice('Bearer '.length);

    try {
      const payload = await verify(token, this.secret);
      return payload;
    } catch (e) {
      throw new UnAuthorisedError('Token expires');
    }
  }
}

export default JwtService;
