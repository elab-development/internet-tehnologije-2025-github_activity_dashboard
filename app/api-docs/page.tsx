'use client'

import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'
import { useEffect, useState } from 'react'

export default function ApiDocsPage() {
  const [spec, setSpec] = useState(null)

  useEffect(() => {
    fetch('/api/swagger')
      .then(r => r.json())
      .then(setSpec)
  }, [])

  if (!spec) return <div className="p-8 text-zinc-400">Učitavanje dokumentacije...</div>

  return (
    <div className="swagger-wrapper">
      <SwaggerUI spec={spec} />
    </div>
  )
}
