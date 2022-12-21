// NestJS
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

// Services
import { AuthService } from '../modules/auth/auth.service';

// Exceptions
import { InvalidTokenException, MissingTokenException } from '../exceptions';

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
    const [_, token] = authorization.split(' ');
    return token;
  }
}
