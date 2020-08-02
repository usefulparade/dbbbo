// window.HTMLBodyElement.addEventListener('load', applySeriously);

var canv, canvParent;

var racers = [];

var blueRacer, redRacer, yellowRacer, orangeRacer, greenRacer, purpleRacer;

var newRacers;

var followMouse;

var seriously, src, blur, grain, dither, kal, glitch;

var speed, angle, angleVec, angleNoise;

var song;

var fft;

function preload(){

    song = loadSound('TRIPLExSNAXXX-DBBBO.wav');
}

function setup(){
    console.log('hi from p5');
    canv = createCanvas(1000, 800);
    canv.id('p5Canv');
    canvParent = select('#canvParent');
    canv.parent(canvParent);

    speed = 7;
    angle = PI;
    angleVec = new p5.Vector(cos(angle), sin(angle));
    angleNoise = 0;

    blueRacer = new Racer(0);
    redRacer = new Racer(1);
    yellowRacer = new Racer(2);

    racers.push(blueRacer);
    racers.push(redRacer);
    racers.push(yellowRacer);

    newRacers = false;
    followMouse = false;

    // song.addCue(7.7, addRacers);
    // song.play();
    song.playMode('restart');
    fft = new p5.FFT();


    applySeriously();
}

function draw(){
    background(175);

    for (var i=racers.length-1;i>=0;i--){
        racers[i].race();
    }

    if (src != null){
        src.update();
        grain.time = frameCount;
        glitch.time = frameCount;
    }
    // console.log(racers.length);
    
    angleJitter();

}

function Racer(_type){
    this.type = _type;
    this.init = function(){
        if (this.type == 0){
            this.col = color(0, 0, 255);
            this.baseOffset = new p5.Vector(0,0);
            this.pos = null;
        } else if (this.type == 1){
            this.col = color(255, 0, 0);
            this.baseOffset = new p5.Vector(-20,10);
            this.pos = null;
        } else if (this.type == 2){
            this.col = color(255, 255, 0);
            this.baseOffset = new p5.Vector(-30,-8);
            this.pos = null;
        } else if (this.type == 3){
            this.col = color(255, 110, 0);
            this.baseOffset = new p5.Vector(-40,20);
            this.pos = new p5.Vector(-200, height/2);
        } else if (this.type == 4){
            this.col = color(0, 164, 35);
            this.baseOffset = new p5.Vector(-35,-15);
            this.pos = new p5.Vector(-200, height/2);
        } else if (this.type == 5){
            this.col = color(150, 0, 255);
            this.baseOffset = new p5.Vector(-50,-20);
            this.pos = new p5.Vector(-200, height/2);
        } else {
            this.col = color(random(0, 255), random(0, 255), random(0, 255));
            this.baseOffset = new p5.Vector(random(-100, -10), random(-100, 100));
            this.pos = new p5.Vector(-200, height/2);
        }
        
    };
    this.init();
    this.offset = this.baseOffset;
    this.tail = [];
    
    // this.tail.push(this.pos);
    this.counter = random(0, 100);
    this.noiseOffX = random(0, 100);
    this.noiseOffY = random(0, 100);


    this.race = function(){
        push();

            translate(this.offset.x, this.offset.y);
            
            
                this.lastPos = this.pos;
                if (followMouse){
                    this.target = new p5.Vector(mouseX, mouseY);
                    this.pos = new p5.Vector(this.lastPos.x + ((this.target.x-this.lastPos.x)*0.07) + ((noise(this.noiseOffX)-0.5)*40), this.lastPos.y + ((this.target.y-this.lastPos.y)*0.01) + (sin(this.counter*0.01)*3) + ((noise(this.noiseOffY)-0.5)*4));
                } else {
                    this.target = new p5.Vector (200, height-200);
                    this.pos = new p5.Vector(this.target.x + (sin(this.counter*0.01)*100) + (noise(this.noiseOffX)*10), this.target.y + (cos(this.counter*0.01)*100) + (noise(this.noiseOffY)*10));
                }
                        
                // this.pos = new p5.Vector(this.lastPos.x + ((this.target.x-this.lastPos.x)*0.07) + (noise(this.noiseOffX)*40), this.lastPos.y + ((this.target.y-this.lastPos.y)*0.01) + (sin(this.counter*0.01)*3) + (noise(this.noiseOffY)*4));
           
                this.tail.push(this.pos);
                
            
         
            noFill();
            stroke(this.col);
            strokeWeight(10);
            for (i=0;i<this.tail.length-1;i+=1){
                if (followMouse){
                    this.tail[i+1].add(angleVec);
                }
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

function angleJitter(){
    angle = PI + ((noise(angleNoise)-0.5)*PI);
    // console.log(angle);
    angleVec = new p5.Vector(cos(angle), sin(angle));
    angleVec.mult(speed);
    angleNoise += random(0.001, 0.005);
}

function keyPressed(){
    // console.log('up');
    if (keyCode == UP_ARROW){
        kal.segments++;
        
    } else if (keyCode == DOWN_ARROW){
        kal.segments--;
    }

    if (key == 'x'){
        song.stop();
    } else if (key == 'z'){
        song.play();
    } else if (key == 'c'){
        racers.push(new Racer(racers.length));
    }

}

function mousePressed(){
    followMouse = !followMouse;
}

function addRacers(){

    if (!newRacers){
        orangeRacer = new Racer(3);
        greenRacer = new Racer(4);
        purpleRacer = new Racer(5);

        racers.push(orangeRacer);
        racers.push(greenRacer);
        racers.push(purpleRacer);
    
        newRacers = true;
    }

}

function hi(){
    console.log('hi');
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

