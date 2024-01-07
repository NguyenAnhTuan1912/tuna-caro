// Import from components
import LoadingIndicator from 'src/components/loading_indicator/LoadingIndicator';
import Layer from 'src/components/layer/Layer';

// Import hooks
import { useLangState } from 'src/hooks/useLang';

// Locally Import
import { PauseGameLayerProps } from '../Game.props';

/**
 * Component renders a pause game layer.
 * @param props 
 * @returns 
 */
export default function PauseGameLayer(props: PauseGameLayerProps) {
  const { langTextJSON } = useLangState();

  return (
    <Layer>
      <LoadingIndicator
        text={props.text ? props.text : langTextJSON.global.pauseGameText}
      />
    </Layer>
  )
}
