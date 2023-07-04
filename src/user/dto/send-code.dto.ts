import { IsEmail, IsString } from "class-validator";

export class SendCodeDto {
    
    @IsString()
    email: string;
}