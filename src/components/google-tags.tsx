import Script from "next/script";

export default function GoogleTags() {
    return (
        <>
            <Script async src="https://www.googletagmanager.com/gtag/js?id=G-K2TTZJS9RQ" />
            <Script
                id="G-K2TTZJS9RQ"
                dangerouslySetInnerHTML={{
                    __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', 'G-K2TTZJS9RQ');
                `,
                }}
            />
        </>
    );
}
