import Redis from "ioredis";


class RedisService {

    private redis: Redis;


    constructor(){

        this.redis = new Redis({
            host: process.env.REDIS_HOST || "localhost",
            port: Number(process.env.REDIS_PORT) || 6379
        });


        this.redis.on(
            "connect",
            ()=>{
                console.log(
                    "Redis Connected"
                );
            }
        );


        this.redis.on(
            "error",
            (error)=>{
                console.log(
                    "Redis Error",
                    error
                );
            }
        );
    }


    async set(
        key:string,
        value:string
    ){

        return await this.redis.set(
            key,
            value
        );

    }


    async get(
        key:string
    ){

        return await this.redis.get(
            key
        );

    }


    async delete(
        key:string
    ){

        return await this.redis.del(
            key
        );

    }


}


export default new RedisService();