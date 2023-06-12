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


export const sortBadges = (arr) => {
    return arr.sort((a, b) => b.point - a.point).reverse()
}



/*
    userpoint = currentuserpoint
    bages = [] of all badges
    return { badge image || null , color || null} based on user gamepoint
*/
export const assignBadgeToUser = (userPoint, badges) => {
    const reversedBadges = sortBadges(badges);
    console.log(userPoint, userPoint < reversedBadges[0].point, userPoint, reversedBadges[0].point);

    // Check first badge
    if (badges.length > 1 && userPoint < reversedBadges[0].point) {
        const firstBadge = reversedBadges[0];
        console.log("reversedBadges");

        return {
            url: firstBadge.badge_image === "" ? null : firstBadge.badge_image,
            color: firstBadge.color,
            id: firstBadge.id,
            name: firstBadge.name
        };
    }

    // Check last badge
    const lastBadge = badges[badges.length - 1];
    if (userPoint >= lastBadge.point) {
        return {
            url: lastBadge.badge_image === "" ? null : lastBadge.badge_image,
            color: lastBadge.color,
            id: lastBadge.id,
            name: lastBadge.name,
        };

    }

    // Check the rest
    for (let i = 0; i <= reversedBadges.length - 1; i++) {
        if (userPoint >= reversedBadges[i].point && userPoint < reversedBadges[i + 1].point) {
            const currentBadge = reversedBadges[i];

            return {
                url: currentBadge.badge_image === "" ? null : currentBadge.badge_image,
                color: currentBadge.color,
                id: currentBadge.id,
                name: currentBadge.name

            };
        }
    }
};








