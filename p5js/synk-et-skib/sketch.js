function setup() {
  createCanvas(800, 800);
  Battleships = new PearlHarbourShips();
  Playerships = new Ships();
}

function draw() {
  background(220);
  Battleships.createGrid();
  Playerships.makeShipsV2();
}

function mouseClicked() {
  if (mouseX > 30 && mouseX < 30+30*Battleships.getGridSizeX() && mouseY > 30 && mouseY < 30+30*Battleships.getGridSizeY()) {
    Playerships.getShipLength().splice(Playerships.getPlayerShips-1,1);
    print(Playerships.getPlayerShips());
    Playerships.removePlayerShips();
    Battleships.placeShip(mouseX,mouseY);

    
  }
}


class PearlHarbourShips {
  constructor(cx,cy) {
    this.gridSizeX=10;
    this.gridSizeY=10;
    this.gridBoxLength=30;
    this.gridBoxHeigth=30;
    this.placement=[];
    this.cellX=cx;
    this.cellY=cy;
  }
  
  createGrid(){
    fill(100);
    for (let i=0; i < this.gridSizeX;i++) {
      for (let j=0; j < this.gridSizeY; j++) {
        rect(30+i*30, 30+j*30, 30, 30);
      }
    }

  }
  getGridSizeX() {
    return this.gridSizeX;
  }
  getGridSizeY() {
    return this.gridSizeY;
  }
  placeShip(x,y) {

    if (mouseX > 30 && mouseX < 30+30*this.gridSizeX && mouseY > 30 && mouseY < 30+30*this.gridSizeY) {
      Playerships.makeShips();
      //laver musens koordinater om til cellernes x og y koordinater
      let cellX = round((mouseX-45)/30);
      let cellY = round((mouseY-45)/30);
      // tilføjer cellernes koordinater til et array
      this.placement.push(cellX,cellY);
      print(this.placement);

      
      
    }
  }
  //tallene fra this.placement array skal bruges, og cellernes koordinater skal findes, derefter skal en rød firkant laves på cellens plads
  placeCells() {
    return this.placement[0];
  }
  placeCells2() {
    return this.placement[1];
  }
}

class Ships {
  constructor(){
    this.shipLength=[2,2,3,4,5];
    this.playerShips=5;
    this.shipRotation= false;
    this.shipNumber=1;
  }
  
  makeShips() {
    //lav 5 skibe 
    for (let i=0; i <this.playerShips; i++) {
      //størrelse på skibe
      for (let j=0; j < this.shipLength[i]; j++) {
        fill(255,0,0);
        if (this.shipRotation == false) {
          rect(mouseX+j*30,mouseY+i*60,30,30);
        } else {
          rect(mouseX+i*60,mouseY+j*30,30,30);
        }
      }
    }
  }
  makeShipsV2() {
    fill(255,0,0);
    for (let i=0; i < 2; i++) {
      rect(Battleships.placeCells()*30+30*i,Battleships.placeCells2()*30+30,30,30);
    }
  }
  getShipLength() {
    return this.shipLength;
  }
  getPlayerShips() {
    return this.playerShips;
  }
  removePlayerShips() {
    this.playerShips-=1;
  }

}


