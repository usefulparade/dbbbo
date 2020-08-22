// window.HTMLBodyElement.addEventListener('load', applySeriously);

var canv, canvParent;

var racers = [];

var blueRacer, redRacer, yellowRacer, orangeRacer, greenRacer, purpleRacer;

var newRacers;

var songStage;

var seriously, src, blur, grain, dither, kal, glitch, vignette, expose, hueSat, shake, reformat;

var speed, angle, angleVec, angleNoise;

var song;

var fft;

var font;

var dbboPos;
var snaxOpacity, bgOpacity;
var snaxLetters;

var colors = [];

var movieMode, blurMode;
var songTime;

function preload(){
    font = loadFont('summer76font.ttf');
    song = loadSound('TRIPLExSNAXXX-DBBBO.wav');
}

function setup(){

    console.log('hi from p5');
    canv = createCanvas(1000, 666);
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
    songStage = 0;

    bgOpacity = 255;
    blurMode = false;

    snaxOpacity = 0;
    dbbboPos = new p5.Vector(220, 30);
    // song.addCue(11, addRacers);
    // song.play();
    song.playMode('restart');
    fft = new p5.FFT();

    snaxLetters = ['T', 'R', 'I', 'P', 'L', 'E', 'S', 'N', 'A', 'X', 'X', 'X'];

    movieMode = false;
    songTime = 0;

    applySeriously();

}

function draw(){
    if (songStage == 2){
        if (bgOpacity > 0){
            bgOpacity -= 1;
        }
    } else {
        makeBlurMode();
        
    }

    songCues();

    background(175, bgOpacity);

    angleJitter();

    for (var i=racers.length-1;i>=0;i--){
        racers[i].race();
    }

    if (src != null){
        src.update();
        grain.time = frameCount;
        glitch.time = frameCount*0.1;
        expose.exposure = noise(racers[0].noiseOffX)*0.01;
    }
    // push();
    //     textSize(40);
    //     text(songTime, width/2, height/2);
    // pop();
    
    beginningCard();
    endCard();

}

