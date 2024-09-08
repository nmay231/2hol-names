/**
 * While I would LOVE to split the string of names into a list of names and
 * conduct standard binary search, the original implementation's final
 * tiebreaker is dependent on the last direction traveled, so it's easier to
 * just copy as precisely as possible.
 *
 * And because I don't care about consistency anymore, translated functions use
 * the `function` keyword, while my implementation uses `const` and arrow
 * functions.
 */

/**
 * @param {number} num
 * @returns {number} -1, 0, or 1 depending on sign
 */
function getSign(num) {
    return Math.sign(num);
}

/**
 * @param {string} a
 * @param {string} b
 * @returns {string}
 */
export const sharedPrefix = (a, b) => {
    let i = 0;
    while (i < a.length && i < b.length && a[i] === b[i]) {
        i++;
    }
    return a.substring(0, i);
}

/**
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function sharedPrefixLength(a, b) {
    return sharedPrefix(a, b).length;
}

/**
 * @param {string} inNameList
 * @param {number} inOffset
 * @returns {number}
 */
export function getNameOffsetBack(inNameList, inOffset) {
    while (inOffset > 0 && inNameList[inOffset] != '\n') {
        inOffset--;
    }
    if (inOffset == 0) {
        return 0;
    } else {
        // walked forward off of \n
        return inOffset + 1;
    }
}

/**
 * @param {string} inNameList
 * @param {number} inOffset
 * @returns {number}
 */
export function getNameOffsetForward(inNameList, inOffset) {
    const inListLen = inNameList.length;

    const limit = inListLen - 1;
    while (inOffset < limit && inNameList[inOffset] != '\n') {
        inOffset++;
    }
    if (inOffset == limit) {
        return getNameOffsetBack(inNameList, limit - 1);
    } else {
        // walked forward off of \n
        return inOffset + 1;
    }
}

/**
 * Here, we fake c-strings by returning a substring of the original string, and
 * we treat newlines as string terminators.
 * 
 * @param {string} inNameList
 * @param {number} inOffset
 * @returns {string}
 */
export const subString = (inNameList, inOffset) => {
    const end = inNameList.indexOf('\n', inOffset);
    return inNameList.substring(inOffset, end === -1 ? inNameList.length : end);
}

/**
 * @param {string} a
 * @param {string} b
 * @returns {number} -1, 0, or 1 depending on alphabetical order
 */
const strcmp = (a, b) => {
    return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * @param {string} inString
 * @param {string} inNameList
 * @returns {number}
 */
function findCloseName(inString,
    inNameList,
) {
    const inListLen = inNameList.length;

    const tempString = inString;

    const limit = inListLen;

    let jumpSize = Math.trunc(limit / 2);
    let offset = jumpSize;
    offset = getNameOffsetForward(inNameList, offset);

    let lastDiff = 1;

    let hitStartCount = 0;
    let hitEndCount = 0;

    while (lastDiff != 0) {
        const testString = subString(inNameList, offset);
        const prevDiff = lastDiff;
        lastDiff = strcmp(tempString, testString);

        const lastUsedOffset = offset;

        if (getSign(lastDiff) != getSign(prevDiff)) {
            // overshot
            // smaller jump in opposite direction
            jumpSize = Math.trunc(jumpSize / 2);
        }

        if (jumpSize == 0) {
            break;
        }

        if (lastDiff > 0) {
            // further down
            offset += jumpSize;

            if (offset >= limit) {
                // walked off end
                offset = limit - 2;
                offset = getNameOffsetBack(inNameList, offset);
                hitEndCount++;
                if (hitEndCount > 1) {
                    break;
                }
            } else {
                offset = getNameOffsetForward(inNameList, offset);
                hitEndCount = 0;
                if (offset == lastUsedOffset) {
                    // back to same location as last time?
                    // stuck
                    break;
                }
            }
        } else if (lastDiff < 0) {
            // further up
            offset -= jumpSize;

            if (offset < 0) {
                // walked off start
                offset = 0;
                hitStartCount++;
                if (hitStartCount > 1) {
                    break;
                }
            } else {
                hitStartCount = 0;
                offset = getNameOffsetBack(inNameList, offset);
                if (offset == lastUsedOffset) {
                    // back to same location as last time?
                    // stuck
                    break;
                }
            }
        }
    }

    if (lastDiff != 0 && hitEndCount == 0 && hitStartCount == 0) {
        // no exact match
        // step backward until we find names that are before
        // and after us alphabetically

        let step = 1;
        if (lastDiff < 0) {
            step = -1;
        }
        let nextDiff = lastDiff;
        const lastSign = getSign(lastDiff);
        while (getSign(nextDiff) == lastSign) {
            offset += 2 * step;

            if (offset <= 0) {
                offset = 0;
                break;
            }
            if (offset >= limit) {
                offset = limit - 1;
                break;
            }

            if (step < 0) {
                offset = getNameOffsetBack(inNameList, offset);
            } else {
                offset = getNameOffsetForward(inNameList, offset);
            }

            const testString = subString(inNameList, offset);
            nextDiff = strcmp(tempString, testString);
        }

        if (nextDiff != 0) {
            // string does not exist
            // we've found the two strings alphabetically around it though
            // use one with longest shared prefix

            const crossOffset = offset;
            let prevOffset = offset - 2 * step;

            if (step < 0) {
                prevOffset =
                    getNameOffsetForward(inNameList, prevOffset);
            } else {
                prevOffset =
                    getNameOffsetBack(inNameList, prevOffset);
            }

            const crossSim =
                sharedPrefixLength(tempString, subString(inNameList, crossOffset));
            const prevSim =
                sharedPrefixLength(tempString, subString(inNameList, prevOffset));

            if (crossSim > prevSim) {
                offset = crossOffset;
            } else if (crossSim < prevSim) {
                offset = prevOffset;
            } else {
                // share same prefix
                // return shorter one

                if (subString(inNameList, prevOffset).length <
                    subString(inNameList, crossOffset).length) {
                    offset = prevOffset;
                } else {
                    offset = crossOffset;
                }
            }
        }
    }

    return offset;
}


/**
 * @param {string} nameList
 * @param {string} attemptedName
 * @returns {number} index of closest name
 */
export const findClosestName = (nameList, attemptedName) => {
    return findCloseName(attemptedName, nameList);
}
