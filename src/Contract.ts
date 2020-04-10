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
    CURRENT_PLAYERS: 'currentPlayers'
}

export const PlayerTypes = {
    RED: 'RED',
    BLUE: 'BLUE'
}