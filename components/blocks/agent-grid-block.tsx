"use client"

import type { Agent, WebsiteSettings } from "../types"

interface AgentGridBlockProps {
  settings: WebsiteSettings
  title?: string
  data?: { agents?: Agent[] }
  columns?: 3 | 4
}

export function AgentGridBlock({
  settings,
  title = "Our Team",
  data,
  columns = 3,
}: AgentGridBlockProps) {
  const agents = data?.agents || []
  const colsClass = columns === 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-4"

  return (
    <section className="py-16 px-6 bg-white">
      <div className="container mx-auto">
        {title && (
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: settings.colors.primary }}>
            {title}
          </h2>
        )}

        {agents.length === 0 ? (
          <p className="text-center text-gray-500">No agents available</p>
        ) : (
          <div className={`grid ${colsClass} gap-8`}>
            {agents.map((agent) => (
              <div key={agent.id} className="text-center">
                <img
                  src={agent.imageUrl}
                  alt={agent.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-bold text-lg mb-1">{agent.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{agent.title}</p>
                <p className="text-sm text-gray-500">{agent.bio}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
