import { IsNotEmpty, IsString } from 'class-validator';

export class ListDto {
  @IsString()
  @IsNotEmpty()
  playlist_name: string;
}
