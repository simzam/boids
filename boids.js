const BOIDS = 250;
const RANGEINFLUENCE= 200;

// TODO: would be nice with dynamic resizing based on browser window
// TODO: fun to play with elements from the dom. 

class Boids extends Phaser.Scene
{
    preload ()
    {
        this.load.image('boid', 'imgs/boid.png');
    }

    create ()
    {
        this.physics.world.setBounds(0, 0, config.width, config.height);
        this.flock = this.physics.add.group({
            collideWorldBounds: true,
            bounceX: 0.9,
            bounceY: 0.8,
            velocityY: 300,
            velocityX: 300,
            maxVelocity: 600,
            checkWorldBounds: true
        });

        for (let i = 0; i < BOIDS; i++) {
            let boid = this.flock.create(Phaser.Math.Between(0, 900), 
                                         Phaser.Math.Between(0, 900), 
                                         'boid');
            boid.rotation = Phaser.Math.Between(0, 2 * Math.PI);
        }

        this.cursors = this.input.keyboard.createCursorKeys();    
    }

    alignment (boid, neighbours) {
        let neighboursRotation;
        for (let neighbour of neighbours)
        {
            neighboursRotation += neighbour.rotation;
        }
        neighboursRotation %= 2 * Math.PI;
        if (neighboursRotation - boid.rotation < 0) 
        {
            //rotate left
            boid.rotation += 0.1;
        } 
        else 
        {
            boid.rotation += 0.1;
        }
    }

    cohesion (boid, neighbours) {
        return undefined;
    }

    separation (boid, neighbours) {
        return undefined;
    }

    

    update ()
    {   
        for (let boid of this.flock.getChildren()) 
        {
            let neighbours = this.physics.overlapCirc(boid.x, boid.y, 
                                                    RANGEINFLUENCE);
            this.alignment(boid, neighbours);
            if (this.cursors.left.isDown)
            {
                boid.setAngle(Phaser.Math.Between(-180, 188));
                if (Math.random() < 0.1)
                    boid.setVelocityX(Phaser.Math.Between(300, 2300));
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

