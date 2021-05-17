import { IsNumber, IsString, Length, MaxLength } from 'class-validator';

export class CountryDto {
  @IsString()
  name: string;

  @IsString()
  @Length(3)
  @MaxLength(3)
  code: string;

  @IsNumber()
  population: number;
}
