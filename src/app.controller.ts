import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { Sutemeny } from './sutemeny';
import { UpdateSutemenyDto } from './update-sutemeny.dto';
 
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }

  sutik : Sutemeny[] = [
    {
      id: 1,
      name: "Tiramisu",
      lactoseFree: true,
      db: 5
    },
    {
      id: 2,
      name: "Dobostorta",
      lactoseFree: false,
      db: 0
    },
    {
      id: 4,
      name: "Krémes",
      lactoseFree: true,
      db: 1
    }
  ];
  nextId = 5;

  @Get('sutik')
  sutemenyekListazas(){
    return this.sutik
      .map((suti, idx) => {
        return {
          id: idx,
          name: suti
        }
      })
      .filter(suti => suti.name != null);
  }

  // /sutik/3
  @Get('sutik/:sutiid')
  sutemenyIdAlapjan(@Param('sutiid') id : string){
    const idSzam = parseInt(id);
    const suti = this.sutik.find(suti => suti.id == idSzam);
    if (!suti) {
      throw new NotFoundException("Nincs ilyen id-jű süti")
    }
    return;
  }


  // /sutikereses?kereses=torta
  @Get('sutiKereses')
  sutemenyKereses(@Query('kereses') kereses? : string) {
    if (!kereses){
      return this.sutik
    }
    return this.sutik.filter(suti => suti.name.toLocaleLowerCase().includes(kereses.toLocaleLowerCase()));
  }

  @Delete('sutik/:sutiid')
  sutiTorles(@Param(':sutiid') id : string) {
    const idSzam = parseInt(id);
    const idx = this.sutik.findIndex(suti => suti.id == idSzam);
    this.sutik.splice(idx)
  }

  @Post('ujSuti')
  ujSuti(@Body() ujSutiAdatok: Sutemeny){
    const ujSutemeny: Sutemeny = {
      ...ujSutiAdatok,
      id: this.nextId,
    }
    this.nextId++;
    this.sutik.push(ujSutemeny);
    return ujSutemeny;
  }

  @Patch('sutiModositas/:sutiid')
  sutiModositas(@Param('sutiid') id: string, @Body() sutiAdatok: UpdateSutemenyDto){
    const idSzam = parseInt(id);
    const eredetiSutiId = this.sutik.findIndex(suti => suti.id == idSzam);
    const eredetiSuti = this.sutik[eredetiSutiId];

    if (typeof sutiAdatok.db != 'number') {
      throw new BadRequestException("A darab típusa szám kell legyen")
    }
    if (sutiAdatok.db < 0){
      throw new BadRequestException("A darab nem lehet kevesebb mint nulla")
    }

    const ujSuti : Sutemeny = {
      ...eredetiSuti,
      ...sutiAdatok,
      
    };
    this.sutik[eredetiSutiId] = ujSuti;
    return ujSuti;
  }
}
