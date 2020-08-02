// window.HTMLBodyElement.addEventListener('load', applySeriously);

var canv, canvParent;

var racers = [];

var blueRacer, redRacer, yellowRacer;

var seriously, src, blur, grain, dither, kal, glitch;

var speed;

function setup(){
    console.log('hi from p5');
    canv = createCanvas(1000, 800);
    canv.id('p5Canv');
    canvParent = select('#canvParent');
    canv.parent(canvParent);

    speed = 7;

    blueRacer = new Racer(0);
    redRacer = new Racer(1);
    yellowRacer = new Racer(2);

    noCursor();

    racers.push(blueRacer);
    racers.push(redRacer);
    racers.push(yellowRacer);
    applySeriously();
    
}

function draw(){
    background(175);

    // for (i=0;i<racers.length;i++){
        
    //     racers[i].race();
    // }
    racers[0].race();
    racers[1].race();
    racers[2].race();

    if (src != null){
        src.update();
        grain.time = frameCount;
        glitch.time = frameCount;
    }

}

function Racer(_type){
    this.type = _type;
    this.init = function(){
        if (this.type == 0){
            this.col = color(0, 0, 255);
            this.baseOffset = new p5.Vector(0,0);
        } else if (this.type == 1){
            this.col = color(255, 0, 0);
            this.baseOffset = new p5.Vector(-20,10);
        } else if (this.type == 2){
            this.col = color(255, 255, 0);
            this.baseOffset = new p5.Vector(-30,-8);
        }
        
    };
    this.init();
    this.offset = this.baseOffset;
    this.tail = [];
    this.pos = new p5.Vector(-100,height/2);
    this.tail.push(this.pos);
    this.counter = 0;
    this.noiseOffX = 0;
    this.noiseOffY = 0;


    this.race = function(){
        push();
            translate(this.offset.x, this.offset.y);
            this.lastPos = this.pos;
            this.target = new p5.Vector(mouseX, mouseY);
            
            
            this.pos = new p5.Vector(this.lastPos.x + ((this.target.x-this.lastPos.x)*0.07) + (noise(this.noiseOffX)*40), this.lastPos.y + ((this.target.y-this.lastPos.y)*0.01) + (sin(this.counter*0.01)*3) + (noise(this.noiseOffY)*4));
            this.tail.push(this.pos);
        
        
            
            noFill();
            stroke(this.col);
            strokeWeight(10);
            for (i=0;i<this.tail.length-1;i++){
                this.tail[i+1].add(new p5.Vector(-speed, 0));
                // ellipse(this.tail[i].x, this.tail[i].y, 10, 10);
                line(this.tail[i].x, this.tail[i].y, this.tail[i+1].x, this.tail[i+1].y);
                
            }
        pop();

        if (this.tail.length > 150){
            this.tail.shift();
        }

        // this.offset = new p5.Vector(this.baseOffset.x + (noise(this.noiseOffX)*400), this.baseOffset.y + (noise(this.noiseOffY)*400));

        this.noiseOffX += random(0.001, 0.01);
        this.noiseOffY += random(0.001, 0.01);
        this.counter += random(1, 7);
    };

    

}

function keyPressed(){
    console.log('up');
    if (keyCode == UP_ARROW){
        kal.segments++;
        
    } else if (keyCode == DOWN_ARROW){
        kal.segments--;
    }

}

function applySeriously(){
    console.log('hi from seriously');
    seriously = new Seriously();

    src = seriously.source('#p5Canv');
    var target = seriously.target('#seriouslyCanv');

    var blur = seriously.effect('blur');
    // blur.amount = 0.02;
    // blur.source = src;
    // target.source = blur;

    dither = seriously.effect('dither');
    // dither.source = src;
    // target.source = dither;

   

    kal = seriously.effect('kaleidoscope');
    // kal.sections = 2;
    kal.segments = 0;
    kal.source = src;
    // target.source = kal;
    seriously.go();

    grain = seriously.effect('filmgrain');
    grain.amount = 0.04;
    grain.source = kal;
    target.source = grain;

    glitch = seriously.effect('tvglitch');
    // glitch.source = grain;
    // target.source = glitch;

    console.log(src);

}

