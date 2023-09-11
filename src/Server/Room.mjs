export default class Room {
    players = [];
    games = [];
    constructor(id) {
        this.id = id;
    }
    addPlayer(player) {
        this.players.push(player);
    }
    addGame(game) {
        this.games.push(game)
    }
}
