var side = 0;
let inputElem;
let tid = 1;
let måned = 0;

function setup() {
  createCanvas(400, 400);
  textAlign(CENTER);
//opretter to classes
  minBankkonto = new Bankkonto();
  mitGUI = new GUI();
//opretter et tekstfelt  
  inputElem = createInput('');
  inputElem.input(onInput);
  inputElem.position(117, 280);
}

function draw() {
  background(32,42,68);
//Tegner alt teksten, som skal være på den første skærm
  textSize(20);
  fill(color(255))
  text("Måned " + måned,55,390);
  textSize(40);
  text(minBankkonto.getSaldo() + " kr",200,40);
  textSize(20);
  text(minBankkonto.getKontanter() + " Kontanter",310,390);
//starter en timer
  tid=tid+1;
  
  if (side==1 || side==2) {
    mitGUI.tegnGodkendKnap();
    inputElem.show();
  } else {
    inputElem.hide();
  }
  mitGUI.tegnIndsætPengeKnap();
  rente()
  mitGUI.tegnHævPengeKnap();

}

function mousePressed() {
//godkend knappen virker, hvis man ikke er på forsiden
  if (side!==0) {
    mitGUI.godkendKnap(mouseX,mouseY);
  } 
  mitGUI.indsætPengeKnap(mouseX,mouseY);
  mitGUI.hævPengeKnap(mouseX,mouseY);
}

function onInput() {
  minBankkonto.indsætInput(int(this.value()));
  
}

function rente() {
//tilføjer en rente til saldoen efter et bestemt antal frames
  if (tid == 450) {
    tid=0;
    måned+=1;
    if (minBankkonto.getSaldo() > 0) {
      minBankkonto.indsætRente();
    }
  }
//giv 100kr kontant om måneden
  if (tid==1) {
    minBankkonto.getLøn()
  }
}

class Bankkonto {
  constructor() {
    this.indsæt = 0;
    this.saldo = 0;
    this.kontanter = 100;
  }
  getIndsætRente() {
    return round(this.saldo*0.07,2);  
  }
  getSaldo() {
    return round(this.saldo,2);
  } 
  
  indsætInput(p) {
    this.indsæt=p;
  }
  
  indsætPenge(){
    if (this.kontanter>=this.indsæt) {
      this.saldo+=this.indsæt;
      this.kontanter-=this.indsæt;
    }
  }
  
  indsætRente() {
    this.saldo=this.saldo+(this.saldo*0.07);  
  }
  
  hævPenge() {
    if (this.saldo>=this.indsæt) {
      this.saldo-=this.indsæt;
      this.kontanter+=this.indsæt;
    }
  }
  
  getKontanter() {
    fill(color(255));
    return this.kontanter;
  }
  getLøn() {
    this.kontanter+=100;
  }
}

class GUI {
  constructor() {
    this.godkendKnapHøjde = 50;
    this.godkendKnapBredde = 80;
    this.godkendKnapX = 300;
    this.godkendKnapY = 265;
    this.indsætPengeKnapHøjde = 50;
    this.indsætPengeKnapBredde = 120;
    this.indsætPengeKnapX = 140;
    this.indsætPengeKnapY = 165;
    this.hævPengeKnapHøjde = 50
    this.hævPengeKnapBredde = 120
    this.hævPengeKnapX = 140;
    this.hævPengeKnapY = 220;
  }
  
  tegnIndsætPengeKnap() {
    fill(color(255));
    if (side!=2) {
      rect(this.indsætPengeKnapX, this.indsætPengeKnapY, this.indsætPengeKnapBredde, this.indsætPengeKnapHøjde, 5);
    }
    
    textSize(18);
    fill(color(32,42,68));
    if (side==0) {
      text("Indsæt Penge",this.indsætPengeKnapX+60, this.indsætPengeKnapY+30);
    } else if (side==1){
      text("Tilbage",this.indsætPengeKnapX+60, this.indsætPengeKnapY+30);
    }
  }
  
  indsætPengeKnap(x,y) {
//knappen virker, hvis man ikke er på side 2
     if (side!==2) {
      if (x > this.indsætPengeKnapX && x < this.indsætPengeKnapX + this.indsætPengeKnapBredde && y > this.indsætPengeKnapY && y < this.indsætPengeKnapY + this.indsætPengeKnapHøjde) {
//hvis knappen bliver trykket på, skifter den side
        if (side==1) {
          side=0;
        }  else {
          side=1
        }
      } 
    }
  }
  
  tegnGodkendKnap() {
    fill(color(255));
    rect(this.godkendKnapX, this.godkendKnapY, this.godkendKnapBredde, this.godkendKnapHøjde, 5);
    
    textSize(18);
    fill(color(32,42,68));
    text("Godkend",this.godkendKnapX+40, this.godkendKnapY+30);
  }
  

  godkendKnap(x,y) {
    if (x > this.godkendKnapX && x < this.godkendKnapX + this.godkendKnapBredde && y > this.godkendKnapY && y < this.godkendKnapY + this.godkendKnapHøjde) {
      if (side==1) {
        minBankkonto.indsætPenge();
      } 
      if (side==2) {
        minBankkonto.hævPenge();
        
      }
    }
  }
  tegnHævPengeKnap() {
    fill(color(255));
    if (side!=1)  {
      rect(this.hævPengeKnapX, this.hævPengeKnapY, this.hævPengeKnapBredde, this.hævPengeKnapHøjde, 5);
    }

    textSize(18);
    fill(color(32,42,68));
    if (side==0) {
      text("Hæv Penge",this.hævPengeKnapX+60, this.hævPengeKnapY+30);
    } else if (side==2){
      text("Tilbage",this.hævPengeKnapX+60, this.hævPengeKnapY+30);
    }
  }
  hævPengeKnap(x,y) {
    if (side!==1) {
      if (x > this.hævPengeKnapX && x < this.hævPengeKnapX + this.hævPengeKnapBredde && y > this.hævPengeKnapY && y < this.hævPengeKnapY + this.hævPengeKnapHøjde) {
        if (side==2) {
          side=0;
        }  else {
          side=2;
        }
      }
    } 
  }
}





