/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {

    /* Textures */
    // find better car art
    // make the cars into a sprite sheet
    // this art is probably fine for the demo on Monday
    this.kRedCar = "assets/RedCar.png";
    this.kGreenCar = "assets/GreenCar.png";

    /* GameObjects */
    // HeroCar
    this.mHeroCar = null;

    // EnemyCar
    this.mEnemyCar = null;

    // Boosters on the field
    this.mBoosters = null;

    // Ball
    this.mBall = null;

    // Goal
    this.mGoals = null;

    // Obstacles
    this.mObstacles = null;

    // (Spectators)

    /* Cameras */
    // Main camera
    this.mCamera = null;

    // Field Minimap camera


    /* UI Components and FontRenderables */
    // Score
    this.mMsg = null;

    // Background (Field + Stands?)

}
gEngine.Core.inheritPrototype(MyGame, Scene);


MyGame.prototype.loadScene = function () {

    // Load Textures
    gEngine.Textures.loadTexture(this.kRedCar);
    gEngine.Textures.loadTexture(this.kGreenCar);

            
};

MyGame.prototype.unloadScene = function () {

    // Unload Textures
    gEngine.Textures.unloadTexture(this.kRedCar);
    gEngine.Textures.unloadTexture(this.kGreenCar);

};

MyGame.prototype.initialize = function () {
    // Main Camera -> still need to decide how large the World coordinates should be
    // and the size of each GameObject in relation to World Coordinates
    this.mCamera = new Camera(
        vec2.fromValues(50, 40), // position of the camera
        100,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
    
    // Hero Car
    this.mHeroCar = new HeroCar(this.kRedCar);
    // Enemy Car
    this.mEnemyCar = new EnemyCar(this.kGreenCar);

    // Score Reporting Font Renderable
    this.mMsg = new FontRenderable("Score 0 - 0");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(5, 7);
    this.mMsg.setTextHeight(3);

};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    
    this.mHeroCar.draw(this.mCamera);
    this.mEnemyCar.draw(this.mCamera);
    
    this.mMsg.draw(this.mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        // Use Booster on Space Press
    }
    
    // use this physics function for collisions
    // gEngine.Physics.processCollision(this.mAllObjs, this.mCollisionInfos);

    // Update Scoring
    var msg = "Score " + this.mHeroCar.getScore() + " - " + this.mEnemyCar.getScore();
    this.mMsg.setText(msg);
    
};