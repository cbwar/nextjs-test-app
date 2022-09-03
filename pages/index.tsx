import type {NextPage} from 'next'
import SearchBar from "../components/searchbar";
import SearchResults from "../components/searchresults";
import {useState} from "react";
import {ParserResult} from "../src/types";
import {scrapperApi} from "../src/api";
import Header from "../components/header";


const Home: NextPage = () => {

    const defaultQuery = "https://"
    const [query, setQuery] = useState(defaultQuery)
    const [results, setResults] = useState([] as ParserResult[])
    const [searchError, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const runSearch = async (_query: string) => {
        setLoading(true)
        window.scrollTo(0, 0);
        setQuery(_query)
        const json = await scrapperApi(_query)
        setResults(json.results ?? [])
        setError(json.message ?? '')
        setLoading(false)
    }

    return (
        <div className="container">
            <Header></Header>
            <div className="main">
                <SearchBar onSearch={runSearch} query={query}></SearchBar>
                {searchError !== '' && <span className="error">{searchError}</span>}
                {searchError === '' &&
                    <SearchResults results={results} onUrlClick={runSearch} loading={loading}></SearchResults>}
            </div>
        </div>
    )
}

export default Home
