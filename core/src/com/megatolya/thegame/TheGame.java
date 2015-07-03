package com.megatolya.thegame;

import com.badlogic.gdx.Game;
import com.megatolya.thegame.screens.WorldScreen;

public class TheGame extends Game {

	@Override
	public void create () {
        setScreen(new WorldScreen());
	}
}
