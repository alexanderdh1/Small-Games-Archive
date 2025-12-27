/*

Mangler springover
mangler bunkebland
mangler in-between skærm
mangler hvilken farve man skifter til
mangler korrect håntering at lægge flere kort i én runde
mangler en "sig uno" knap

*/
function setup() {
  createCanvas(1200, 1000);
  
  mitUno = new Uno();
  mitUno.addSpiller(new Spiller("spiller1",500,100));
  mitUno.addSpiller(new Spiller("spiller2",800,500));
  mitUno.addSpiller(new Spiller("spiller3",500,900));
  mitUno.addSpiller(new Spiller("spiller4",180,500));
  
  //spillere trækker 7 start kort op
  //k = start kort
  for (let k = 0; k < mitUno.getStartAntalKort(); k++) {
    //tæller antal spillere og trækker 7 kort op til hver spiller
    //s = hvilken spiller
    for (let s = 0; s < mitUno.getAntalSpillere(); s++){
      mitUno.getSpillere()[s].trækKort();
    }
  }
  let kort = mitUno.popKort();
  mitUno.pushKort(kort);
  
  mitGUI = new GUI();
}

function draw() {
  background(220);

  //løber igennem alle spillere
  //s = hvilken spiller
  for (let s = 0; s < mitUno.getAntalSpillere(); s++) {
    let forside = s == mitUno.getTur();
    mitUno.getSpillere()[s].tegnHånd(forside);
  }
  
  mitUno.tegnBunke(500-40,500-60);
  
  mitUno.tegnBunkeTræk(500-40,300-60);
  
  mitGUI.tegnNæsteTurKnap();
  
  mitGUI.visRunde();
}


function mousePressed(){
  mitUno.getSpillere()[mitUno.getTur()].lægKort(mouseX,mouseY);
  
  mitGUI.næsteTurKnapTryk(mouseX,mouseY);
  
  mitUno.getSpillere()[mitUno.getTur()].trækBunkeKort(mouseX,mouseY);
}



class Uno {
  constructor() {
    this.klar = false;
    this.tur = 0;
    this.startAntalKort = 7;
    this.retningMedUret = true;
    this.spillere = [];
    this.vindere = [];
    this.bunkeTræk = [];
    this.bunkeLæg = [];
    this.skabKort();
    this.blandKort();
  }

  skabKort() {
    for (let i = 0; i < 4; i++) {
      for (let tal = 0; tal < 10; tal++) {
        //Normale farvede kort
        this.bunkeLæg.push(new Kort(tal, true, false, false, false, false, 0, false, false));
        this.bunkeLæg.push(new Kort(tal, false, true, false, false, false, 0, false, false));
        this.bunkeLæg.push(new Kort(tal, false, false, true, false, false, 0, false, false));
        this.bunkeLæg.push(new Kort(tal, false, false, false, true, false, 0, false, false));
      }
      //plus4
      this.bunkeLæg.push(new Kort(-1, true, true, true, true, true, 4, false, false));

      for (let j = 0; j < 2; j++) {
        //skift farve
        this.bunkeLæg.push(new Kort(-1, true, true, true, true, true, 0, false, false));
      }
    }
    for (let i = 0; i < 2; i++) {
      //springOver
      this.bunkeLæg.push(new Kort(-1, true, false, false, false, false, 0, false, true));
      this.bunkeLæg.push(new Kort(-1, false, true, false, false, false, 0, false, true));
      this.bunkeLæg.push(new Kort(-1, false, false, true, false, false, 0, false, true));
      this.bunkeLæg.push(new Kort(-1, false, false, false, true, false, 0, false, true));

      //skiftRetning
      this.bunkeLæg.push(new Kort(-1, true, false, false, false, false, 0, true, false));
      this.bunkeLæg.push(new Kort(-1, false, true, false, false, false, 0, true, false));
      this.bunkeLæg.push(new Kort(-1, false, false, true, false, false, 0, true, false));
      this.bunkeLæg.push(new Kort(-1, false, false, false, true, false, 0, true, false));

      //plus2
      this.bunkeLæg.push(new Kort(-1, true, false, false, false, false, 2, false, false));
      this.bunkeLæg.push(new Kort(-1, false, true, false, false, false, 2, false, false));
      this.bunkeLæg.push(new Kort(-1, false, false, true, false, false, 2, false, false));
      this.bunkeLæg.push(new Kort(-1, false, false, false, true, false, 2, false, false));
    }
  }

