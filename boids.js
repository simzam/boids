const BOIDS = 100;
const RANGEINFLUENCE = 700;
const RANGECOLLISION = 20;
const RADIUS = 10;
const DIAMETER = 2 * RADIUS;

const SEPARATIONFACTOR = 0.2;
const ALIGNMENTFACTOR = 0.0000001;

// I wouild love dynamic resize
// TODO: would be nice with dynamic resizing based on browser window
// TODO: fun to play with elements from the dom. 
function printLineNum(lineNum) {
    console.log(lineNum);    
}
class Boids extends Phaser.Scene
{
    preload ()
    {
        this.load.image('boid', 'imgs/ball.png');
    }

    create ()
    {
        this.physics.world.setBounds(0, 0, config.width, config.height);
        this.flock = this.physics.add.group({
            collideWorldBounds: true,
            bounceX: 1.0,
            bounceY: 1,
            dragX: 0,
            dragY: 0,
            maxVelocityX: 180,
            maxVelocityY: 180,
            frictionX: 0,
            frictionY: 0,
            checkWorldBounds: true
        });
        this.boids = [];
        for (let i = 0; i < BOIDS; i++) {
            let x = Phaser.Math.Between(DIAMETER, config.width - DIAMETER);
            let y = Phaser.Math.Between(DIAMETER, config.height - DIAMETER);
            let boid = this.flock.create(x, y, 'boid');
            boid.update = 0;
            let velX = Phaser.Math.Between(-180, 180);
            let velY = Phaser.Math.Between(-180, 180);
            let initialVelocity = new Phaser.Math.Vector2(velX, velY);
            boid.body.velocity = initialVelocity;
            boid.body.velocityY = Phaser.Math.Between(-180, 180);
            this.boids.push(boid);

        }
        this.updateVal = 1;
        this.cursors = this.input.keyboard.createCursorKeys();    
        this.neighboursPos = new Phaser.Math.Vector2(0,0);
        this.neighboursVel = new Phaser.Math.Vector2(0,0);

        this.boidPos = new Phaser.Math.Vector2(0,0);
        this.boidVel = new Phaser.Math.Vector2(0,0);
    }

    alignment (boid) {
        let a = (this.neighboursPos.subtract(boid.body.position)).scale(ALIGNMENTFACTOR);
        if (isNaN(a.x) || isNaN(a.y)){
            console.log("checking in alignment", this.neighboursPos, boid.body.position);
        } 
        return a; 

    }

    cohesion (boid) {
        //boid.body.velocity.add(this.neighboursPos.scale(0.001).negate());
    }

    separation (boid) {
        let posAngel = 1;
        if (this.neighboursPos.angle() < boid.body.position.angle()) {
            posAngel = 1;
        }

        let copyBoidPos =  this.neighboursPos.clone();
        let ang = copyBoidPos.add(boid.body.position);
        if (ang.angle() < 1){

        }
        boid.body.velocity.rotate(-0.1);
        // Math.floor((ang + Math.PI) * SEPARATIONFACTOR)
    }

    manageBoids(boid, neighbours) {
        // TODO use math vector2
        let n = neighbours.length;
        if (n <= 1) {
            return;
        }

        //this.boidPos.setTo(boid.x, boid.y);
        //this.boidVel.setTo(boid.velocityX, boid.velocityY);

        this.neighboursPos.setTo(0);
        // console.log('neighbour pos before', this.neighboursPos);
        this.neighboursVel.setTo(0);
        
        for (let neighbour of neighbours)
        {
           // console.log(neighbour.position);
 
            if (neighbour.x == boid.x && neighbour.y == boid.y) {
                continue;
            }
            this.neighboursVel.add(neighbour.velocity); 
            this.neighboursPos.add(neighbour.position);

            console.log('in loop',this.neighboursPos, this.neighboursVel);
        }
        //console.log(this.boids.length)
        // TODO divide VECTORS by n
//        this.neighboursVel.divide(n - 1);
        console.log(this.neighboursPos);

        if (n > 2)
            this.neighboursPos.divide(n - 1);

        let v1 = this.alignment(boid);
        //this.separation(boid);
        //this.cohesion(boid);

        boid.body.velocity.add(v1);
        console.log(v1);
    }
    
    update ()
    {   
        this.updateVal += 1;
        this.updateVal %= 2;
        for (let boid of this.boids) 
        {
            if (boid.update != this.updateVal || Math.random() < 0.11) {
            }
            boid.update += 1;
            boid.update %= 2; 
            // TODO read documentation on overlapCirc
            let neighbours = this.physics.overlapCirc(boid.x, boid.y, RANGEINFLUENCE);
                
            this.manageBoids(boid, neighbours);
            if (this.cursors.left.isDown)
            {
                boid.setAngle(Phaser.Math.Between(-180, 188));
                if (Math.random() < 0.1)
                    boid.setVelocityX(Phaser.Math.Between(-100, 200));
            }         
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#2dadfd',
    scene: [ Boids ],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },
};

const game = new Phaser.Game(config);