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
    const [hasMore, setHasMore] = useState(true)

    useEffect(() => {
      setHasMore(true)
    }, [variables])

    const options = useMemo(
      () => ({
        variables: {
          take,
          cursor: null,
          skip: 0,
          ...variables,
        },
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      }),
      [variables]
    )

    const { data, error, loading, fetchMore } = useQuery(QUERY, options)

    const items = data ? data[listKey] : []

    const loadMore = useCallback(() => {
      if (hasMore)
        fetchMore({
          variables: {
            cursor: items[items.length - 1].id,
            skip: 1,
          },
        }).then((res) => {
          if (res.data[listKey].length === 0) {
            setHasMore(false)
          }
        })
    }, [items, hasMore, fetchMore])

    if (error) {
      if (Failure) {
        return <Failure error={error} />
      } else {
        console.error(displayName, error)
      }
    } else if (loading) {
      if (Loading) {
        return <Loading />
      } else {
        console.log(displayName, 'loading')
      }
    } else if (!loading && items.length === 0) {
      if (Empty) {
        return <Empty />
      } else {
        console.log(displayName, 'empty')
      }
    } else if (items.length > 0) {
      return <Success items={items} hasMore={hasMore} loadMore={loadMore} />
    } else {
      throw 'Cannot render Infinite Cell: zarbi'
    }
  }

  InfiniteCell.displayName = displayName

  return InfiniteCell
}
