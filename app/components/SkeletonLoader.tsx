"use client"

import React, { ReactNode } from "react"
import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'

type Props = {
  children: ReactNode
  skeletonCount?: number
  skeletonHeight?: number
  className?: string
}

const WithSuspenseSkeleton = ({
  children,
  skeletonCount = 3,
  skeletonHeight = 20,
  className = ""
}: Props) => {
  return (
    <React.Suspense
      fallback={
        <div className={`flex flex-col gap-3 ${className}`}>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <Skeleton key={i} height={skeletonHeight} />
          ))}
        </div>
      }
    >
      {children}
    </React.Suspense>
  )
}

export default WithSuspenseSkeleton
