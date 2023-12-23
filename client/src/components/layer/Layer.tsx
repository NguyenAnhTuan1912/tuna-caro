// Locally Import
// Import types
import { LayerProps } from "./Layer.props";

// Import styles
import "./Layer.styles.css";

/**
 * Component renders a layer.
 * 
 * __What's layer?__
 * 
 * Layer is a plane that cover above another plane. In this case,
 * layer is a div element that has asolute position with its parent.
 * @param props 
 * @returns 
 */
export default function Layer(props: LayerProps) {
  return (
    <div className="layer flex-box flex-rw ait-center jc-center">
      { props.children }
    </div>
  )
}
