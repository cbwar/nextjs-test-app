import Image from "next/image";

export default function Loader() {
    return (
        <div>
            <Image src="/loader.svg" width={256} height={256} alt="Loader"/>
        </div>
    )
}
