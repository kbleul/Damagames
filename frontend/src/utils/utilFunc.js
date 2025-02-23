import { SORTBY, CACHED_DATA, ET_MONTHS } from "./data"

export const sortScoreBoard = (by, arr) => {

    if (!arr || arr.length === 0) return []

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
    return arr ? arr.sort((a, b) => b.point - a.point).reverse() : []
}



/*
    userpoint = currentuserpoint
    bages = [] of all badges
    return { badge image || null , color || null} based on user gamepoint
*/
export const assignBadgeToUser = (userPoint, badges) => {

    if (badges) {
        const reversedBadges = sortBadges(badges);

        // Check first badge
        if (badges.length > 1 && userPoint < reversedBadges[0].point) {
            const firstBadge = reversedBadges[0];

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
                const currentBadge = reversedBadges[i + 1];

                return {
                    url: currentBadge.badge_image === "" ? null : currentBadge.badge_image,
                    color: currentBadge.color,
                    id: currentBadge.id,
                    name: currentBadge.name

                };
            }
        }
    }

};


export const cacheApiResponse = (name, response) => {
    localStorage.setItem(name, JSON.stringify(response));
}

export const clearCacheApiData = () => {
    CACHED_DATA.forEach(item => {
        localStorage.getItem(item) && localStorage.removeItem(item);
    })
}


/* takes in date in 25/06/2014 formate
     and returns date in June 25 || SENE 10 format
     TYPE == lang   "ENG" || "AMH"
    */
export const convertDateType = (unformattedDate, lang) => {

    if (lang === "ENG") {
        const newDate = new Date(unformattedDate);

        const options = { month: 'long', day: 'numeric' }

        let formattedDate;

        formattedDate = newDate.toLocaleDateString('en-US', options);

        return formattedDate;
    } else {
        const datesArr = unformattedDate.split("-")
        return ET_MONTHS[datesArr[1]] + " " + datesArr[2]
    }

};


export const convertTimeType = (startingTime, endingTime, type) => {
    const startingArr = startingTime.split(":")
    const endingArr = endingTime.split(":")

    return {
        starting: startingArr[0] + ":" + startingArr[1],
        ending: endingArr[0] + ":" + endingArr[1]
    }
}







