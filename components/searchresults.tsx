import {ParserResult, ResultType} from "../src/types";
import styles from '../styles/Search.module.scss'

type SearchResults = {
    results: ParserResult[],
    onUrlClick: (url: string) => void
}

export default function SearchResults(_props: SearchResults) {

    const images = [..._props.results]
        .filter((item: ParserResult) => {
            return item.type === ResultType.Image
        })
        .map((item: ParserResult, index) => {
            return <div className={styles.result} key={index}>
                <div className={styles.header}>{item.url}</div>
                <div className={styles.body}>
                    <img src={item.url} alt=""/>
                </div>
            </div>
        })

    const links = [..._props.results]
        .filter((item: ParserResult) => {
            return item.type === ResultType.Anchor
        })
        .map((item: ParserResult, index) => {
            return <div>
                <a href="#" onClick={(e) => {
                    e.preventDefault()
                    _props.onUrlClick(item.url)
                }}>{item.url}</a>
            </div>
        })

    return (
        <div className={styles.searchResults}>
            {images.length === 0 && <p>No images</p>}
            {images.length > 0 && images}
            {links.length > 0 &&
                <div className={styles.result} key="links">
                    <div className={styles.header}>Links</div>
                    <div className={styles.body}>
                        {links}
                    </div>
                </div>
            }
        </div>
    )
}
