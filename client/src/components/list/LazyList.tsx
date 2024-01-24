import React from 'react';

// Import from hooks
import { useStateWESSFns } from 'src/hooks/useStateWESSFns';

// Import from utils
import { ElementUtils } from 'src/utils/element';

// Import from components
import Button from '../button/Button';

// Locally Import
import List from './List';

import { LazyListProps } from './List.props';

/**
 * Like `List`, but this `LazyList` supports lazy loading for asynchronous data.
 * @param props 
 * @returns 
 */
export default function LazyList<T>(props: LazyListProps<T>) {
  const [state, setStateFns] = useStateWESSFns(
    {
      list: [] as Array<T>,
      skip: 0,
      isLoadMoreButtonVisible: false
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
        },

        /**
         * Use this function to update status of Load More Button's Visibility.
         * @param data 
         */
        updateLoadMoreButtonVisibility: function(data?: boolean) {
          changeState("isLoadMoreButtonVisible", function(status) {
            if(data && typeof data === "boolean") return data;
            return !status;
          });
        },

        /**
         * Use this function to clear the data of LazyList.
         */
        clearData: function() {
          changeState("list", function() {
            return [];
          });

          changeState("skip", function() {
            return 0;
          });
        }
      }
    }
  );
  const listRef = React.useRef<HTMLDivElement>(null);

  let getDataAsync = function() {
    props
    .getListDataAsync(state.skip)
    .then(data => {
      // Append `data` to list.
      setStateFns.appendToList(data);
    });
  };

  React.useEffect(() => {
    // Call API to get data for the first time.
    props
    .getListDataAsync(state.skip)
    .then(data => {
      setStateFns.appendToList(data);
      setStateFns.updateLoadMoreButtonVisibility(true);
    });

    return function() {
      setStateFns.clearData();
    }
  }, []);

  // Check the List if it can be scroll.
  React.useEffect(() => {
    /*
      Because the content is appended to list, but the List is not added to DOM.
      DOM need time to render new element, then It will update new state.
      => That mean when DOM is completelyy rendered, the props' value of its every element
      will be updated.
    */
    if(state.list.length > 0 && ElementUtils.isScrollable(listRef.current!) && state.isLoadMoreButtonVisible)
      setStateFns.updateLoadMoreButtonVisibility(false);
  }, [state.list.length]);

  console.log("LazyList's State: ", state);

  return (
    <>
      <List
        ref={listRef}
        maxHeight={props.maxHeight ? props.maxHeight : "100vh"}
        data={state.list}
        renderItem={(item, index) => {
          return props.renderItem(item, index);
        }}
        onReachBottom={getDataAsync}
      />
      {
        state.isLoadMoreButtonVisible && (
          <Button
            hasBorder={false}
            extendClassName="txt-clr-primary mx-auto"
            onClick={getDataAsync}
          >
            { props.loadMoreBtnLabel }
          </Button>
        )
      }
    </>
  )
}