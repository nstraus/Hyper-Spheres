/*
* WinLoss.js
* 
*/

"use strict";

function WinLoss(heroScore, enemyScore) {

	this.kHeroScore = heroScore;
	this.kEnemyScore = enemyScore;

	this.mLevelBackground = null;

	this.kBackground = "assets/SkyGrass.png";
	this.kPlayAgain = "assets/ButtonRedPurp.png";

	this.mPodium = null;

	this.mWinnerCar = null;

	this.mLoserCar = null;

	this.mConfetti = null; // particle system optional

	this.mResultText = null; // display winner, loser depending on results

	this.mScoreText = null; // display final score, and total time the match ran for

	this.mPlayAgain = null; // playAgain button

	this.mSpectators = null; // use the same SpriteAnimation from the cheering spectators in the stands, just zoomed more

	this.mCamera = null;

	// Coordinate Systems (Copied from MyGame for simplicity, can change this)
    this.kWCWidth = 200;
    this.kViewportWidth = 1200;
    this.kViewportHeight = 600;
    this.kWCHeight = this.kViewportHeight * (this.kWCWidth / this.kViewportWidth);

    // Play credits as a FontRenderable that moves from the top to bottom of the screen

}
gEngine.Core.inheritPrototype(WinLoss, Scene);

WinLoss.prototype.loadScene = function(sceneParams) {
	// load the Scene file

	// need to create the this.kSceneFile; choose between JSON and XML
	// gEngine.TextFileLoader.LoadTextFile(this.kSceneFile, gEngine.TextFileLoader.eTextFileType.eTextFile); // if XML

	// load Textures
	gEngine.Textures.loadTexture(this.kBackground);
	gEngine.Textures.loadTexture(this.kPlayAgain);
};

WinLoss.prototype.unloadScene = function() {
	// unload the Scene file
	// same this.kSceneFile as in loadScene

	// unload Textures
	gEngine.Textures.unloadTexture(this.kBackground);
	gEngine.Textures.unloadTexture(this.kPlayAgain);

	var nextLevel = new Splash(); // load NextLevel, could pass HighScore as a param for this session
	gEngine.Core.startScene(nextLevel);

};

WinLoss.prototype.initialize = function() {
	this.mLevelBackground = new LevelBackground(this.kBackground);

	this.mCamera = new Camera( // camera setup copied from MyGame.js for simplicity, can change this
		[0, 0],		// position of the camera
		this.kWCWidth,		// width of camera
		[0, 0, this.kViewportWidth, this.kViewportHeight] 	// viewport (orgX, orgY, width, height)
	);

	this.mPlayAgain = new PlayAgain(this.kPlayAgain);

	if (this.kHeroScore > this.kEnemyScore) {
		this.mResultText = new FontRenderable("You Won!");
		// put Hero at top of podium
		// put enemy at bottom of podium
		// confetti?
	} else {
		this.mResultText = new FontRenderable("You Lose ...");
		// put Hero at bottom of podium
		// put Enemy at top of podium
	}
	this.mResultText.setColor([0, 0, 0, 1]);
	this.mResultText.getXform().setPosition(-40, 40);
	this.mResultText.setTextHeight(7);

	// display Final Score Text
	this.mScoreText = new FontRenderable("Final Score: You (" + this.kHeroScore + ") vs. Opponent (" + this.kEnemyScore + ")");
	this.mScoreText.setColor([0, 0, 0, 1]);
	this.mScoreText.getXform().setPosition(-70, 30);
	this.mScoreText.setTextHeight(7);

};

WinLoss.prototype.update = function() {

	if (gEngine.Input.isKeyPressed(gEngine.Input.keys.N)) {
		// test code for switching scenes
		gEngine.GameLoop.stop();
	}

	var mousePos = [this.mCamera.mouseWCX(), this.mCamera.mouseWCY()];

	this.mPlayAgain.update(mousePos);
};

WinLoss.prototype.draw = function() {

	this.mCamera.setupViewProjection(); // activate drawing camera

	this.mLevelBackground.draw(this.mCamera);

	this.mPlayAgain.draw(this.mCamera);

	this.mScoreText.draw(this.mCamera);

	this.mResultText.draw(this.mCamera);
};