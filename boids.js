let cursors;
let BOIDS = 1;
let rangeCollision = 20;
let rangeInfluence = 200;


class Example extends Phaser.Scene
{
    preload ()
    {
        this.load.image('boid', 'imgs/boid.png');
    }

    create ()
    {
        //this.physics.world.setBoundsCollision(true, true, true, true);
        //this.physics.world.on('worldbounds', onWorldBounds);

        let deltax = 30;
        this.physics.world.setBounds(deltax,deltax,config.width - deltax,config.height - deltax);
        console.log('simon');
        this.flock = this.physics.add.group({
            collideWorldBounds: true,
            bounceX: 0,
            bounceY: 0.8,
            velocityY: 0,
            velocityX: 0,
            checkWorldBounds: true
        });

        for (let i = 0; i < BOIDS; i++) {
            let boid = this.flock.create(Phaser.Math.Between(700, 700), Phaser.Math.Between(900, 900), 'boid');
            boid.angle = Phaser.Math.Between(-180, 180);
            boid.setMaxVelocity(900);
            boid.setCollideWorldBounds(true);
        }
        // Phaser.Actions.Call(group.getChildren(), function (bal) {
        //     ball.body.onWorldBounds = true;
        // });
    
        //this.physics.world.on('worldbounds', onWorldBounds);
        cursors = this.input.keyboard.createCursorKeys();

    }
    
    onWorldBounds(body) 
    {
        log.console('boundcc bounce');
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

    update ()
    {   
        for (let i = 0; i < this.flock.getLength(); i++) {
                let boid = this.flock.getChildren()[i];
                console.log(boid.body.checkWorldBounds());
                //console.log(boid.x, boid.y, boid.body.world.bounds, 
                //    config.width, 
                //    config.height);
                if (boid.body.checkWorldBounds()) {
                    console.log("BOUNCE");
                    boid.alpha -= 10;
                }
                if (cursors.left.isDown)
                {
                    boid.setAngle(Phaser.Math.Between(-180, 188));
                   if (Math.random() < 0.1)
                        boid.setVelocityX(Phaser.Math.Between(-300, 1300));
                }         
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth-65,
    height: window.innerHeight-65,
    backgroundColor: '#2dadfd',
    scene: [ Example ],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 0 }
        }
    },
//    fps: {
//        target: 30,
//        forceSetTimeOut: false
//    },
};

const game = new Phaser.Game(config);