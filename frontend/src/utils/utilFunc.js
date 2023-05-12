import { SORTBY } from "./data"

export const sortScoreBoard = (by, arr) => {
    switch (by) {

        case SORTBY.COIN:
            return arr.sort((a, b) => b.coin - a.coin)

        case SORTBY.PERSON:
            return arr.sort((a, b) => b.match_history.wins - a.match_history.wins);

        case SORTBY.COMPUTER:
            return arr.sort((a, b) => b.match_history.playWithComputerWins - a.match_history.playWithComputerWins)

        default: return arr
    }
}