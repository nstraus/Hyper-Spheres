"use strict";

function Spectator(spriteTexture, standsPos) {
    this.mSpectator = new TextureRenderable(spriteTexture);
    this.mSpectator.setColor([1, 1, 1, 0]);
    this.mSpectator.getXform().setPosition(standsPos[0] + Math.random() * 150 - 75, standsPos[1] + Math.random() * 20 - 10);
    this.mSpectator.getXform().setSize(5, 5);
    GameObject.call(this, this.mSpectator);

}
gEngine.Core.inheritPrototype(Spectator, GameObject);
