/*
* Ball.js
*
*/

"use strict";

function Ball(spriteTexture) {

	this.mBall = new SpriteRenderable(spriteTexture);
    this.mBall.setColor([1, 1, 1, 0]);
    this.mBall.getXform().setPosition(0, 0);
    this.mBall.getXform().setSize(3, 3);
    this.mBall.setElementPixelPositions(0, 120, 0, 180);
    GameObject.call(this, this.mBall);

    var r = new RigidCircle(this.getXform(), 3);
    this.setRigidBody(r);
    this.toggleDrawRenderable();
    this.toggleDrawRigidShape();
}
gEngine.Core.inheritPrototype(Ball, GameObject);

// Ball.prototype.update = function() { // implement this };

// Ball.prototype.draw = function() { // implement this };
