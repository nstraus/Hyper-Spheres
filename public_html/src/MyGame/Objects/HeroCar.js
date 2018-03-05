/* File: HeroCar.js
 *
 * Creates and initializes the HeroCar (Dye)
 * overrides the update function of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, SpriteRenderable, WASDObj */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function HeroCar(spriteTexture) {

    // Boosters that the car has picked up

    Car.call(this, spriteTexture);

    this.kSpriteTexture = spriteTexture;

    this.getXform().setPosition(-50, 0); // move init position so that it's not the same as HeroCar

    /*
    var r = new RigidRectangle(this.getXform(), 3, 4);
    this.setRigidBody(r);
    this.toggleDrawRenderable();
    this.toggleDrawRigidShape();
    */

}
gEngine.Core.inheritPrototype(HeroCar, Car);

HeroCar.prototype.update = function () {
    GameObject.prototype.update.call(this);
};

HeroCar.prototype.getTexture = function() {
    return this.kSpriteTexture;
}

// HeroCar.prototype.draw = fumction () { // implement this };
