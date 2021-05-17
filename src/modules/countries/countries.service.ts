import { BadRequestException } from '@nestjs/common';
import { RedisService } from '../../libs/redis/redis.service';
import { CountryDto } from './dto/country.dto';
import { Injectable } from '@nestjs/common';
import { _ } from 'lodash';
import { CountryCodeDto } from './dto/countrycode.dto';
import countriesSeed from '../../config/countries'
@Injectable()
export class CountriesService {
  constructor(
    private redisService: RedisService
  ) {}

  async add(countryDto: CountryDto): Promise<void> {
    const exists = await this.redisService.keyExists(`country_${countryDto.code}_name`)

    if (exists === true) {
      throw new BadRequestException('Country already exists')
    }      

    await this.redisService.setValue(`country_${countryDto.code}_name`, countryDto.name)
    await this.redisService.setValue(`country_${countryDto.code}_population`, countryDto.population)
    await this.redisService.addToSet('countries', countryDto.code)
  }

  async update(countryDto: CountryDto): Promise<void> {
    const exists = await this.redisService.keyExists(`country_${countryDto.code}_name`)

    if (exists !== true) {
      throw new BadRequestException('Country doesn\'t exist')
    }      

    await this.redisService.setValue(`country_${countryDto.code}_name`, countryDto.name)
    await this.redisService.setValue(`country_${countryDto.code}_population`, countryDto.population)
  }

  async delete(countryCodeDto: CountryCodeDto): Promise<void> {
    const exists = await this.redisService.keyExists(`country_${countryCodeDto.code}_name`)

    if (exists !== true) {
      throw new BadRequestException('Country doesn\'t exist')
    } 

    await this.redisService.removeFromSet('countries', countryCodeDto.code)
    await this.redisService.deleteValue(`country_${countryCodeDto.code}_name`)
    await this.redisService.deleteValue(`country_${countryCodeDto.code}_population`)
  }

  async list(): Promise<Array<CountryDto>> {
    const values = await this.redisService.sort(
      'countries',
      [
        'BY',
        'country_*_population',
        'GET',
        'country_*_population',
        'GET',
        'country_*_name',
        'GET',
        '#'
      ]
    )

    const result = []

    _.chunk(values, 3).forEach(c => {
      result.unshift({
        population: parseInt(c[0]),
        name: c[1],
        code: c[2]
      })
    })

    return result
  }

  async seed(): Promise<void> {
    const promises = []

    countriesSeed.forEach(country => {
      promises.push(this.redisService.setValue(`country_${country.code}_name`, country.name))
      promises.push(this.redisService.setValue(`country_${country.code}_population`, Math.floor(Math.random() * (1000000 * 200)) + 1000000))
      promises.push(this.redisService.addToSet('countries', country.code))
    })

    await Promise.all(promises)
  }
}