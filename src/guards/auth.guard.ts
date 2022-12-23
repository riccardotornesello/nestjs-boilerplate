// NestJS
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

// Exceptions
import { InvalidTokenException, MissingTokenException } from '../exceptions';
// Services
import { AuthService } from '../modules/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.getToken(request);

    const user = await this.authService.getUserFromToken(token);
    if (!user) {
      throw new InvalidTokenException();
    }

    request.user = user;
    return true;
  }

  protected getToken(request: {
    headers: Record<string, string | string[]>;
  }): string {
    const authorization = request.headers['authorization'];
    if (!authorization || Array.isArray(authorization)) {
      throw new MissingTokenException();
    }
    const [, token] = authorization.split(' ');
    return token;
  }
}
