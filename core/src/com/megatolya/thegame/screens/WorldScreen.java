package com.megatolya.thegame.screens;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Screen;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.OrthographicCamera;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.maps.tiled.TiledMap;
import com.badlogic.gdx.maps.tiled.TiledMapTile;
import com.badlogic.gdx.maps.tiled.TiledMapTileLayer;
import com.badlogic.gdx.maps.tiled.TmxMapLoader;
import com.badlogic.gdx.maps.tiled.renderers.OrthogonalTiledMapRenderer;
import com.badlogic.gdx.maps.tiled.tiles.AnimatedTiledMapTile;
import com.badlogic.gdx.maps.tiled.tiles.StaticTiledMapTile;
import com.badlogic.gdx.utils.Array;
import com.megatolya.thegame.creatures.Creature;
import com.megatolya.thegame.creatures.Knight;
import com.megatolya.thegame.helpers.InputHandler;

import java.util.Iterator;

public class WorldScreen implements Screen {
    private OrthogonalTiledMapRenderer renderer;
    private OrthographicCamera camera;
    private TiledMap map;
    private InputHandler handler;

    private Creature creature;

    @Override
    public void show() {
        map = new TmxMapLoader().load("map.tmx");
        renderer = new OrthogonalTiledMapRenderer(map);
        camera = new OrthographicCamera();
        creature = new Knight(map);
        creature.setX(10);
        creature.setY(10);
        handler = new InputHandler(creature);
        font = new BitmapFont();
        font.setColor(Color.RED);
        Gdx.input.setInputProcessor(handler);

        creature.setX(0);
        creature.setY(0);

        Array<StaticTiledMapTile> frameTiles = new Array<StaticTiledMapTile>(2);

        Iterator<TiledMapTile> tiles = map.getTileSets().getTileSet("tileset").iterator();

        while (tiles.hasNext()) {
            TiledMapTile tile = tiles.next();

            if (tile.getProperties().containsKey("animation") && tile.getProperties().get("animation", String.class).equals("flower")) {
                frameTiles.add((StaticTiledMapTile) tile);
            }
        }

        AnimatedTiledMapTile animatedTile = new AnimatedTiledMapTile(1 / 3f, frameTiles);

        // background layer
        TiledMapTileLayer layer = (TiledMapTileLayer) map.getLayers().get("background");

        for (int x = 0; x < layer.getWidth(); x++) {
            for (int y = 0; y < layer.getHeight(); y++) {
                TiledMapTileLayer.Cell cell = layer.getCell(x, y);

                if (cell.getTile().getProperties().containsKey("animation") && cell.getTile().getProperties().get("animation", String.class).equals("flower")) {
                    animatedTile.getProperties().putAll(animatedTile.getProperties());
                    cell.setTile(animatedTile);
                }
            }
        }
    }

    private int[] background =  new int[]{0}, foreground = new int[] {1};
    private BitmapFont font;

    @Override
    public void render(float delta) {

        Gdx.graphics.getGL20().glClearColor(0, 0, 0, 1);
        Gdx.graphics.getGL20().glClear(GL20.GL_COLOR_BUFFER_BIT | GL20.GL_DEPTH_BUFFER_BIT);

        camera.position.set(creature.getX() + creature.getWidth() / 2, creature.getY() + creature.getHeight() / 2, 0);
        camera.update();

        renderer.setView(camera);
        renderer.render(background);


        renderer.getBatch().begin();


        creature.draw(renderer.getBatch());


        renderer.getBatch().end();
        renderer.render(foreground);
        renderer.getBatch().begin();

        String info = "X: " + creature.getTiledPositon().x + "     Y:" + creature.getTiledPositon().y;
        font.draw(renderer.getBatch(), info, camera.position.x - camera.viewportWidth / 2 + 20, camera.position.y + camera.viewportHeight / 2);
        renderer.getBatch().end();
    }


    @Override
    public void resize(int width, int height) {
        camera.viewportWidth= width / 1.5f;
        camera.viewportHeight = height / 1.5f;
    }



    @Override
    public void pause() {

    }

    @Override
    public void resume() {

    }

    @Override
    public void hide() {

    }

    @Override
    public void dispose() {
        renderer.dispose();
    }
}
