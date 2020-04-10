export default class TileMap {
    _map: Phaser.Tilemaps.Tilemap
    _mainLayer: Phaser.Tilemaps.StaticTilemapLayer
    _tileSet: Phaser.Tilemaps.Tileset
    constructor(scene: Phaser.Scene, tileMap: string, tileSet: string, tileSetImage: string, tileMapLayer: string) {
        const map = scene.make.tilemap({ key: tileMap })
        this._tileSet = map.addTilesetImage(tileSet, tileSetImage)
        this._mainLayer = map.createStaticLayer(tileMapLayer, tileSet, 0, 0)
        this._mainLayer.setCollisionByProperty({ 'collision': true })
    }

    get mainLayer() {
        return this._mainLayer
    }
}