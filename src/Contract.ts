export interface PlayerInfo {
    id: string;
    team: string;
    x: number;
    y: number;
}

export const IOStates = {
    CONNECTED: 'connected',
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    NEW_PLAYER: 'newPlayer',
    CURRENT_PLAYERS: 'currentPlayers',
    PLAYER_MOVEMENT: 'playerMovement',
    PLAYER_MOVED: 'playerMoved'
}

export const PlayerTypes = {
    RED: 'RED',
    BLUE: 'BLUE'
}