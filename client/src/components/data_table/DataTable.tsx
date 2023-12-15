import React from 'react'

// Import hooks
import { useStateWESSFns } from 'src/hooks/useStateWESSFns';

// Import from components
import LoadingIndicator from '../loading_indicator/LoadingIndicator';

// Locally Import
import { DatatableStateConfigs } from './state/data_table';

// Import types
import { DataTableProps } from './DataTable.props';

// Import styles
import './DataTable.styles.css';

/**
 * Component will render a data table depend on `data`. In the early of this component, it only render data that is a its prop.
 * But maybe the data is still remain on server, so the datatable must be load them too.
 * 
 * By this way, this component will have 2 types of data:
 * - `Initial Data`: the data is fetched in first, before the component renders.
 * - `Asynchronous Data`: the data is fetched later.
 * @param param0 
 * @returns 
 */
export default function DataTable<T>({
  maxRows = 5,
  ...props
}: DataTableProps<T>) {
  const [state, setStateFns] = useStateWESSFns(
    DatatableStateConfigs.getInitialState<T>(props, maxRows),
    function(changeState) { return DatatableStateConfigs.getStateFns<T>(changeState, props) }  
  );

  // TO DO: Get number of data rows depend on currentPage, MaxRows and length of props.data.
  // Need to know which index is start and which is end. Optimize when iterate.
  // start is calculate with the idea of `step`. Depend on maxRows and currentPage (step is maxRows).
  // end is easier, just get maxRows * currentPage and compare with N (length of props.data). if result > N, then get N else get result.
  const printableDataRows = React.useMemo(() => {
    let d: Array<T> = [];
    let N = state.data.length;
    let start = maxRows * (state.currentPage - 1);
    let end = maxRows * state.currentPage < N ? maxRows * state.currentPage : N;

    for(let i = start; i < end; i++) {
      d.push(state.data[i]);
    }

    return d;
  }, [state.currentPage, state.data, maxRows]);

  // console.log("State: ", state);

  React.useEffect(() => {
    /*
      This useEffect can be triggered by:
        - `props.data` is fullfilled by parent component. Then the length of `props.data` change.
    */
    /*
      Because when the first render, `props.data` is empty, so state.data is the same.
      Then if `props.data` is fullfilled, then set `props.data` to `data` state. 
    */
    if(props.data.length > 0 && !state.hasInitialData) {
      // If state has no data, the add new data to group and confirm the initial data is loaded.
      setStateFns.addDataToList(props.data);
      // RUN ONE TIME.
      setStateFns.confirmHasInitialData();
    ;}
  }, [props.data.length]);

  return (
    <div className="data-table-container">
      {/* Table */}
      <table className="data-table">
        <thead>
          {
            props.renderHeader()
          }
        </thead>
        <tbody>
          {
            printableDataRows.map((c, index) => props.renderRowData(c, index))
          }
        </tbody>
      </table>
      {/* Buttons */}
      <div className="data-table-controller pt-2">
        { state.isFetching && <LoadingIndicator text="Đang tải..." /> }
        <div className="flex-box ait-center ms-4">
          <h3>{state.currentPage}/{state.totalPages}</h3>
          <div className="ms-2">
            <span
              onClick={() => setStateFns.changeCurrentPage(-1)}
              className="material-symbols-outlined btn-no-padd spe-outline p-1"
            >keyboard_arrow_left</span>
            <span
              onClick={() => setStateFns.changeCurrentPage(1)}
              className="material-symbols-outlined btn-no-padd spe-outline p-1"
            >keyboard_arrow_right</span>
          </div>
        </div>
      </div>
    </div>
  )
}