/*
* EnemyCar.js
*
*/

"use strict";

function EnemyCar(spriteTexture) {
	// implement this

    Car.call(this, spriteTexture);

    this.getXform().setPosition(50, 0); // move init position so that it's not the same as HeroCar


}
gEngine.Core.inheritPrototype(EnemyCar, Car);

// EnemyCar.prototype.update = function () { // implement this };

// EnemyCar.prototype.draw = function () { // implement this };
