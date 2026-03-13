import { notFound } from "next/navigation"
import { TemplatePreview } from "@/components/template-preview"
import { buildWebsiteFromTemplate, getWebsiteTemplateById } from "@/lib/template-preview"

export const revalidate = 60

export default async function TemplatePreviewPage({
  params,
}: {
  params: Promise<{ templateId: string }>
}) {
  const { templateId } = await params
  const template = getWebsiteTemplateById(templateId)

  if (!template) {
    notFound()
  }

  const website = buildWebsiteFromTemplate(template, { preview: true })

  return <TemplatePreview website={website} />
}
