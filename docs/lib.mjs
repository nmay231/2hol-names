export const sharedPrefix = (a, b) => {
    let i = 0;
    while (i < a.length && i < b.length && a[i] === b[i]) {
        i++;
    }
    return a.substring(0, i);
}

export const findClosestName = (nameList, attemptedName) => {
    if (attemptedName < nameList[0]) {
        return 0;
    } else if (attemptedName > nameList[nameList.length - 1]) {
        return nameList.length - 1
    } else {
        let min = 0;
        let max = nameList.length - 1;
        let mid = Math.trunc((min + max) / 2);

        while (min < max) {
            let possibleMatch = nameList[mid];
            if (attemptedName === possibleMatch) {
                return mid;
            } else if (attemptedName < possibleMatch) {
                max = Math.max(mid - 1, min);
            } else if (attemptedName > possibleMatch) {
                min = Math.min(mid + 1, max);
            }
            mid = Math.trunc((min + max) / 2);
        }

        const closest = nameList.slice(mid, mid + 2);

        if (closest.length !== 2) {
            throw new Error("Expected two closest names");
        }
        const [before, after] = closest;
        const sharedBefore = sharedPrefix(before, attemptedName);
        const sharedAfter = sharedPrefix(after, attemptedName);
        if (sharedBefore.length > sharedAfter.length) {
            return mid;
        } else if (sharedBefore.length < sharedAfter.length) {
            return mid + 1;
        } else {
            return before.length < after.length ? mid : mid + 1;
        }
    }
}
