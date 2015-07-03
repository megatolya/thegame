package com.megatolya.thegame.creatures;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.graphics.g2d.Sprite;
import com.badlogic.gdx.maps.MapProperties;
import com.badlogic.gdx.maps.tiled.TiledMap;
import com.badlogic.gdx.maps.tiled.TiledMapTileLayer.Cell;
import com.badlogic.gdx.maps.tiled.TiledMapTileLayer;
import com.badlogic.gdx.math.Vector2;

import java.util.HashMap;


public class Creature extends Sprite {
    private Vector2 velocity = new Vector2(0, 0);
    private float speed = 200, increment;
    private TiledMap map;
    private HashMap<String, Sprite>  spritesMap;

    private final String TAG = "Creature";

    public Creature(HashMap<String, Sprite> sprites, TiledMap m) {
        super(sprites.get("STOP"));
        spritesMap = sprites;
        map = m;
    }

    @Override
    public void draw(Batch batch) {
        update(Gdx.graphics.getDeltaTime());
        this.updatePicture(Gdx.graphics.getDeltaTime());
        super.draw(batch);
    }

    public void updatePicture(float delta) {

    }

    public void update(float delta) {
        if (velocity.y > speed) {
            velocity.y = speed;
        }

        if (velocity.x > speed) {
            velocity.x = speed;
        }

        // save old position
        float oldX = getX(), oldY = getY();
        boolean collisionX = false, collisionY = false;

        setX(getX() + velocity.x * delta);

        // calculate the increment for step in #collidesLeft() and #collidesRight()
        TiledMapTileLayer mainLayer = (TiledMapTileLayer) map.getLayers().get(0);
        increment = (int) mainLayer.getTileWidth() / 2;
        log("increment " + increment);
        log("increment " + increment);

        if(velocity.x < 0) // going left
            collisionX = collidesLeft();
        else if(velocity.x > 0) // going right
            collisionX = collidesRight();

        // react to x collision
        if(collisionX) {
            log("collisionX ");
            setX(oldX);
        }


        setY(getY() + velocity.y * delta);

        increment = mainLayer.getTileHeight();
        increment = 1;

        if(velocity.y < 0) // going down
            collisionY = collidesBottom();
        else if(velocity.y > 0) // going up
            collisionY = collidesTop();

        // react to y collision
        if(collisionY) {
            log("collisionY ");
            setY(oldY);
        }

    }

    public float getSpeed() {
        return speed;
    }

    public void changeVelocityX(float x) {
        velocity.x = x;
    }

    public void changeVelocityY(float y) {
        velocity.y = y;
    }

    public void resetVelocityY() {
        velocity.y = 0;
    }

    public void resetVelocityX() {
        velocity.x = 0;
    }

    public Vector2 getTiledPositon() {
        MapProperties prop = map.getProperties();

        int mapHeight = prop.get("height", Integer.class);
        int tilePixelWidth = prop.get("tilewidth", Integer.class);
        int tilePixelHeight = prop.get("tileheight", Integer.class);
        int mapPixelHeight = mapHeight * tilePixelHeight;

        // TODO position class
        return new Vector2((int) getX() / tilePixelWidth, (mapPixelHeight - (int) getY()) / tilePixelHeight);
    }

    public boolean collidesRight() {
        for(float step = 0; step <= getHeight(); step += increment)
            if(isCellBlocked(getX() + getWidth(), getY() + step) || isNotCell(getX() + getWidth(), getY() + step))
                return true;
        return false;
    }

    public boolean collidesLeft() {
        for(float step = 0; step <= getHeight(); step += increment)
            if(isCellBlocked(getX(), getY() + step) || isNotCell(getX() - getWidth() / 2, getY() + step))
                return true;
        return false;
    }

    public boolean collidesTop() {
        for(float step = 0; step <= getWidth(); step += increment)
            if(isCellBlocked(getX() + step, getY() + getHeight()) || isNotCell(getX() + step, getY() + getHeight()))
                return true;
        return false;

    }

    public String getState() {
        return (velocity.x != 0 || velocity.y != 0) ? "RUN" : "STOP";
    }

    public boolean collidesBottom() {
        for(float step = 0; step <= getWidth(); step += increment)
            if(isCellBlocked(getX() + step, getY()) || isNotCell(getX() + step, getY() - getHeight() / 2))
                return true;
        return false;
    }

    private boolean isCellBlocked(float x, float y) {
        TiledMapTileLayer layer = (TiledMapTileLayer) map.getLayers().get("background");
        Cell cell = layer.getCell((int) (x / layer.getTileWidth()), (int) (y / layer.getTileHeight()));
        return cell != null && cell.getTile() != null && cell.getTile().getProperties().containsKey("blocked");
    }

    private boolean isNotCell(float x, float y) {
        TiledMapTileLayer layer = (TiledMapTileLayer) map.getLayers().get("background");
        Cell cell = layer.getCell((int) (x / layer.getTileWidth()), (int) (y / layer.getTileHeight()));
        return cell == null;
    }


    private void log(String msg) {
        boolean SHOW_LOG = false;
        if (SHOW_LOG) {
            Gdx.app.log(TAG, msg);
        }
    }
}
