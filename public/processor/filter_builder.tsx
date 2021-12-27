export const filterListener = async (vis: any) => {
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
