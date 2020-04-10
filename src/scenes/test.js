var canoe = game.add.sprite(0, 0, 'canoe');
var person1 = game.add.sprite(0, 0, 'person1');
var person2 = game.add.sprite(0, 0, 'person2') canoe.addChild(person1);
canoe.addChild(person2);
game.physics.enable(canoe, Phaser.Physics.P2);