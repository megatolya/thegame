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
        setDirection(keycode, true);
        return true;
    }

    private void setDirection(int keycode, boolean ifPressed) {
        switch (keycode) {
            case Keys.W:
                creature.direction.setUpPressed(ifPressed);
                break;
            case Keys.A:
                creature.direction.setLeftPressed(ifPressed);
                break;
            case Keys.S:
                creature.direction.setDownPressed(ifPressed);
                break;
            case Keys.D:
                creature.direction.setRightPressed(ifPressed);
                break;
        }
    }

    @Override
    public boolean keyUp(int keycode) {
        Gdx.app.log(TAG, "up keycode = " + keycode);
        setDirection(keycode, false);
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
