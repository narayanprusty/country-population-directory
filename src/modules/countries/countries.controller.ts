import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  ValidationPipe,
  Patch,
  Delete,
  Param
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CountriesService } from './countries.service';
import { CountryDto } from './dto/country.dto';
import { CountryCodeDto } from './dto/countrycode.dto';

@Controller('countries')
export class CountriesController {
  constructor(private countriesService: CountriesService) {}

  @Post()
  @UseGuards(AuthGuard())
  add(@Body(ValidationPipe) countryDto: CountryDto): Promise<void> {
    return this.countriesService.add(countryDto);
  }

  @Post('seed')
  @UseGuards(AuthGuard())
  seed(): Promise<void> {
    return this.countriesService.seed();
  }

  @Get()
  @UseGuards(AuthGuard())
  list(): Promise<Array<CountryDto>> {
    return this.countriesService.list();
  }

  @Patch()
  @UseGuards(AuthGuard())
  update(@Body(ValidationPipe) countryDto: CountryDto): Promise<void> {
    return this.countriesService.update(countryDto);
  }

  @Delete(':code')
  @UseGuards(AuthGuard())
  delete(@Param(ValidationPipe) countryCodeDto: CountryCodeDto): Promise<void> {
    return this.countriesService.delete(countryCodeDto);
  }
}
