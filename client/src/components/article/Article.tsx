// Import types
import { AriticleProps } from './Article.props'

/**
 * Component will render an article with title and content.
 * @param props 
 * @returns 
 */
export default function Article({
  hasHorizontalLine = false,
  hasPadding = false,
  ...props
}: AriticleProps) {
  return (
    <article className="article mt-4">
      <h3 className={hasHorizontalLine ? undefined : "mb-1"}>{props.title}</h3>
      { hasHorizontalLine && <hr className="my-1"></hr> }
      <div className={hasPadding ? undefined : "mx-1"}>
        {props.children}
      </div>
    </article>
  )
}