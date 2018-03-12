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

    this.mBoosters = [];

    Car.call(this, spriteTexture);

    this.kSpriteTexture = spriteTexture;

    this.getXform().setPosition(-50, 0); // move init position so that it's not the same as HeroCar

}
gEngine.Core.inheritPrototype(HeroCar, Car);

HeroCar.prototype.update = function () {
    GameObject.prototype.update.call(this);
};

HeroCar.prototype.getTexture = function() {
    return this.kSpriteTexture;
}

HeroCar.prototype.useBooster = function() {
    if (this.mBoosters > 0) {
        var vel = this.getRigidBody().getVelocity();
        this.getRigidBody().setVelocity(vel[0] * 2, vel[1] * 2);
        this.mBoosters--; 
    }
}

HeroCar.prototype.pickUpBooster = function(booster) {
    this.mBoosters.push(booster);
    // move booster position to the Inventory Display on the UI and draw the renderable there
}

HeroCar.prototype.draw = function(camera) {

    this.getRenderable().draw(camera);

    // draw the set of Boosters to the UI

};
