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

    // implement this

    // Boosters that the car has picked up

    /*
    this.kDelta = 0.3;

    this.mDye = new SpriteRenderable(spriteTexture);
    this.mDye.setColor([1, 1, 1, 0]);
    this.mDye.getXform().setPosition(50, 40);
    this.mDye.getXform().setSize(3, 4);
    this.mDye.setElementPixelPositions(0, 120, 0, 180);
    GameObject.call(this, this.mDye);
    
    var r = new RigidRectangle(this.getXform(), 3, 4);
    this.setRigidBody(r);
    this.toggleDrawRenderable();
    this.toggleDrawRigidShape();
    */
}
gEngine.Core.inheritPrototype(HeroCar, GameObject);

HeroCar.prototype.update = function () {
    GameObject.prototype.update.call(this);
};

// HeroCar.prototype.draw = fumction () { // implement this };