import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
export class CreateNoteDto {
  @IsString() text: string;
  @IsOptional() @IsString() passphrase?: string;
  @IsInt() @Min(1) @Max(7) expiresInDays: number;
  @IsInt() @Min(1) @Max(10) maxViews: number;
}
