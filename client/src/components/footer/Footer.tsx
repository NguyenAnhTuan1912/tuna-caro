// Import hooks
import { useLangState } from 'src/hooks/useLang';

// Import types
import { FooterProps } from './Footer.props';

export default function Footer(props: FooterProps) {
  const { langTextJSON } = useLangState();

  return (
    <div className="app-footer p-2">
      <span>{langTextJSON.global.footTitle} <strong>{langTextJSON.global.authorName}</strong></span>
    </div>
  )
}