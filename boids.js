var game = new Phaser.Game(4*480, 4*320,
                           Phaser.CANVAS,
                           null,
                           {preload: preload,
                            create: create,
                            update: update}
                          );
var ball;

function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#fef';
    game.load.image('ball', 'imgs/ball.png');
}

function create() {
    ball = game.add.sprite(50, 50, 'ball');
}

function update() {
    ball.x += 1;
    ball.y += 1;
}