  addSpiller(s) {
    this.spillere.push(s)
  }

  getSpillere() {
    return this.spillere;
  }

  getStartAntalKort() {
    return this.startAntalKort;
  }
  
  getRetningMedUret() {
    return this.retningMedUret;
  }
  
  getKlar() {
    return this.klar;
  }
  
  setKlar() {
    if (this.klar == true) {
      this.klar = false;
    }  else {
        this.klar = true;
    }
  }
  
  getTur() {
    return this.tur;
  }
  //i bestemmer hvor mange skift der skal være
  skiftTur(i) {
    if (this.retningMedUret) {
      this.tur = (this.tur + i) % this.getAntalSpillere();
    }  else {
        this.tur = (this.tur - i) % this.getAntalSpillere();
      if (this.tur < 0) {
        this.tur = this.tur + this.getAntalSpillere();
      }
    }
  }
  
  popKort() {
    return this.bunkeTræk.pop();
  }
  pushKort(k) {
    this.bunkeLæg.push(k);
  }
  blandKort() {
    while (this.bunkeLæg.length > 0) {
      let randomKort = Math.floor(Math.random() * this.bunkeLæg.length);
      this.bunkeTræk.push(this.bunkeLæg[randomKort]);
      this.bunkeLæg.splice(randomKort,1);
    }
  }
  getAntalSpillere() {
    return this.spillere.length;
  }
  tegnBunke(x,y) { 
    let forside = true;
    let sidstePlads = this.bunkeLæg.length - 1;
    let sidsteKort = this.bunkeLæg[sidstePlads];
    sidsteKort.tegnKort(x,y,forside);
  }
  tegnBunkeTræk(x,y) {
    let forside = false;
    let førstePlads = 0;
    let førsteKort = this.bunkeTræk[førstePlads];
    førsteKort.tegnKort(x,y,forside);
  }
  getBunkeLægTop() {
    return this.bunkeLæg[this.bunkeLæg.length - 1];
  }
  removeSpiller() {
    this.spillere.splice(this.tur, 1);
  }
  skiftRetning(){
    this.retningMedUret = !this.retningMedUret;
  }
}



class GUI {
  constructor() {
    this.næsteTurHøjde = 50;
    this.næsteTurBredde = 80;
    this.næsteTurX = 500-40;
    this.næsteTurY = 600;
  }
  
  tegnNæsteTurKnap() {

    fill(color(0));
    rect(this.næsteTurX, this.næsteTurY, this.næsteTurBredde, this.næsteTurHøjde, 5);
    textSize(20);
    fill(color(255));
    text("Færdig",this.næsteTurX+10, this.næsteTurY+27);
  }
  
  næsteTurKnapTryk(x,y) {
    
    if (x > this.næsteTurX && x < this.næsteTurX + this.næsteTurBredde && y > this.næsteTurY && y < this.næsteTurY + this.næsteTurHøjde) {
      if (mitUno.getSpillere()[mitUno.getTur()].getHånd().length == 0) {
          mitUno.removeSpiller();
      }
      mitUno.skiftTur(1);
    }
  }
  
  getNæsteTurHøjde() {
    return this.næsteTurHøjde;
  }
  
  getNæsteTurBredde() {
    return this.næsteTurBredde;
  }
  
  getNæsteTurX() {
    return this.næsteTurX;
  }
  
