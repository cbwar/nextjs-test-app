import type {NextPage} from 'next'
import SearchBar from "../components/searchbar";
import SearchResults from "../components/searchresults";
import {useState} from "react";
import {ParserResult} from "../src/types";
import {scrapperApi} from "../src/api";


const Home: NextPage = () => {

    const defaultQuery = "https://"
    const [query, setQuery] = useState(defaultQuery)
    const [results, setResults] = useState([] as ParserResult[])
    const [searchError, setError] = useState("")

    const searchResults = async (query: string) => {
        const json = await scrapperApi(query)
        setResults(json.results ?? [])
        setError(json.message ?? '')
        if (json.success) {
            setQuery(defaultQuery)
        }
    }

    return (
        <div>
            <SearchBar onSearch={searchResults} query={query}></SearchBar>
            {searchError !== '' && <span className="error"><strong>Error</strong>: {searchError}</span>}
            {searchError === '' && <SearchResults results={results}></SearchResults>}
        </div>
    )
}

export default Home
