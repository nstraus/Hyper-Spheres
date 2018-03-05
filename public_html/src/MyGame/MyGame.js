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

function MyGame(carColor) {

    this.mCarColor = carColor;

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
    this.mZoomCam = null;
    this.mMinimapCam = null;
    this.kViewType = null;

    // AllObjects Array for Physics Collisions
    this.mAllObjs = null;

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

    this.kMaxScore = 5;

    // Timer
    // FontRenderable that displays how long the match has been running

}
gEngine.Core.inheritPrototype(MyGame, Scene);


MyGame.prototype.loadScene = function (sceneParams) {
    // load the scene file
    // need to create this.kSceneFile; choose between JSON and XML
    // gEngine.TextFileLoader.loadTextFile(this.kSceneFile, gEngine.TextFileLoader.eTextFileType.eTextFile); // if textFile

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
    // unload the Scene File
    // same this.kSceneFile as in loadScene
    // gEngine.TextFileLoader.unloadTextFile(this.kSceneFile);

    // Unload Textures
    gEngine.Textures.unloadTexture(this.kRedCar);
    gEngine.Textures.unloadTexture(this.kGreenCar);
    gEngine.Textures.unloadTexture(this.kPlatformTexture);
    gEngine.Textures.unloadTexture(this.kWallTexture);
    gEngine.Textures.unloadTexture(this.kTargetTexture);
    gEngine.Textures.unloadTexture(this.kGrass);
    gEngine.Textures.unloadTexture(this.kBall);
    gEngine.Textures.unloadTexture(this.kObstacle);

    var nextLevel = new WinLoss(this.mHeroCar.getScore(), this.mEnemyCar.getScore(), this.mHeroCar, this.mEnemyCar); // load next level, pass the score parameters here
    gEngine.Core.startScene(nextLevel);

};

MyGame.prototype.initialize = function () {

    this.mCamera = new Camera(
        vec2.fromValues(0, 0), // position of the camera
        this.kWCWidth,                     // width of camera
        [0, 0, this.kViewportWidth, this.kViewportHeight] // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

    // Zoomed camera with minimap setup
    this.mZoomCam = new Camera(
        vec2.fromValues(0, 0), // position of the camera
        this.kWCWidth / 2,                     // width of camera
        [0, 0, this.kViewportWidth, this.kViewportHeight] // viewport (orgX, orgY, width, height)
    );
    this.mZoomCam.setBackgroundColor([0.8, 0.8, 0.8, 1]);

    this.mMinimapCam = new Camera(
        vec2.fromValues(0, 0), // position of the camera
        this.kWCWidth,                     // width of camera
        [this.kViewportWidth / 3, 0, this.kViewportWidth / 3, this.kViewportHeight / 3] // viewport (orgX, orgY, width, height)
    );
    this.mMinimapCam.setBackgroundColor([1, 0, 1, 0]);

    this.kViewType = false;

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

    let camToRender = this.kViewType ? this.mCamera : this.mZoomCam;

    camToRender.setupViewProjection(1);

    this.mBG.draw(camToRender); // draw Background first so everything else will be displayed over it
    this.mGoals[0].draw(camToRender);
    this.mGoals[1].draw(camToRender);
    this.mObstacles.draw(camToRender);
    this.mAllObjs.draw(camToRender);
    this.mMsg.draw(camToRender);

    if (!this.kViewType) {
      this.mMinimapCam.setupViewProjection(0); // 0 makes it so the canvas is not cleared for the minimap portion
      this.mGoals[0].draw(this.mMinimapCam);
      this.mGoals[1].draw(this.mMinimapCam);
      this.mObstacles.draw(this.mMinimapCam);
      this.mAllObjs.draw(this.mMinimapCam);
    }

};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {

    if (this.mHeroCar.getScore() >= this.kMaxScore) {
        gEngine.GameLoop.stop();
    }

    if (this.mEnemyCar.getScore() >= this.kMaxScore) {
        gEngine.GameLoop.stop();
    }

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.N)) {
        // test code for switching to win/loss scene
        gEngine.GameLoop.stop();
    }

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        // Use Booster on Space Press
    }

    let shownCam = this.kViewType ? this.mCamera : this.mZoomCam;
    var mouseX = shownCam.mouseWCX();
    var mouseY = shownCam.mouseWCY();

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

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.V)) {
        this.kViewType = !this.kViewType;
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
    let center = shownCam.getWCCenter();
    this.mMsg.getXform().setPosition(center[0] - this.mMsg.getXform().getWidth()/2, center[1] + shownCam.getWCHeight() * 2 / 5);


    this.mZoomCam.panTo(this.mHeroCar.getXform().getXPos(), this.mHeroCar.getXform().getYPos());
    this.mZoomCam.update();

};
