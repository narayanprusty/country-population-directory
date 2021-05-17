import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpCredentialsDto {
  @IsString()
  @MinLength(6)
  @Matches(/^[a-zA-Z0-9]+$/, {
    message:
      'Username can contain only alphabet and numbers.',
  })
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password too weak. Password must have capital letters and special characters',
  })
  password: string;
}
