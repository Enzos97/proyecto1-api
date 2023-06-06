import { IsNumber, IsString } from "class-validator";

export class CreateDatabaseErrorHandlingDto {
    @IsNumber()
    statusCode:number;
    @IsString()
    message:string;
    @IsString()
    error:string;
}
