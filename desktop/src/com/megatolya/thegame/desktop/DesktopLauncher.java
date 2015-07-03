package com.megatolya.thegame.desktop;

import com.badlogic.gdx.backends.lwjgl.LwjglApplication;
import com.badlogic.gdx.backends.lwjgl.LwjglApplicationConfiguration;
import com.megatolya.thegame.TheGame;

public class DesktopLauncher {
	public static void main (String[] arg) {
		LwjglApplicationConfiguration config = new LwjglApplicationConfiguration();
        config.title = "LOL";
		config.width = 600;
		config.height = 300;
		new LwjglApplication(new TheGame(), config);
	}
}
