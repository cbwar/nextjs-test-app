import {ParserResult, ResultType} from "../src/types";
import styles from '../styles/Search.module.scss'
import Loader from "./loader";

type SearchResults = {
    loading?: boolean
    results: ParserResult[],
    onUrlClick: (url: string) => void
}

export default function SearchResults(_props: SearchResults) {
    const props = Object.assign({}, {
        loading: false
    }, _props)

    const images = [..._props.results]
        .filter((item: ParserResult) => {
            return item.type === ResultType.Image
        })
        .map((item: ParserResult, index) => {
            return <div className={styles.result} key={`image_${index}`}>
                <div className={styles.body}>
                    <a href={item.url} target="_blank">
                        <img src={item.url} alt=""/>
                    </a>
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
            <div className={styles.panel}>
                <div className={styles.panelHeader}>Images</div>
                {!props.loading && <div className={styles.panelBodyThumbs}>
                    {images.length === 0 && <p>No images</p>}
                    {images.length > 0 && images}
                </div>}

                {props.loading && <div className={styles.panelBody}>
                    <Loader></Loader>
                </div>}
            </div>

            {links.length > 0 && <div className={styles.panel}>
                <div className={styles.panelHeader}>Links</div>
                <div className={styles.panelBody}>
                    {!props.loading && links}
                    {props.loading && <Loader></Loader>}
                </div>
            </div>}

        </div>
    )
}
