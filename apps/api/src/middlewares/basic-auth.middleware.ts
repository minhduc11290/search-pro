import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class BasicAuthMiddleware implements NestMiddleware {
  use = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Access to the API docs"');
      res.status(401).send('Authentication required.');
      return;
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'ascii',
    );
    const [username, password] = credentials.split(':');

    const validUsername = process.env.BASIC_AUTH_USERNAME || 'admin';
    const validPassword = process.env.BASIC_AUTH_PASSWORD || 'admin';

    if (username !== validUsername || password !== validPassword) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Access to the API docs"');
      res.status(401).send('Invalid credentials.');
      return;
    }

    next();
  };
}
