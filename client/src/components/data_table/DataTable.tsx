import React from 'react'

// Import hooks
import { useStateWESSFns } from 'src/hooks/useStateWESSFns';

// Import types
import { DataTableProps } from './DataTable.props';

// Import styles
import './DataTable.styles.css';

export default function DataTable<T>({
  maxRows = 5,
  ...props
}: DataTableProps<T>) {
  const totalPages = Math.ceil(props.data.length / maxRows);
  const [dataTableState, fns] = useStateWESSFns({
    currentPage: 1
  }, function(changeState) {
    return {
      changeCurrentPageState: function(value: number) {
        changeState(
          "currentPage",
          function(data) { return data + value },
          function(data) { return data < 1 || data > totalPages }
        );
      }
    }
  });

  // TO DO: Get number of data rows depend on currentPage, MaxRows and length of props.data.
  // Need to know which index is start and which is end. Optimize when iterate.
  // start is calculate with the idea of `step`. Depend on maxRows and currentPage (step is maxRows).
  // end is easier, just get maxRows * currentPage and compare with N (length of props.data). if result > N, then get N else get result.
  const printableDataRows = React.useMemo(() => {
    let d: Array<{ index: number, data: T }> = [];
    let N = props.data.length;
    let start = maxRows * (dataTableState.currentPage - 1);
    let end = maxRows * dataTableState.currentPage < N ? maxRows * dataTableState.currentPage : N;

    for(let i = start; i < end; i++) {
      d.push({ data: props.data[i], index: i });
    }

    return d;
  }, [dataTableState.currentPage, props.data, maxRows]);

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
            printableDataRows.map((c) => props.renderRowData(c.data, c.index))
          }
        </tbody>
      </table>
      {/* Buttons */}
      <div className="data-table-controller pt-2">
        <h3>{dataTableState.currentPage}/{totalPages}</h3>
        <div className="ms-2">
          <span
            onClick={() => fns.changeCurrentPageState(-1)}
            className="material-symbols-outlined btn-no-padd spe-outline p-1"
          >keyboard_arrow_left</span>
          <span
            onClick={() => fns.changeCurrentPageState(1)}
            className="material-symbols-outlined btn-no-padd spe-outline p-1"
          >keyboard_arrow_right</span>
        </div>
      </div>
    </div>
  )
}