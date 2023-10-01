import React from 'react';

// Import components
import Grid from 'src/components/grid/Grid';

// Import types
import { GamePageProps } from './GamePage.props';

// Import styles
import './GamePage.styles.css';

interface GamePageElements {
  page: HTMLDivElement | null
}

interface KeyGuideProps {
  title: string;
  keys: string;
}


function KeyGuide(props: KeyGuideProps) {
  return (
    <div className="keyguide">
      <span className="me-1">{props.title}</span>
      <span className="fw-bold">{props.keys}</span>
    </div>
  );
}

/**
 * Component use to render page of Game.
 * @param props 
 * @returns 
 */
export default function GamePage(props: GamePageProps) {
  const elementRefs = React.useRef<GamePageElements>({
    page: null
  });

  React.useEffect(() => {
    elementRefs.current.page?.scrollTo({ top: 750, left: 750 });
  }, []);

  return (
    <div ref={ref => elementRefs.current.page = ref} className="game-page">
      <Grid
        height={"100%"}
        renderItem={(beh) => (
          <>
            <div className="guide p-1 m-3">
              <KeyGuide
                title='Di chuyển: giữ'
                keys='Space + LMB'
              />
              <KeyGuide
                title='Đánh dấu:'
                keys='LMB'
              />
            </div>
            <div className="grid-controller p-1 m-3 flex-box flex-col">
              <span
                onClick={() => { beh.zoomIn() }}
                className="material-symbols-outlined btn-no-padd outline p-1"
              >
                  add
              </span>
              <span
                onClick={() => { beh.zoomOut() }}
                className="material-symbols-outlined btn-no-padd spe-outline p-1"
              >
                  remove
              </span>
            </div>
          </>
        )}
      />
    </div>
  )
}