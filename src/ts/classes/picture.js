var Game;
(function (Game) {
    (function (Direction) {
        Direction[Direction["left"] = 0] = "left";
        Direction[Direction["right"] = 1] = "right";
        Direction[Direction["up"] = 2] = "up";
        Direction[Direction["down"] = 3] = "down";
        Direction[Direction["all"] = 4] = "all";
    })(Game.Direction || (Game.Direction = {}));
    var Direction = Game.Direction;

    var Picture = (function () {
        function Picture(src, direction) {
            if (typeof direction === "undefined") { direction = 4 /* all */; }
            this.isReady = false;
            var img = new Image();
            img.src = src;
            var self = this;
            img.onload = function () {
                return self.isReady = true;
            };
            this.source = img;
            this.direction = direction;
        }
        return Picture;
    })();
    Game.Picture = Picture;
})(Game || (Game = {}));
//# sourceMappingURL=picture.js.map
