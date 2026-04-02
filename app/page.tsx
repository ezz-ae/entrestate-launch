import { SiteHeader } from "@/components/site-header"
import { MtcHome } from "@/components/mtc-home"
import { AppverseFooter } from "@/components/appverse-footer"
import { getMarketingFooter } from "@/lib/marketing"

export const revalidate = 60

export default async function Page() {
  const footer = await getMarketingFooter()

  return (
    <>
      <main className="min-h-[100dvh] bg-[#081225] text-white">
        <SiteHeader />
        <MtcHome />
        <AppverseFooter content={footer} />
      </main>
    </>
  )
}
