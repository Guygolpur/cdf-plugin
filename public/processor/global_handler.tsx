import { extractword, parseUrl } from './string_handler'

export const extractTime = async () => {
    const queryString = window.location.hash;
    let parsed = await parseUrl(queryString)

    let extractedtime = await extractword(parsed, 'time:(', ')', 1)
    let extractedFrom = await extractword(extractedtime, 'from:', ',', 0)
    extractedFrom = extractedFrom.substring(extractedFrom.indexOf(':') + 1);
    let extractedTo = await extractword(extractedtime, ',', ')', 0)
    extractedTo = extractedTo.substring(extractedTo.indexOf(':') + 1);
    return { from: extractedFrom, to: extractedTo }
}

export const getDashboardGlobalSearch = async (esKuery: any, esQuery: any) => {
    const queryString = window.location.hash;
    let parsed = await parseUrl(queryString)
    parsed = parsed?.substring(parsed?.indexOf('_a=') + 1);
    let extractedSearch = await extractword(parsed, 'query:(', ')', 1)
    let extractedLanguage = await extractword(extractedSearch, 'language:', ',', 0)
    let extractedQuery = await extractword(extractedSearch, ',query:', ')', 0)
    extractedQuery = extractedQuery.replace(/\\"/g, '"');
    var query = extractedQuery.substring(
        extractedQuery.indexOf("'") + 1,
        extractedQuery.lastIndexOf("'")
    );
    if (extractedLanguage.includes('kuery')) {
        let esQueryToString: any
        var dsl: any

        try {
            dsl = esKuery.toElasticsearchQuery(
                esKuery.fromKueryExpression(query),
                // vis.data.indexPattern
            );
        } catch {
            console.log('invalid KQL')
        }
        esQueryToString = JSON.stringify([dsl])

        return esQueryToString
    }
    else if (extractedLanguage.includes('lucene')) {
        let luceneToDSL = esQuery.luceneStringToDsl(query);
        let luceneDSLToString = JSON.stringify([luceneToDSL])
        return luceneDSLToString
    }
    return
}