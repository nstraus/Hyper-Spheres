/*
 * File: MyGame.js
 * This is the logic of our game.
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject, MyGame */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!
var kSpeed = 40;

MyGame.prototype.radomizeVelocity = function()
{
    var i = 0;
    for (i = this.mFirstObject; i<this.mAllObjs.size(); i++) {
        var obj = this.mAllObjs.getObjectAt(i);
        var rigidShape = obj.getRigidBody();
        var x = (Math.random() - 0.5) * kSpeed;
        var y = Math.random() * kSpeed * 0.5;
        rigidShape.setVelocity(x, y);
    }
};

MyGame.prototype.createBounds = function() {
    this.wallAt(-100, 0, 90); // Left
    this.wallAt(100, 0, 90); // Right
    this.wallAt(0, 50, 0); // Top
    this.wallAt(0, -50, 0); // Bottom

    this.wallAt(90, -45, 45); // Bottom
    this.wallAt(90, 45, -45); // Bottom
    this.wallAt(-90, -45, -45); // Bottom
    this.wallAt(-90, 45, 45); // Bottom
};

MyGame.prototype.wallAt = function (x, y, d) {
    var p = new TextureRenderable(this.kWallTexture);
    var xf = p.getXform();

    var g = new GameObject(p);
    var r = new RigidRectangle(xf, 200, 3);
    g.setRigidBody(r);
    g.toggleDrawRenderable();
    g.toggleDrawRigidShape();

    r.setMass(0);
    xf.setSize(200, 3);
    xf.setPosition(x, y);
    xf.setRotationInDegree(d);
    this.mAllObjs.addToSet(g);
};

MyGame.prototype.platformAt = function (x, y, w, rot) {
    var h = w / 8;
    var p = new TextureRenderable(this.kPlatformTexture);
    var xf = p.getXform();

    var g = new GameObject(p);
    var r = new RigidRectangle(xf, w, h);
    g.setRigidBody(r);
    g.toggleDrawRenderable();
    g.toggleDrawRigidShape();

    r.setMass(0);
    xf.setSize(w, h);
    xf.setPosition(x, y);
    xf.setRotationInDegree(rot);
    this.mAllObjs.addToSet(g);
};

MyGame.prototype.movePlayer = function(mouseX, mouseY, multiplier, obj) {
  var velMultiplier = multiplier;
  var rigidShape = obj.getRigidBody();
  var differenceX = mouseX - obj.getXform().getXPos();
  var differenceY = mouseY - obj.getXform().getYPos();
  differenceX *= velMultiplier;
  differenceY *= velMultiplier;
  rigidShape.setVelocity(differenceX, differenceY);
};
