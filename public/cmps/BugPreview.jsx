

export function BugPreview({ bug }) {

    return (
        <article className="preview-info">
            <h4>{bug.title}</h4>
            <div className="bug-img"> <img src="/assets/img/bug.png" /></div>
            <p>Severity: <span>{bug.severity}</span></p>
        </article>
    )
}