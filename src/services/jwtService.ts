import jwt from 'jsonwebtoken';
import { promisify } from 'node:util';
import { getIsDevelopment } from '../utils/env';

const verify = promisify(jwt.verify);

const isDevelopment = getIsDevelopment();

import { ConnectionParams } from 'subscriptions-transport-ws';
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

  getTokenFromConnectionParams(connectionParams: ConnectionParams) {
    const authorization = connectionParams?.Authorization;
    if (!authorization) {
      return null;
    }

    return authorization.slice('Bearer '.length);
  }

  async parsePayload(req: Request, connectionParams?: ConnectionParams) {
    const isWebsocket = connectionParams?.connectionType === 'WS';

    const token = isWebsocket ? this.getTokenFromConnectionParams(connectionParams) : this.getTokenFromRequest(req);

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
