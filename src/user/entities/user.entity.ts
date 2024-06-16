import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class User {
    // @Field(() => Int, { description: 'Example field (placeholder)' })
    // exampleField: number;

    @IsNotEmpty()
    @IsString()
    id: string

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsEmail()
    email: string


}
