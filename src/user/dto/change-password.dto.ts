
import { IsNumber, IsString, Matches, Max, MaxLength, Min, MinLength } from "class-validator";

export class NewPasswordUserDto {
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @IsNumber()
    @Min(100000)
    @Max(999999)
    code: number
}