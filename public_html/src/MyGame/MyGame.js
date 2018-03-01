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
    this.kGrass = "assets/Grass.png";
    this.kBall = "assets/Ball.png";

    // pick an Obstacle Texture that isn't the platform.png
    this.kObstacle = "assets/platform.png";

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
    this.mBG = null;

    // Coordinate Systems
    this.kWCWidth = 200;
    this.kViewportWidth = 1200;
    this.kViewportHeight = 600;
    this.kWCHeight = this.kViewportHeight * (this.kWCWidth / this.kViewportWidth);

}
gEngine.Core.inheritPrototype(MyGame, Scene);


MyGame.prototype.loadScene = function () {

    // Load Textures
    gEngine.Textures.loadTexture(this.kRedCar);
    gEngine.Textures.loadTexture(this.kGreenCar);
    gEngine.Textures.loadTexture(this.kPlatformTexture);
    gEngine.Textures.loadTexture(this.kWallTexture);
    gEngine.Textures.loadTexture(this.kTargetTexture);
    gEngine.Textures.loadTexture(this.kGrass);
    gEngine.Textures.loadTexture(this.kBall);
    gEngine.Textures.loadTexture(this.kObstacle);


};

MyGame.prototype.unloadScene = function () {

    // Unload Textures
    gEngine.Textures.unloadTexture(this.kRedCar);
    gEngine.Textures.unloadTexture(this.kGreenCar);
    gEngine.Textures.unloadTexture(this.kPlatformTexture);
    gEngine.Textures.unloadTexture(this.kWallTexture);
    gEngine.Textures.unloadTexture(this.kTargetTexture);
    gEngine.Textures.unloadTexture(this.kGrass);
    gEngine.Textures.unloadTexture(this.kBall);
    gEngine.Textures.unloadTexture(this.kObstacle);

};

MyGame.prototype.initialize = function () {
    // Main Camera -> still need to decide how large the World coordinates should be
    // and the size of each GameObject in relation to World Coordinates
    this.mCamera = new Camera(
        vec2.fromValues(0, 0), // position of the camera
        this.kWCWidth,                     // width of camera
        [0, 0, this.kViewportWidth, this.kViewportHeight] // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);

    // Hero Car
    this.mHeroCar = new HeroCar(this.kRedCar);
    // Enemy Car
    this.mEnemyCar = new EnemyCar(this.kGreenCar);

    // Ball
    this.mBall = new Ball(this.kBall);

    // Goals
    this.mGoals[0] = new Goal(this.kRedCar, true); // left side of viewport // find a texture for this

    this.mGoals[1] = new Goal(this.kRedCar, false); // right side of viewport // find a texture for this

    // Obstacles
    this.mObstacles = new Obstacles(this.kObstacle, this.kWCWidth, this.kWCHeight); // spriteSheet with Obstacles on it 

    // AllObjs Array for Physics Collisions
    this.mAllObjs = new GameObjectSet();
    this.mAllObjs.addToSet(this.mHeroCar);
    this.mAllObjs.addToSet(this.mEnemyCar);
    this.mAllObjs.addToSet(this.mBall);

    // this.mAllObjs.addToSet(this.mGoals[0]); this lets the Goals get pushed around with Engine.processCollisions
    // this.mAllObjs.addToSet(this.mGoals[1]);

    this.createBounds(); // needs the textures this.kTextureTarget, this.kWallTexture, this.kPlatformTexture

    // Score Reporting Font Renderable
    this.mMsg = new FontRenderable("Score 0 - 0");
    this.mMsg.setColor([0, 0, 0, 1]);
    let textXForm = this.mMsg.getXform();
    this.mMsg.setTextHeight(3);
    textXForm.setPosition(0 - textXForm.getWidth()/2, 45);

    this.mBG = new LevelBackground(this.kGrass);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();

    this.mBG.draw(this.mCamera); // draw Background first so everything else will be displayed over it

    this.mHeroCar.draw(this.mCamera);
    this.mEnemyCar.draw(this.mCamera);

    this.mGoals[0].draw(this.mCamera);
    this.mGoals[1].draw(this.mCamera);

    this.mBall.draw(this.mCamera);

    this.mObstacles.draw(this.mCamera);

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

    let ballXForm = this.mBall.getXform();
    this.movePlayer(ballXForm.getXPos(), ballXForm.getYPos(), this.mAllObjs.getObjectAt(1));

    // Left click to move player
    if (gEngine.Input.isButtonPressed(0)) {
        this.movePlayer(mouseX, mouseY, this.mAllObjs.getObjectAt(0));
    }

    // Press P to test enemy movement
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.E)) {
        this.movePlayer(mouseX, mouseY, this.mAllObjs.getObjectAt(1));
    }

    if (this.mBall.getBBox().intersectsBound(this.mGoals[0].getBBox())) {
        this.mHeroCar.score();
        this.mBall.getXform().setPosition(0, 0);
        this.mBall.getRigidBody().setVelocity(0, 0);
    }

    if (this.mBall.getBBox().intersectsBound(this.mGoals[1].getBBox())) {
        this.mEnemyCar.score();
        this.mBall.getXform().setPosition(0, 0);
        this.mBall.getRigidBody().setVelocity(0, 0);
    }

    // Pixel_Collision for the Obstacles
    this.mObstacles.collide(this.mBall);
    this.mObstacles.collide(this.mHeroCar);
    this.mObstacles.collide(this.mEnemyCar);

    this.mObstacles.update();

    this.mAllObjs.update(this.mCamera); // very important line!! Don't remove this

    // use this physics function for collisions
    gEngine.Physics.processCollision(this.mAllObjs, this.mCollisionInfos);

    // Update Scoring
    var msg = "Score " + this.mHeroCar.getScore() + " - " + this.mEnemyCar.getScore();
    this.mMsg.setText(msg);

};
