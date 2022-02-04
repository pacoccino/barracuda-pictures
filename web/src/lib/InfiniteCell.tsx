import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@redwoodjs/web'

export type InfiniteSuccessProps<T> = {
  items: T[]
  loadMore: () => void
  hasMore: boolean
}

export function createInfiniteCell({
  QUERY,
  Failure,
  Success,
  Loading,
  Empty,
  displayName,
  listKey,
  take = 10,
}) {
  function InfiniteCell({ variables }) {
    const [allItems, setAllItems] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [cursor, setCursor] = useState<string | null>(null)

    useEffect(() => {
      setAllItems([])
      setCursor(null)
      setHasMore(true)
    }, [variables])

    const addItems = useCallback(
      (items) => setAllItems(allItems.concat(items)),
      [allItems]
    )

    const options = useMemo(
      () => ({
        variables: {
          take,
          cursor: cursor,
          skip: cursor ? 1 : 0,
          ...variables,
        },
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
        onCompleted: (data) => {
          const newItems = data[listKey]
          if (newItems.length > 0) {
            addItems(data[listKey])
          } else {
            setHasMore(false)
          }
        },
      }),
      [cursor, addItems, variables]
    )

    const { error, loading } = useQuery(QUERY, options)

    const loadMore = useCallback(() => {
      if (hasMore) setCursor(allItems[allItems.length - 1].id)
    }, [allItems, hasMore])

    if (error) {
      if (Failure) {
        return <Failure error={error} />
      } else {
        console.error(displayName, error)
      }
    } else if (loading && allItems.length === 0) {
      if (Loading) {
        return <Loading />
      } else {
        console.log(displayName, 'loading')
      }
    } else if (!loading && allItems.length === 0) {
      if (Empty) {
        return <Empty />
      } else {
        console.log(displayName, 'empty')
      }
    } else if (allItems.length > 0) {
      return <Success items={allItems} hasMore={hasMore} loadMore={loadMore} />
    } else {
      throw 'Cannot render Infinite Cell: zarbi'
    }
  }

  InfiniteCell.displayName = displayName

  return InfiniteCell
}