  getNæsteTurY() {
    return this.næsteTurY;
  }
  visRunde() {
    fill(0)
    text("Det er "+ mitUno.getSpillere()[mitUno.getTur()].getId() +"'s  runde", 10, 20)
  }
}



class Kort {
  constructor(t, r, gu, gr, b, sf, to, sr, so) {
    this.tal = t;
    this.rød = r;
    this.gul = gu;
    this.grøn = gr;
    this.blå = b;
    this.skiftFarve = sf;
    this.trækOp = to;
    this.skiftRetning = sr;
    this.springOver = so;
  }
  
  getBlå() {return this.blå;}
  getRød() {return this.rød;}
  getGul() {return this.gul;}
  getGrøn() {return this.grøn;}
  getTal() {return this.tal;}
  getSkiftFarve() {return this.skiftFarve;}
  getTrækOp() {return this.trækOp;}
  getSkiftRetning() {return this.skiftRetning;}
  getSpringOver() {return this.springOver;}
  
  tegnKort(x, y,forside) {
      //tal kort
      if (forside==true){
      if (this.tal > -1) {
        if (this.rød == true) {
          fill(color(255, 0, 0));
        } else if (this.gul == true) {
          fill(color(255, 255, 0));
        } else if (this.grøn == true) {
          fill(color(0, 255, 0));
        } else if (this.blå == true) {
          fill(color(0, 0, 255));
        }
        rect(x, y, 80, 120, 10);
        fill(color(255));
        textSize(10);
        text(this.tal, x + 10, y + 18);
        text(this.tal, x + 65, y + 110);
        textSize(50);
        text(this.tal, x + 25, y + 75);
      }
      //tegn +2
      if (this.trækOp > 0 & this.trækOp < 3){
        if (this.rød == true) {
          fill(color(255, 0, 0));
        } else if (this.gul == true) {
          fill(color(255, 255, 0));
        } else if (this.grøn == true) {
          fill(color(0, 255, 0));
        } else if (this.blå == true) {
          fill(color(0, 0, 255));
        }
        rect(x, y, 80, 120, 10);
        fill(color(255));
        textSize(10);
        text(concat("+",this.trækOp), x + 10, y + 18);
        text(concat("+",this.trækOp), x + 65, y + 110);
        textSize(50);
        text(concat("+",this.trækOp), x + 15, y + 75);
      }
      //plus +4
      if (this.trækOp >3){
        fill(color(0));
        rect(x, y, 80, 120, 10);
        fill(color(255));
        textSize(10);
        text(concat("+",this.trækOp), x + 10, y + 18);
        text(concat("+",this.trækOp), x + 65, y + 110);
        textSize(50);
        text(concat("+",this.trækOp), x + 15, y + 75);
      }
      //skift farve
      if (this.skiftFarve == true & this.trækOp==0){
        fill(color(0));
        rect(x,y,80,120,10);
        fill(color(255,0,0));
        circle(x+25,y+60,20);
        fill(color(0,255,0));
        circle(x+55,y+60,20);
        fill(color(0,0,255));
        circle(x+40,y+75,20);
        fill(color(255,255,0));
        circle(x+40,y+45,20);
      }
        
        //springover
      if (this.springOver == true) {
        if (this.rød == true) {
          fill(color(255, 0, 0));
        } else if (this.gul == true) {
          fill(color(255, 255, 0));
        } else if (this.grøn == true) {
          fill(color(0, 255, 0));
        } else if (this.blå == true) {
          fill(color(0, 0, 255));
        }
        rect(x, y, 80, 120, 10);
        fill(color(255));
        textSize(55);
        text("Ø", x + 20, y + 75)
      }
      if (this.skiftRetning == true) {
        let v0 = createVector(x + 50, y + 55);
        let v1 = createVector(-20, 20);

        let v2 = createVector(x + 33, y + 65)
        let v3 = createVector(20, -20);

        let v4 = createVector(x + 10, y + 10);
        let v5 = createVector(7, 7);

        let v8 = createVector(x + 26, y + 17);
        let v9 = createVector(-7, -7);

        let v6 = createVector(x + 70, y + 110);
        let v7 = createVector(-7, -7);

        let v10 = createVector(x + 54, y + 103)
        let v11 = createVector(7, 7);

        if (this.rød == true) {
          fill(color(255, 0, 0));
        } else if (this.gul == true) {
          fill(color(255, 255, 0));
        } else if (this.grøn == true) {
          fill(color(0, 255, 0));
        } else if (this.blå == true) {
          fill(color(0, 0, 255));
        }
        rect(x, y, 80, 120, 10);
        fill(color(255));
        drawArrow(v0, v1, 'white');
        drawArrow(v2, v3, 'white');
        drawArrow(v4, v5, 'white');
        drawArrow(v6, v7, 'white');
        drawArrow(v8, v9, 'white');
        drawArrow(v10, v11, 'white');
      }

        
    } else{

    fill(color(0));
    rect(x, y, 80, 120, 10);
    textSize(10);

    fill(color(255,0,0));
    //rotate(PI / 3.5);
    ellipse(x+40, y+60, 60, 100);
    fill(255, 251, 5)
    textSize(23)
    text("UNO",x+16,y+65)

    }
  }
  
}

