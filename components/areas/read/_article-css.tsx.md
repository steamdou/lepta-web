export const ARTICLE_CSS =  `
    .article
    {
        margin-top: 0;
        margin-bottom: 0;
        display: flex;
        flex-direction: column;
    }

    .article img
    {
        max-width: 100% !important;
        height: auto !important;
        margin-bottom: 30px;
    }

    .body-xs .article,
    .body-s .article 
    {
        display: flex;
        flex-direction: column;
    }

    .article a
    {
        color: rgba(0,0,0,0.85);
        text-decoration: underline;
    }

    .article a::selection
    {
        color: rgba(0,0,0,0.85);
    }

    .article h1
    {
        margin-top: 0.5rem;
        margin-bottom: 2rem;
    }

    .article h1,
    .article h1 code,
    .article h1 span
    {
        font-size: 2.2rem !important;
        line-height: 1.2;
        font-weight: 700;
    }
    
    .article h2
    {
        margin-top: 0.5rem;
        margin-bottom: 1.5rem;
    }

    .article h2,
    .article h2 code,
    .article h2 span
    {
        font-size: 1.8rem !important;
        font-weight: 500;
        line-height: 1.2;
    }

    .article h3
    {
        margin-top: 0.5rem;
        margin-bottom: 1rem;
    }

    .article h3,
    .article h3 code,
    .article h3 span
    {
        font-size: 1.4rem !important;
        font-weight: 500;
        line-height: 1.2;
    }

    .article h4
    {
        margin-top: 0.5rem;
        margin-bottom: 1rem;
    }

    .article h4,
    .article h4 code,
    .article h4 span
    {
        font-size: 1.2rem !important;
        font-weight: 500;
        line-height: 1.2;
    }

    .article p,
    .article li
    {
        margin-bottom: 1rem;
        line-height: 1.5rem
    }

    .article blockquote
    { 
        border-left: solid 3px #d9d9d9;
        font-style: italic;
        margin: 1rem;
        padding: 1rem;
        margin-left: 0px;
    }

    .article blockquote  p:last-child
    { 
        margin-bottom: 0;
    }

`;