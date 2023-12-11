import { IsEnum, IsOptional, IsNumber, IsString, IsEmpty } from "class-validator";
import { Category } from "../../schemas/book.schema";
import { User } from "src/schemas/user.schema";

export class UpdateBookDto {

    @IsOptional()
    @IsString()
    readonly title: string;

    @IsOptional()
    @IsString()
    readonly description: string;

    @IsOptional()
    @IsString()
    readonly author: string;

    @IsOptional()
    @IsNumber()
    readonly price: number;

    @IsOptional()
    @IsEnum(Category, { message: 'Category is not valid' })
    readonly category: Category;

    @IsEmpty({ message: 'You cannot specify the user' })
    readonly user: User;
}