import { IsBoolean, IsInt, IsNotEmpty, IsString, Min } from "class-validator"


export class CreateSutemenyDto{
  @IsString()
  @IsNotEmpty({message: 'A nevet kötelező megadni'})
  nev: string;

  @IsBoolean()
  lactoseFree: boolean;

  @IsInt()
  @Min(0)
  db: number;
}
