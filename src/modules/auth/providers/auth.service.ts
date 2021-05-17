import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpCredentialsDto } from '../dto/signup-credentials.dto';
import { SignInCredentialsDto } from '../dto/signin-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, LoginRo } from '../ro/login.ro';
import { RedisService } from '../../../libs/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private redisService: RedisService
  ) {}

  async signUp(authCredentialsDto: SignUpCredentialsDto): Promise<void> {
    const exists = await this.redisService.keyExists(`username_${authCredentialsDto.username}`)

    if (exists === true) {
      throw new BadRequestException('Username already exists')
    }

    await this.redisService.setValue(`username_${authCredentialsDto.username}`, authCredentialsDto.password)
  }

  async signIn(authCredentialsDto: SignInCredentialsDto): Promise<LoginRo> {
    const password = await this.redisService.getValue(`username_${authCredentialsDto.username}`)

    if (password !== authCredentialsDto.password) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const payload: JwtPayload = { username: authCredentialsDto.username };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
