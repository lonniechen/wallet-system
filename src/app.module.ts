import { DynamicModule } from '@nestjs/common';

import { AppController } from './app.controller'
import { WalletModule } from './api/wallet/wallet.module';
import { CustomLoggerService } from './common/logger/logger.service';

export class AppModule {
    static forRoot(): DynamicModule {
        return {
            module: AppModule,
            imports: [
                WalletModule
            ],
            providers: [
                CustomLoggerService
            ],
            controllers: [
                AppController
            ]
        }
    }
}
