import { Module, forwardRef } from '@nestjs/common';
import { CommonService } from './common.service';
import { DatabaseErrorHandlingModule } from 'src/database-error-handling/database-error-handling.module';


@Module({
  controllers: [],
  providers: [CommonService],
  exports: [CommonService],
  imports: [forwardRef(()=>DatabaseErrorHandlingModule)]
})
export class CommonModule {}
