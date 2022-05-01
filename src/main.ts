import { NestFactory } from '@nestjs/core'
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { CustomLoggerService } from './common/logger/logger.service'

async function bootstrap() {

    CustomLoggerService.initWiston()

    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule.forRoot(),
        new FastifyAdapter(),
        {
            logger: new CustomLoggerService()
        }
    );

    const port = 8080;
    await app.listen(port, '0.0.0.0');
}

bootstrap();
