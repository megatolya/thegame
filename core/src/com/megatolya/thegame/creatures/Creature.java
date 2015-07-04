package com.megatolya.thegame.creatures;

import java.util.HashMap;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.graphics.g2d.Sprite;
import com.badlogic.gdx.maps.MapProperties;
import com.badlogic.gdx.maps.tiled.TiledMap;
import com.badlogic.gdx.maps.tiled.TiledMapTileLayer;
import com.badlogic.gdx.maps.tiled.TiledMapTileLayer.Cell;
import com.badlogic.gdx.math.Vector2;


public class Creature extends Sprite {
    private Vector2 velocity = new Vector2(0, 0);
    private float speed = 200, increment;
    private TiledMap map;
    private HashMap<String, Sprite>  spritesMap;

    private final String TAG = "Creature";

    public final Direction direction = new Direction();

    public static class Direction {
        private boolean downPressed = false;
        private boolean upPressed = false;
        private boolean leftPressed = false;
        private boolean rightPressed = false;

        public void setDownPressed(boolean downPressed) {
            this.downPressed = downPressed;
        }

        public void setUpPressed(boolean upPressed) {
            this.upPressed = upPressed;
        }

        public void setLeftPressed(boolean leftPressed) {
            this.leftPressed = leftPressed;
        }

        public void setRightPressed(boolean rightPressed) {
            this.rightPressed = rightPressed;
        }

        public Vector2 result() {
            double y = 0;
            double x = 0;

            if (downPressed) {
                y -= 1;
            }

            if (upPressed) {
                y += 1;
            }

            if (leftPressed) {
                x -= 1;
            }

            if (rightPressed) {
                x += 1;
            }

            double norm = Math.sqrt(x * x + y * y);

            if (Math.abs(norm) > 1e-5) {
                x /= norm;
                y /= norm;
            }

            return new Vector2((float) x, (float) y);
        }
    }

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

        Vector2 directionPressed = direction.result();

        float rate = 0.3f;

        velocity.y = (velocity.y + rate * speed * directionPressed.y) / (1 + rate);
        velocity.x = (velocity.x + rate * speed * directionPressed.x) / (1 + rate);

        System.out.println(velocity.y);

        // save old position
        float oldX = getX(), oldY = getY();
        boolean collisionX = false, collisionY = false;

        setX(getX() + velocity.x * delta);

        // calculate the increment for step in #collidesLeft() and #collidesRight()
        TiledMapTileLayer mainLayer = (TiledMapTileLayer) map.getLayers().get(0);
        increment = (int) mainLayer.getTileWidth() / 2;

        if(velocity.x < 0) // going left
            collisionX = collidesLeft();
        else if(velocity.x > 0) // going right
            collisionX = collidesRight();

        // react to x collision
        if(collisionX) {
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
        return ((int) velocity.x != 0 || (int) velocity.y != 0) ? "RUN" : "STOP";
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
}
