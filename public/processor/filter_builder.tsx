import { extractword, extractBetweenParentheses, objectBuilder, mulObjectBuilder } from './string_handler'

// listening to any local visualization changes and building a DSL filter
export const filterListener = async (vis: any) => {
    if (typeof vis === 'object' && vis !== null) {
        let filters = vis.type.visConfig.data.query.filterManager.getFilters()
        if (filters.length > 0) {
            let filterTojson: any = [];
            let negativeFilters: any = [];
            let rangeFilters: any = [{ 'match_all': {} }];
            Object.values(await filters).forEach((key: any, val: any) => {
                if (!key.meta.disabled) {
                    if (key.hasOwnProperty('exists')) {
                        let existsObj = {
                            exists: key.exists
                        }
                        if (key.meta.negate === false) {
                            {
                                filterTojson.push(existsObj);
                            }
                        }
                        else {
                            negativeFilters.push(existsObj)
                        }
                    }
                    else if (key.hasOwnProperty('query')) {
                        if (key.query.hasOwnProperty('match_phrase') || key.query.hasOwnProperty('bool')) {
                            let queryObj
                            if (key.query.hasOwnProperty('bool')) {
                                queryObj = {
                                    bool: key.query.bool
                                }
                            }
                            else { queryObj = key.query }
                            if (key.meta.negate === false) { filterTojson.push(queryObj); }
                            else {
                                if (key.query.hasOwnProperty('bool')) {
                                    queryObj = {
                                        bool: key.query.bool
                                    }
                                }
                                else {
                                    queryObj = {
                                        match_phrase: key.query.match_phrase
                                    }
                                }
                                negativeFilters.push(queryObj)
                            }
                        }
                    }
                    else if (key.hasOwnProperty('range')) {
                        let rangeObj = {
                            range: key.range
                        }
                        if (key.meta.negate === false) { rangeFilters.push(rangeObj); }
                        else {
                            negativeFilters.push(rangeObj)
                        }
                    }
                }
            })
            let rangeFilterToString = JSON.stringify(rangeFilters)
            let filterToString = JSON.stringify(filterTojson)
            let negativeFilterToString = JSON.stringify(negativeFilters)

            return [
                vis.type.visConfig.data.query.timefilter.timefilter._time.from,
                vis.type.visConfig.data.query.timefilter.timefilter._time.to,
                rangeFilterToString,
                negativeFilterToString,
                filterToString
            ]
        }
        else {
            return [
                vis.type.visConfig.data.query.timefilter.timefilter._time.from,
                vis.type.visConfig.data.query.timefilter.timefilter._time.to,
                '[]',
                '[]',
                '[{"match_all": {}}]'
            ]
        }
    }
    // listening to any global visualization changes and building a DSL filter
    else {
        if (vis.length > 0) {
            let visToString = JSON.stringify(vis)
            let localPart = visToString.substring(0, visToString.indexOf(",fullScreenMode:"))
            const filtersObj = localPart.split("'$state':");

            let filterTojson: any = [];
            let negativeFilters: any = [];
            let rangeFilters: any = [{ 'match_all': {} }];

            filtersObj.forEach(filter => {
                if (filter.includes("disabled:!f")) {
                    if (filter.includes('type:exists')) {
                        let existsObj = extractword(filter, "exists:(field:'", "),", 1)
                        let field = extractBetweenParentheses(existsObj)
                        if (field) {
                            let fieldObj = objectBuilder(field[1])
                            let existsObj = {
                                exists: fieldObj
                            }
                            if (filter.includes("negate:!f")) {
                                {
                                    filterTojson.push(existsObj);
                                }
                            }
                            else {
                                negativeFilters.push(existsObj)
                            }
                        }
                    }
                    else if (filter.includes('query')) {
                        let extractedQuery = extractword(filter, "query:(", ")))", 3)
                        if (extractedQuery.includes('match_phrase') || extractedQuery.includes('bool')) {
                            let queryObj: any = {}
                            let extractedMinShouldMatch = extractword(extractedQuery, "minimum_should_match", ",", 0)
                            let minShouldMatchObj = objectBuilder(extractedMinShouldMatch)
                            let extractShould = extractword(extractedQuery, "should:!", ')))', 3)
                            if (extractedQuery.includes('bool')) {
                                let parsedArr = mulObjectBuilder(extractShould, 'match_phrase', 'match_phrase')
                                let boolObj: any = {}
                                boolObj['minimum_should_match'] = Object.values(minShouldMatchObj)[0]
                                boolObj['should'] = parsedArr
                                queryObj = {
                                    bool: boolObj
                                }
                            }
                            else {
                                let matchObj = extractword(extractedQuery, "match_phrase:(", ")", 1)
                                let closeParenthesesCounter = (matchObj.match(/[)]/g) || []).length;
                                let openParenthesesCounter = (matchObj.match(/[(]/g) || []).length;
                                if (openParenthesesCounter > closeParenthesesCounter) {
                                    matchObj = matchObj + ")"
                                }
                                matchObj = extractBetweenParentheses(matchObj)
                                let parsedObj = objectBuilder(matchObj[1])
                                queryObj['match_phrase'] = parsedObj
                            }
                            if (filter.includes("negate:!f")) { filterTojson.push(queryObj); }
                            else {
                                if (extractedQuery.includes('bool')) {
                                    let parsedArr = mulObjectBuilder(extractShould, 'match_phrase', 'match_phrase')
                                    let boolObj: any = {}
                                    boolObj['minimum_should_match'] = Object.values(minShouldMatchObj)[0]
                                    boolObj['should'] = parsedArr
                                    queryObj = {
                                        bool: boolObj
                                    }
                                }
                                else {
                                    let matchObj = extractword(extractedQuery, "match_phrase:(", ")", 1)
                                    matchObj = extractBetweenParentheses(matchObj)
                                    let parsedObj = objectBuilder(matchObj[1])
                                    queryObj['match_phrase'] = parsedObj
                                }
                                negativeFilters.push(queryObj)
                            }
                        }
                    }
                    else if (filter.includes('range')) {
                        let extractedQuery = extractword(filter, "range:(", "))", 2)
                        let rangeExtractedObj: any = extractBetweenParentheses(extractedQuery)
                        if (rangeExtractedObj) {
                            let key = Object.keys(objectBuilder(rangeExtractedObj[1]))[0]
                            let startWithValue = rangeExtractedObj[0].substring(1)
                            let extractedRange = mulObjectBuilder(startWithValue, 'range', key)
                            let value = Object.values(extractedRange[0])
                            let res = convertStringToObject(value[0])
                            let innerObj: any = {}
                            innerObj[key] = res

                            let rangeObj = {
                                range: innerObj
                            }

                            if (filter.includes("negate:!f")) { rangeFilters.push(rangeObj); }
                            else {
                                negativeFilters.push(rangeObj)
                            }
                        }

                    }
                }
            })
            let rangeFilterToString = JSON.stringify(rangeFilters)
            let filterToString = JSON.stringify(filterTojson)
            let negativeFilterToString = JSON.stringify(negativeFilters)

            return [
                rangeFilterToString,
                negativeFilterToString,
                filterToString
            ]
        }
        else {
            return [
                '[]',
                '[]',
                '[{"match_all": {}}]'
            ]
        }
    }
}

function convertStringToObject(string: any) {
    const responseObject: any = {};
    const keysAndValues = string.split(",");
    for (let keyAndValue of keysAndValues) {
        const splittedKeyAndValue = keyAndValue.split(":");
        const key = splittedKeyAndValue[0];
        const value = splittedKeyAndValue[1];
        if (isNumeric(value)) {
            if (value.indexOf(".") !== -1) {
                responseObject[key] = parseFloat(value);
            } else {
                responseObject[key] = parseInt(value);
            }
        } else {
            responseObject[key] = value;
        }
    }
    return responseObject;
}

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) &&
        !isNaN(parseFloat(str))
}