class Spiller {
  constructor(i,x,y) {
    this.hånd = [];
    this.id = i;
    this.x = x;
    this.y = y;
  }
  
  sigUno() {
    
  }
  trækBunkeKort(x,y) {
    let kx = 500-40;
    let ky = 300-60;
    let kh = 120;
    let kb = 80;
    
    if (x > kx && x < kx+kb && y > ky && y < ky+kh){
      this.hånd.push(mitUno.popKort());
    } 
  }
  
  trækKort() {
    this.hånd.push(mitUno.popKort());
  }
  
  
  lægKort(x,y) {
    let kort0x = this.x - this.hånd.length * 20 - 20;
    let kort0y = this.y - 60;
    
    for (let k = 0; k < this.hånd.length; k++){
      //tjekker om x,y er indenfor kort hitbox
      if (x > kort0x+k*40 && x < kort0x+k*40 + 40 && y > kort0y && y < kort0y + 120){
        let kort = this.hånd[k];
        let bunke = mitUno.getBunkeLægTop();
        let tilladt = false;
        if (kort.getBlå() && bunke.getBlå()) {tilladt = true}
        if (kort.getRød() && bunke.getRød()) {tilladt = true}
        if (kort.getGul() && bunke.getGul()) {tilladt = true}
        if (kort.getGrøn() && bunke.getGrøn()) {tilladt = true}
        if (kort.getTal() == bunke.getTal()) {tilladt = true}
        if (kort.getSpringOver() && bunke.getSpringOver()) {tilladt = true}
        if (kort.getSkiftRetning() && bunke.getSkiftRetning()) {tilladt = true}
        if (kort.getTrækOp() && bunke.getTrækOp()) {tilladt = true}
          
// SpringOver
// TrækOp
        if (tilladt) {
          if (kort.getSkiftRetning()) {
            mitUno.skiftRetning();
          }
          mitUno.pushKort(kort);
          this.hånd.splice(k,1)
        }
      }
    }
  }
  getId() {
    return this.id;
  }
  getHånd() {
    return this.hånd;
  }
  getX() {
    return this.x;
  }
  getY() {
    return this.y;
  }
  tegnHånd(forside) {
    //kører igennem antallet af kort på hånden som der skal tegnes
    //k = kort
    for (let k = 0; k < this.hånd.length; k++) {
      //tegner kort på deres placeringer
      let x = this.x+k*40-this.hånd.length*20-20;
      let y = this.y-60;
      let kort = this.hånd[k];
      kort.tegnKort(x,y,forside);
    }
  }
}


//tegner vektor på kort
function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 5;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}
