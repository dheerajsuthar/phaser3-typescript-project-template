export interface PlayerInfo {
    id: string;
    team: string;
    x: number;
    y: number;
    rotation: number;
}

export interface BulletInfo {
    x: number,
    y: number,
    id: string,
    team: string,
    speedX: number,
    speedY: number
}

export const IOStates = {
    CONNECTED: 'connected',
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    NEW_PLAYER: 'newPlayer',
    CURRENT_PLAYERS: 'currentPlayers',
    PLAYER_MOVEMENT: 'playerMovement',
    PLAYER_MOVED: 'playerMoved',
    PLAYER_FIRED_BULLET: 'playerFiredBullet',
    BULLETS_UPDATE: 'bulletUpdate'
}

export const PlayerTypes = {
    RED: 'RED',
    BLUE: 'BLUE'
}