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
    this.kPlatformTexture = "assets/platform.png";
    this.kWallTexture = "assets/wall.png";
    this.kTargetTexture = "assets/target.png";

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
    this.mGoals = [];

    // Obstacles
    this.mObstacles = null;

    // Field Boundaries
    this.mFieldBounds = [];

    // (Spectators)

    /* Cameras */
    // Main camera
    this.mCamera = null;

    // AllObjects Array for Physics Collisions
    this.mAllObjs = null;

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
    gEngine.Textures.loadTexture(this.kPlatformTexture);
    gEngine.Textures.loadTexture(this.kWallTexture);
    gEngine.Textures.loadTexture(this.kTargetTexture);

            
};

MyGame.prototype.unloadScene = function () {

    // Unload Textures
    gEngine.Textures.unloadTexture(this.kRedCar);
    gEngine.Textures.unloadTexture(this.kGreenCar);
    gEngine.Textures.unloadTexture(this.kPlatformTexture);
    gEngine.Textures.unloadTexture(this.kWallTexture);
    gEngine.Textures.unloadTexture(this.kTargetTexture);

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

    // Ball
    this.mBall = new Ball(this.kRedCar); // find a texture for this

    // Goals
    this.mGoals[0] = new Goal(this.kRedCar, true); // left side of viewport // find a texture for this

    this.mGoals[1] = new Goal(this.kRedCar, false); // right side of viewport // find a texture for this

    // AllObjs Array for Physics Collisions
    this.mAllObjs = new GameObjectSet();
    this.mAllObjs.addToSet(this.mHeroCar);
    this.mAllObjs.addToSet(this.mEnemyCar);
    this.mAllObjs.addToSet(this.mBall);
    // this.mAllObjs.addToSet(this.mGoals[0]); this lets the Goals get pushed around with Engine.processCollisions
    // this.mAllObjs.addToSet(this.mGoals[1]);

    this.createBounds(); // needs the textures this.kTextureTarget, this.kWallTexture, this.kPlatformTexture

    // Field Boundaries is just a set of BoundingBox for left, Right, Top, Bottom
    // center, width, height are the same as the Camera WC
    this.mFieldBounds[0] = new BoundingBox([50, 0], 100, 3); // bottom
    this.mFieldBounds[1] = new BoundingBox([50, 80], 100, 3); // top
    this.mFieldBounds[2] = new BoundingBox([100, 40], 3, 80); // right
    this.mFieldBounds[3] = new BoundingBox([0, 40], 3, 80); // left

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
    
    this.mGoals[0].draw(this.mCamera);
    this.mGoals[1].draw(this.mCamera);

    this.mBall.draw(this.mCamera);

    this.mMsg.draw(this.mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        // Use Booster on Space Press
    }
    
    var mouseX = this.mCamera.mouseWCX();
    var mouseY = this.mCamera.mouseWCY();
    if (gEngine.Input.isButtonClicked(0)) {
        // shoot() is in MyGame_Bounds.js
        this.shoot(mouseX, mouseY);
    }

    if (this.mBall.getBBox().intersectsBound(this.mGoals[0].getBBox())) {
        this.mHeroCar.score();
        this.mBall.getXform().setPosition(50, 40);
        this.mBall.getRigidBody().setVelocity(0, 0);
    }

    if (this.mBall.getBBox().intersectsBound(this.mGoals[1].getBBox())) {
        this.mEnemyCar.score();
        this.mBall.getXform().setPosition(50, 40);
        this.mBall.getRigidBody().setVelocity(0, 0);
    }

    for (var i = 0; i < this.mFieldBounds.size; i++) {
        if (this.mBall.getBBox().intersectsBound(this.mFieldBounds[i])) {
            // reverse velocity of Ball to bounce off the wall
            this.mBall.getRigidBody().flipVelocity();
        }
        if (this.mHeroCar.getBBox().intersectsBound(this.mFieldBounds[i])) {
            // set velocity to to 0
            this.mHeroCar.getRigidBody().setVelocity(0, 0);
        }
    }

    // use this physics function for collisions
    gEngine.Physics.processCollision(this.mAllObjs, this.mCollisionInfos);

    this.mAllObjs.update(this.mCamera); // very important line!! Don't  remove this

    // Update Scoring
    var msg = "Score " + this.mHeroCar.getScore() + " - " + this.mEnemyCar.getScore();
    this.mMsg.setText(msg);
    
};