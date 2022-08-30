import {ParserResult} from "../src/types";

type SearchResults = {
    results: ParserResult[]
}

export default function SearchResults(_props: SearchResults) {

    const results = [..._props.results].map((item: ParserResult) => {
        return <div className="result">
            <span>Url = {item.url}</span>
            <span>Type = {item.type}</span>
        </div>
    })

    return (
        <div className="searchResults">
            {results.length === 0 && <p>No results</p>}
            {results.length > 0 && results}
        </div>
    )
}
