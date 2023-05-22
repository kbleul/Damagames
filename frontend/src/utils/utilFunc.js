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


/*
    userpoint = currentuserpoint
    bages = [] of all badges
    return correct badge image based on userpoint
*/
export const assignBadgeToUser = (userPoint, badges) => {
    //console.log(userPoint, badges)
    //check first badge
    if (userPoint < badges[1].point) {
        //console.log("yes")
        return badges[0].badge_image
    }

    //check last badge
    if (userPoint >= badges[badges.length - 1].point) {
        // console.log("no")
        return badges[badges.length - 1].badge_image
    }

    //check the rest
    for (let i = 1; i < badges.length; i++) {
        if (userPoint >= badges[i].point && userPoint < badges[i + 1].point) {
            // console.log("dd", badges[i].badge_image)

            return badges[i].badge_image
        }
    }
}
