'use client'

import { useState } from "react"

export default function LikeButton() {
    const [likeCount, setLikeCount] = useState(0)

    const handleLike = () => {
        setLikeCount(prevCount => prevCount + 1)
    }
    return (
        <button
        onClick={handleLike}
        className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-1 rounded-full transition-colors"
        >
            <span>👍</span>
            <span>{likeCount} いいね</span>
        </button>
    )
}