import { openTMI } from "tunangn-react-modal";
import { useNavigate } from "react-router-dom";

// Import from components
import Button from '../button/Button';

// Import types
import { HeaderProps } from './Header.props';

export default function Header(props: HeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="app-header p-2" id="app-header">
      <div className="flex-box ait-center">
        {
          typeof props.backButton === "function"
            ? props.backButton(navigate)
            : props.backButton
        }
        {
          (typeof props.title === "string" || !props.title)
            ? <h4>{"Caro - " + props.title || "Caro"}</h4>
            : (typeof props.title === "function")
              ? props.title()
              : props.title
        }
      </div>
      <div className="flex-box ait-center">
        <Button
          isTransparent
          hasPadding={false}
          onClick={() => { openTMI("mySideMenu") }}
          extendClassName="rounded-4 p-1"
        >
          <span className="material-symbols-outlined">menu</span>
        </Button>
      </div>
    </div>
  )
}