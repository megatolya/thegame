package com.megatolya.thegame.helpers;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Input.Keys;
import com.badlogic.gdx.InputProcessor;
import com.megatolya.thegame.creatures.Creature;

public class InputHandler implements InputProcessor{
    private Creature creature;
    private final String TAG = "InputHandler";

    public InputHandler(Creature p) {
        creature = p;
    }

    @Override
    public boolean keyDown(int keycode) {

        switch (keycode) {
            case Keys.W:
                creature.changeVelocityY(creature.getSpeed());
                break;
            case Keys.A:
                creature.changeVelocityX(-creature.getSpeed());
                break;
            case Keys.S:
                creature.changeVelocityY(-creature.getSpeed());
                break;
            case Keys.D:
                creature.changeVelocityX(creature.getSpeed());
                break;
        }
        return true;
    }

    @Override
    public boolean keyUp(int keycode) {
        Gdx.app.log(TAG, "up keycode = " + keycode);
        switch (keycode) {
            case Keys.W:
                if (!Gdx.input.isKeyPressed(Keys.S)) {
                    creature.resetVelocityY();
                } else {
                    creature.changeVelocityY(-creature.getSpeed());
                }
                break;

            case Keys.S:
                if (!Gdx.input.isKeyPressed(Keys.W)) {
                    creature.resetVelocityY();
                } else {
                    creature.changeVelocityY(creature.getSpeed());
                }
                break;

            case Keys.A:
                if (!Gdx.input.isKeyPressed(Keys.D)) {
                    creature.resetVelocityX();
                } else {
                    creature.changeVelocityX(creature.getSpeed());
                }
                break;

            case Keys.D:
                if (!Gdx.input.isKeyPressed(Keys.A)) {
                    creature.resetVelocityX();
                } else {
                    creature.changeVelocityX(-creature.getSpeed());
                }
                break;
        }
        return true;
    }

    @Override
    public boolean keyTyped(char character) {
        return true;
    }

    @Override
    public boolean touchDown(int screenX, int screenY, int pointer, int button) {
        return false;
    }

    @Override
    public boolean touchUp(int screenX, int screenY, int pointer, int button) {
        return true;
    }

    @Override
    public boolean touchDragged(int screenX, int screenY, int pointer) {
        return true;
    }

    @Override
    public boolean mouseMoved(int screenX, int screenY) {
        return true;
    }

    @Override
    public boolean scrolled(int amount) {
        return true;
    }
}
