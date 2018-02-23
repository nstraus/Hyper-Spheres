/*
* Car.js
* 
*/

"use strict";

function Car(spriteTexture) {
	
	this.mCar = new TextureRenderable(spriteTexture);
    this.mCar.setColor([1, 1, 1, 0]);
    this.mCar.getXform().setPosition(50, 40);
    this.mCar.getXform().setSize(10, 10);
    // this.mCar.setElementPixelPositions(0, 120, 0, 180);
    GameObject.call(this, this.mCar);

    this.mScore = 0; // initialize Score to 0
}
gEngine.Core.inheritPrototype(Car, GameObject);

Car.prototype.getScore = function () {
    return this.mScore;
}

Car.prototype.score = function () {
    this.mScore++;
}