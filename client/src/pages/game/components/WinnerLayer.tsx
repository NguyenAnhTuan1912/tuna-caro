// Import from classes
import { PlayerType } from 'src/classes/Player';

// Import from hooks
import { usePlayer } from 'src/hooks/usePlayer';

// Import from components
import Layer from 'src/components/layer/Layer';
import ProfileCard, { StaticProfileCard } from 'src/components/profile_card/ProfileCard';

type WinnerLayerProps = {
  button: JSX.Element | undefined;
  winner: PlayerType;
};

/**
 * Component renders a layer that let players know who is winner.
 * @param props 
 * @returns 
 */
export default function WinnerLayer(props: WinnerLayerProps) {
  const { player } = usePlayer();

  return (
    <Layer>
      <div className="winner-layer-content flex-box flex-col ait-center jus-center py-2">
        <div className="flex-box flex-col ait-center">
          {
            player.id === props.winner.id
            ? (
              // For winner
              <>
                <h1 className="fs-1 txt-clr-success">Bạn đã thắng :D</h1>
              </>
              ) : (
              // For loser
              <>
                <h1 className="fs-1 txt-clr-error">Bạn đã thua :(</h1>
              </>
            )
          }
          <p className="fs-4 mt-1 mb-2">WINNER</p>
          <StaticProfileCard isVertical player={props.winner} />
          {/* Close Button */}
          { props.button }
        </div>
      </div>
    </Layer>
  )
}
