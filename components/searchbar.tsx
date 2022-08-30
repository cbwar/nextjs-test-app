import React, {FormEvent, useState} from "react";

type SearchBarProps = {
    onSearch: (query: string) => void,
    query?: string
}

export default function SearchBar(_props: SearchBarProps) {

    // default props
    const props: SearchBarProps = Object.assign({}, {
        onSearch: (query: string) => {
            console.log('onSearch called with query=' + query)
        }
    }, _props)

    const [query, setQuery] = useState(props.query ?? "")

    const onSubmit = (e: FormEvent) => {
        e.preventDefault()
        console.log('submitted ' + query)
        props.onSearch(query)
    }

    return (
        <div className="searchBar">
            <form onSubmit={onSubmit}>
                <input type="text" onInput={(e: FormEvent<HTMLInputElement>) => setQuery(e.currentTarget.value)}
                       value={query}/>
                <button type="submit">Search</button>
            </form>
        </div>
    )
}
