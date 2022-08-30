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
            return <div className={styles.result} key={`image_${index}`}>
                <div className={styles.header}>{item.url}</div>
                <div className={styles.body}>
                    <img src={item.url} alt=""/>
                </div>
            </div>
        })
    console.log(`${images.length} images found`)

    const links = [..._props.results]
        .filter((item: ParserResult) => {
            return item.type === ResultType.Anchor
        })
        .map((item: ParserResult, index) => {
            return <div key={`link_${index}`}>
                <a href="#" onClick={(e) => {
                    e.preventDefault()
                    _props.onUrlClick(item.url)
                }}>{item.url}</a>
            </div>
        })
    console.log(`${links.length} links found`)

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
