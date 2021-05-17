import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
var redis = require('redis');

@Injectable()
export class RedisService {
  private client;
  constructor(
    private configService: ConfigService,
  ) {
    this.client = redis.createClient(this.configService.get(
      'redisURL',
    ));
  }

  keyExists(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.client.exists(key, (error, reply) => {
        if(error) {
          reject(error)
        } else if (reply === 1) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  }

  getValue(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.get(key, (error, value) => {
        if(error) {
          reject(error)
        } else {
          resolve(value)
        }
      })
    })
  }

  setValue(key: string, value: string|number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, (error) => {
        if(error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  addToSet(setName: string, value: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const multi = this.client.multi()
      multi.sadd(setName, value);
      multi.exec(error => {
        if(error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  removeFromSet(setName: string, value: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const multi = this.client.multi()
      multi.srem(setName, value);
      multi.exec(error => {
        if(error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  sort(key: string, query: Array<string>): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
      this.client.sort(key, ...query, (error, values) => {
        if(error) {
          reject(error)
        } else {
          resolve(values)
        }
      })
    })
  }

  deleteValue(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.del(key, error => {
        if(error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }
}
