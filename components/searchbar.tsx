import React, {FormEvent, useEffect, useState} from "react";
import styles from '../styles/Search.module.scss'

type SearchBarProps = {
    onSearch: (query: string) => void,
    query?: string
}

export default function SearchBar(props: SearchBarProps) {

    const [query, setQuery] = useState("")

    useEffect(() => {
        setQuery(props.query ?? "")
        console.log('component updated ' + props.query)
    }, [props.query]);

    const onSubmit = (e: FormEvent) => {
        e.preventDefault()
        console.log('submitted ' + query)
        props.onSearch(query)
    }

    return (
        <div className={styles.searchBar}>
            <form onSubmit={onSubmit}>
                <input type="text" onInput={(e: FormEvent<HTMLInputElement>) => setQuery(e.currentTarget.value)}
                       value={query}/>
                <button type="submit">Search</button>
            </form>
        </div>
    )
}
