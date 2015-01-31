# Спецификация
## Транспорт
### События сокетов

#### Backend -> Frontend (socket)
##### game
`game.realm.new`

Параметры:
```javascript
{
    map: mapData,
    camera: coords
}
```

##### player
`player:movement:start`

Параметры:
```javascript
{
    x: number,
    y: number
}
```

#### Frontend -> Backend (socket)
##### game
`game.ready`

#### Frontend -> Frontend (dom)
##### game
`game.canvas.ready`
