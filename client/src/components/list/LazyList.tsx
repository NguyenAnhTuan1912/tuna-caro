import React from 'react';

// Import from hooks
import { useStateWESSFns } from 'src/hooks/useStateWESSFns';

// Locally Import
import List from './List';

import { LazyListProps } from './List.props';

export default function LazyList<T>(props: LazyListProps<T>) {
  const [state, setStateFns] = useStateWESSFns(
    {
      list: [] as Array<T>,
      skip: 0
    },
    function(changeState) {
      return {
        /**
         * Use this function to add data to `list`.
         * @param data 
         * @returns 
         */
        appendToList: function(data: Array<T>) {
          if(data.length === 0) return;

          // Add item to list.
          changeState("list", function(list) {
            return [...list, ...data];
          });

          // Increase skip by length of data.
          changeState("skip", function(skip) {
            return skip + data.length;
          });
        }
      }
    }
  );

  return (
    <List
      data={state.list}
      renderItem={props.renderItem}
      extractKey={props.extractKey}
      onReachBottom={() => {
        props
        .getListDataAsync(state.skip)
        .then(data => {
          // Append `data` to list.
          setStateFns.appendToList(data);
        })
      }}
    />
  )
}