import { Test } from '@nestjs/testing'

import { AppController } from './app.controller'
import { CustomLoggerService } from './common/logger/logger.service'

describe('AppController', () => {

    let appController: AppController;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [AppController],
            providers: [CustomLoggerService]
        }).compile();

        appController = moduleRef.get<AppController>(AppController);
    });

    describe('test ping', () => {
        it('should return pong!', async () => {
            const response = await appController.test()
            expect(response.message).toBe('pong!');
        });
    });
});