function Racer(_type){
    this.type = _type;

    this.init = function(){
        if (this.type == 0){
            this.col = color(0, 0, 255);
            this.baseOffset = new p5.Vector(0,0);
            this.endOffset = new p5.Vector(0,0);
            this.pos = new p5.Vector(200,height-200);
            // this.pos.add(this.noiseAndSin);
        } else if (this.type == 1){
            this.col = color(255, 0, 0);
            this.baseOffset = new p5.Vector(-20,10);
            this.endOffset = new p5.Vector(0,0);
            this.pos = new p5.Vector(200,height-200);
        } else if (this.type == 2){
            this.col = color(255, 255, 0);
            this.baseOffset = new p5.Vector(-30,-8);
            this.endOffset = new p5.Vector(0,-20);
            this.pos = new p5.Vector(200,height-200);
        } else if (this.type == 3){
            this.col = color(255, 110, 0);
            this.baseOffset = new p5.Vector(-40,20);
            this.endOffset = new p5.Vector(0,-20);
            this.pos = new p5.Vector(-200, height/2);
        } else if (this.type == 4){
            this.col = color(0, 164, 35);
            this.baseOffset = new p5.Vector(-35,-15);
            this.endOffset = new p5.Vector(0,20);
            this.pos = new p5.Vector(-200, height/2);
        } else if (this.type == 5){
            this.col = color(150, 0, 255);
            this.baseOffset = new p5.Vector(-50,-20);
            this.endOffset = new p5.Vector(0,20);
            this.pos = new p5.Vector(-200, height/2);
        } else {
            this.col = color(random(0, 255), random(0, 255), random(0, 255));
            this.baseOffset = new p5.Vector(random(-100, -10), random(-100, 100));
            this.endOffset = new p5.Vector(0,0);
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

            // if (songStage != 3){
                // translate(this.offset.x, this.offset.y);
            // }
            
                this.lastPos = this.pos;

                if (songStage == 0) {
                    speed = 0;
                    this.target = new p5.Vector(200, height-150);
                    this.target.add(this.offset);
                    this.noiseAndSin = new p5.Vector((sin(this.counter*0.01)*100) + (noise(this.noiseOffX)*10), (cos(this.counter*0.01)*100) + (noise(this.noiseOffY)*10));
                    this.target.add(this.noiseAndSin);
                    this.buffer = new p5.Vector(((this.target.x-this.lastPos.x)), ((this.target.y-this.lastPos.y)));
                    this.buffer.mult(0.1);
                    // this.target = new p5.Vector (this.lastPos.x + (200 - this.lastPos.x)*0.2, this.lastPos.y + ((height-200)-this.lastPos.y)*0.2);
                    this.pos = new p5.Vector(this.lastPos.x + this.buffer.x, this.lastPos.y + this.buffer.y);
                    // this.pos.add(this.noiseAndSin);

                } else if (songStage == 1){
                    speed = 15;
                    this.target = new p5.Vector(mouseX, mouseY);
                    this.target.add(this.offset);
                    this.buffer = new p5.Vector(((this.target.x-this.lastPos.x)), ((this.target.y-this.lastPos.y)));
                    this.buffer.mult(0.05);
                    this.pos = new p5.Vector(this.lastPos.x + this.buffer.x, this.lastPos.y + this.buffer.y);
                    this.noiseAndSin = new p5.Vector(((noise(this.noiseOffX)-0.5)*40), (sin(this.counter*0.01)*3) + ((noise(this.noiseOffY)-0.5)*4));
                    this.pos.add(this.noiseAndSin);
                } else if (songStage == 2){
                    speed = 7;
                    // kal.segments += 0.0001;
                    // this.target = new p5.Vector(map(noise(this.noiseOffX), 0, 1, 0, width), map(noise(this.noiseOffY), 0, 1, 0, height));
                    this.lissajous = new p5.Vector(2*cos(this.counter*0.1 + QUARTER_PI), this.type*sin(this.counter*0.3));
                    this.k = this.type+1;
                    this.rose = new p5.Vector(cos((7/this.k)*this.counter*(0.01*(this.k/7)))*cos(this.counter*(0.01*(this.k/7))), cos((7/this.k)*this.counter*(0.01*(this.k/7)))*sin(this.counter*(0.01*(this.k/7))));
                    this.rose.mult(height);
                    this.target = this.rose;
                    this.midOffset = new p5.Vector(width*0.5, height*0.5);
                    this.target.add(this.midOffset);
                    this.target.add(this.offset);
                    this.buffer = new p5.Vector(((this.target.x-this.lastPos.x)), ((this.target.y-this.lastPos.y)));
                    this.buffer.mult(0.05);
                    this.pos = new p5.Vector(this.lastPos.x + this.buffer.x, this.lastPos.y + this.buffer.y);
                    // this.noiseAndSin = new p5.Vector(((noise(this.noiseOffX)-0.5)*40), (sin(this.counter*0.01)*3) + ((noise(this.noiseOffY)-0.5)*4));
                    // this.pos.add(this.noiseAndSin);
                } else if (songStage == 3){
                    speed = 0;
                    this.target = new p5.Vector(width*0.5, height*0.5);
                    this.target.add(this.endOffset);
                    if (this.type % 2){
                        this.noiseAndSin = new p5.Vector((sin(this.counter*0.01)*100) + (noise(this.noiseOffX)*10), (sin(this.counter*0.01)*60) + (noise(this.noiseOffY)*10));
                    } else {
                        this.noiseAndSin = new p5.Vector((sin(this.counter*0.01)*100) + (noise(this.noiseOffX)*10), -(sin(this.counter*0.01)*60) + (noise(this.noiseOffY)*10));
                    }
                    this.target.add(this.noiseAndSin);
                    this.buffer = new p5.Vector(((this.target.x-this.lastPos.x)), ((this.target.y-this.lastPos.y)));
                    this.buffer.mult(0.1);
                    this.pos = new p5.Vector(this.lastPos.x + this.buffer.x, this.lastPos.y + this.buffer.y);
                    
                    if (this.target.x > width*0.5){
                        this.target.add(new p5.Vector(-1, 0));
                    }

                    
                }


                        
                // this.pos = new p5.Vector(this.lastPos.x + ((this.target.x-this.lastPos.x)*0.07) + (noise(this.noiseOffX)*40), this.lastPos.y + ((this.target.y-this.lastPos.y)*0.01) + (sin(this.counter*0.01)*3) + (noise(this.noiseOffY)*4));
           
                this.tail.push(this.pos);
                
            
            if (songStage != 2){
                noFill();
            } else {
                noFill();
                // fill(this.col);
            }
            stroke(this.col);
            strokeWeight(10);
            if (songStage == 1 || songStage == 2){
                beginShape();
            } else {
                
            }
            for (i=0;i<this.tail.length-1;i+=1){
                if (songStage != 0){
                    this.tail[i].add(angleVec);
                }
                
                if (songStage == 1 || songStage == 2){
                    vertex(this.tail[i].x, this.tail[i].y);
                } else {
                    line(this.tail[i].x, this.tail[i].y, this.tail[i+1].x, this.tail[i+1].y);
                }
            }
            if (songStage == 1 || songStage == 2){
                endShape();
            } else {
            }
        pop();

        if (this.tail.length > 150){
            this.tail.shift();
        }

        // this.offset = new p5.Vector(this.baseOffset.x + (noise(this.noiseOffX)*400), this.baseOffset.y + (noise(this.noiseOffY)*400));
        this.noiseOffX += random(0.001, 0.01);
        this.noiseOffY += random(0.001, 0.01);
        if (songStage == 2){
            this.counter += random(3, 10);
        } else {
            this.counter += random(1, 7);
        }
    };

    

}

function angleJitter(){

    if (songStage != 2){
        angle = PI + ((noise(angleNoise)-0.5)*PI);
    } else {
        angle = PI + ((noise(angleNoise)-0.5)*TWO_PI*2);
    }
    angleVec = new p5.Vector(cos(angle), sin(angle));
    angleVec.mult(speed);
    angleNoise += random(0.001, 0.005);

}

function keyPressed(){
    if (keyCode == UP_ARROW){
        kal.segments = 1000;
        console.log(kal.segments);
        
    }
    if (keyCode == DOWN_ARROW){
        kal.segments = 0;
        console.log(kal.segments);
    }

    if (keyCode == RIGHT_ARROW){
        blurMode = true;
    } 
    if (keyCode == LEFT_ARROW){
        blurMode = false;
    }

    if (key == 'x'){
        song.stop();
    } else if (key == 'z'){
        song.play();
    } else if (key == 'c'){
        racers.push(new Racer(racers.length));
    } else if (key == '.'){
        song.jump(song.currentTime() + 20);
    } else if (key == ','){
        song.jump(song.currentTime() - 20);
    }  else if (key == 'b'){
        console.log(song.currentTime());
    }

    if (key == '1' || key == '2' || key == '3' || key == '4'){
        songStage = parseInt(key)-1;
    }

}

function mousePressed(){
    
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height){

        if (songStage == 0){
            for (i=0;i<racers.length;i++){
                racers[i].tail.shift();
            }  

            if (song.currentTime() == 0){
                song.play();
            }

            songStage = 1;

        }
    }

    // songStage = (songStage + 1) % 4;
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

function beginningCard(){
    push();
        if (songStage > 0){
            dbbboPos.add(angleVec);
        }

        translate(dbbboPos.x, dbbboPos.y);
        rotate(HALF_PI);
        textAlign(LEFT, CENTER);
        textFont(font);
        textSize(150);
        noStroke();
        fill(0);
        
        // text("D", -10, 0);
        // text("B", 120, 0);
        // text("B", 240, 0);
        // text("B", 360, 0);
        text("DBBB", -10, 0);
    pop();

    if (!movieMode){
        push();
            if (songStage > 0){
                dbbboPos.add(angleVec);
            }
            translate(dbbboPos.x, dbbboPos.y);
            // rotate(HALF_PI);
            textAlign(LEFT, CENTER);
            textFont(font);
            textSize(36);
            noStroke();
            fill(0);
            text("click", 200, 240);
            text("anywhere", 200, 300);
            text("to start", 200, 360);
        pop();
    }
}

function endCard(){
    push();
        if (songStage < 3){
            snaxOpacity = 0;
        } else {
            if (snaxOpacity < 255){
                snaxOpacity += 1;
            }
        }

        translate(width*0.5, 120);
        rotate(HALF_PI);
        textAlign(CENTER, CENTER);
        textFont(font);
        textSize(150);
        noStroke();
        fill(0, snaxOpacity);
        // text("TRIPLE", 0, 0);
        // text("SNAXXX", 0, 200);
        for (i=0;i<6;i++){
            text(snaxLetters[i], i*82, -260);
            text(snaxLetters[i+6], i*82, 250);
        }
    pop();

    if (!movieMode){
        push();

            translate(width*0.5, 0);
            // rotate(HALF_PI);
            textAlign(CENTER, CENTER);
            textFont(font);
            textSize(24);
            noStroke();
            fill(0, snaxOpacity);
            text("click", 0, 150);
            text("anywhere", 0, 200);

            text("to race", 0, height-200);
            text("again", 0, height-150);
        pop();
    }
}

function windowResized(){
    // if (windowWidth > 1000){
    //     resizeCanvas(1000, 666);
    // } else {
    //     resizeCanvas(windowWidth, windowWidth*0.66);
    //     windowScale = windowWidth/1000;
    // }
}

function hi(){
    console.log('hi');
}

function songCues(){
    songTime = song.currentTime();
    if (!movieMode){

        if (songTime > 81.5 && songTime < 105){
            blurMode = true;
        } else if (songTime > 128 && songTime < 151.5){
            blurMode = true;
        } else if (songTime > 221){
            blurMode = true;
        } else {
            blurMode = false;
        }

        if (songTime > 11.5 && songTime < 151.2){
            if (racers.length < 6){
                addRacers();
            }
        }else if (songTime > 151.2 && songTime < 198){
            if (songStage != 2){
                songStage = 2;
            }
        } else if (songTime > 198 && songTime < 239){
            if (songStage != 1){
                songStage = 1;
            }
        } else if (songTime > 239){
            if (songStage != 3){
                songStage = 3;
            }
        }

        
    }

    
}

function makeBlurMode(){
    if (!blurMode){
        if (bgOpacity < 255){
            bgOpacity += 1;
        }
        expose.exposure = 0.1;
        glitch.distortion = 0.005;
        vignette.amount = 0.6;

    } else {
        if (bgOpacity > 100){
            bgOpacity -=5;
        }
        expose.exposure = 8;
        glitch.distortion = 0.006;
        vignette.amount = 0.7;
    }
}

function applySeriously(){
    console.log('hi from seriously');
    seriously = new Seriously();

    src = seriously.source('#p5Canv');
    var target = seriously.target('#seriouslyCanv');

    var blur = seriously.effect('blur');

    kal = seriously.effect('kaleidoscope');
    // kal.sections = 2;
    kal.segments = 0;
    kal.source = src;
    // target.source = kal;
    seriously.go();

    // hueSat = seriously.effect('hue-saturation');
    // hueSat.hue = 0;
    // hueSat.saturation = 0.1;
    // hueSat.source = kal;

    expose = seriously.effect('exposure');
    expose.exposure = 0.1;
    expose.source = kal;

    grain = seriously.effect('filmgrain');
    grain.amount = 0.04;
    grain.source = expose;

    shake = seriously.transform('camerashake');
    shake.source = grain;

    vignette = seriously.effect('vignette');
    vignette.amount = 0.6;
    vignette.source = shake;

    glitch = seriously.effect('tvglitch');
    glitch.distortion = 0.005;
    glitch.verticalSync = 0;
    glitch.frameShape = 2;
    glitch.scanlines = 0.01;
    glitch.lineSync = 0.001;
    glitch.bars = 0.015;
    glitch.source = vignette;

    target.source = glitch;

    console.log(src);

}

