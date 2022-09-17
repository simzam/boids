let cursors;
let BOIDS = 5;
let rangeCollision = 20;
let rangeInfluence = 200;

class Boids extends Phaser.Physics.Arcade.Group
{
    constructor (scene)
    {
        super(scene)
    }
}

class Example extends Phaser.Scene
{
    preload ()
    {
        this.load.image('boid', 'imgs/boid.png');
    }

    create ()
    {
        console.log('simon');
        this.flock = this.add.group({
            key: 'boid',
            velocityX: 10,
            velocityY: 10,
            bounceX: 1,
            bouncey: 1,
            quantity: BOIDS,
            collideWorldbounds: true,
            allowRotation: true,
            visible: true,
        })
        // TODO M
        Phaser.Actions.RandomRectangle(this.flock.getChildren(), this.physics.world.bounds);
        cursors = this.input.keyboard.createCursorKeys();
        //Phaser.Actions.SetRotation(this.flock.getChildren(), 10);
        
    }
    
    proximity(boid, neighbour)
    {
        let dist = Phaser.Math.Distance.Between(boid.x, boid.y, neighbour.x, neighbour.y)
        console.log(dist);
        if (boid.x === neighbour.x && boid.y === neighbour.y) {
            return [0, "same x and y for boid and neighbour"]
        } else if (dist < rangeCollision) {
            return [dist, "collision"]
        } else if (dist < rangeInfluence) {
            return [dist, "influence"]
        } else {
            return [0, "out of range"]
        }
    }

    setVelocity(boid) 
    {
        console.log(this.flock.getChildren()[0].x, this.flock.getChildren()[0].y);

        // fix two empty arrays.
        let influencingNeighbours = {x: 0, y:0};
        let collidingNeighbours = {x: 0, y: 0};
        console.log(this.flock.getChildren()[0].x, this.flock.getChildren()[0].y);

        // TWO EMPTY ARRAYS
        for (let i = 0; i < this.flock.getLength(); i++) 
        {
            let neighbour = this.flock.getChildren()[i];
            console.log(neighbour);
            let proximity = this.proximity(boid, neighbour);
            let distance = proximity[0];
            let status = proximity[1];

            if (distance != 0)
            {
                if (status == "influence")
                {
                    if (collidingNeighbours.x > 0)
                    {
                        continue;
                    }
                    influencingNeighbours.x += neighbour.x;
                    influencingNeighbours.y += neighbour.y;
                }
                if (status == "collision")
                {

                }
            }
        }
        
        console.log(influencingNeighbours, collidingNeighbours);
    }

    keyHandler()
    {
        if (cursors.left.isDown)
        {

        }
        else if (cursors.right.isDown)
        {
            console.log("DOWN");
        }
        if (cursors.up.isDown)
        {
            console.log("DOWN");
        }
        else if (cursors.down.isDown)
        {
            console.log("DOWN");
        }
    }   
    
    update ()
    {
        console.log(this.flock.getChildren()[0].x, this.flock.getChildren()[0].y);
        // this.keyHandler();
        for (let i = 0; i < this.flock.getLength(); i++) {
            // let flip = (Math.random() < 0.90) ? true : false;
            let boid = this.flock.getChildren()[i];
            console.log(this.flock.getChildren()[0].x, this.flock.getChildren()[0].y);
            boid.velocityX, boid.velocityY = this.setVelocity(boid);
            console.log(this.flock.getChildren()[0].x, this.flock.getChildren()[0].y);
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth-15,
    height: window.innerHeight-15,
    backgroundColor: '#2dadfd',
    scene: [ Example ],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 300 }
        }
    },
    fps: {
        target: 24,
        forceSetTimeOut: true
    },
};

const game = new Phaser.Game(config);