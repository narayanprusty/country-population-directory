import {IsString, Length, MaxLength} from 'class-validator';

export class CountryCodeDto {
  @IsString()
  @Length(3)
  @MaxLength(3)
  code: string;
}
