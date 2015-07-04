package com.megatolya.thegame.creatures;

import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.Sprite;
import com.badlogic.gdx.maps.tiled.TiledMap;

import java.util.HashMap;

public class Knight extends Creature {
    private float time = 0;
    private int prevTexture = 0;

    public Knight (TiledMap map) {
        super(getSprites(), map);
    }

    public static HashMap<String, Sprite> getSprites() {
        HashMap<String, Sprite> sprites= new HashMap<String, Sprite>();
        sprites.put("STOP", new Sprite(new Texture("player.png")));
        sprites.put("RUN", new Sprite(new Texture("player2.png")));
        return sprites;
    }

    public void updatePicture(float delta) {
        if (getState().equals("STOP")) {
            return;
        }

        time += delta;
        if (time > 0.5) {
            time = 0;

            this.setTexture(getSprites().get(prevTexture == 0 ? "RUN" : "STOP").getTexture());
            if (prevTexture == 0) {
                prevTexture = 1;
            } else {
                prevTexture = 0;
            }
        }
    }
}
