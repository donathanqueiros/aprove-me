import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateAssignorDto {
  @Expose()
  @IsNotEmpty()
  @MaxLength(30)
  document: string;

  @Expose()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(140)
  email: string;

  @Expose()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @Expose()
  @IsNotEmpty()
  @MaxLength(140)
  name: string;
}
