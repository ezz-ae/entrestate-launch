import Link from "next/link";
import { Button } from "@/components/ui/button";

const productsData = [
  {
    title: "Ready-Made Broker Site",
    description: "Full broker website ready to sell, customized by AI after purchase.",
    link: "/products/ready-broker-site",
  },
  {
    title: "Realtor Bio Link",
    description: "Personal brand link with inventory, AI chat, and lead capture.",
    link: "/products/realtor-bio-link",
  },
  {
    title: "Brochure to Landing",
    description: "Upload any brochure and get a high-converting landing page in minutes.",
    link: "/products/brochure-to-landing",
  },
  {
    title: "Instagram DM AI Agent",
    description: "Turn DMs into appointments with an AI property expert.",
    link: "/products/instagram-dm-ai",
  },
];

export function ProductFeatures() {
  return (
    <section className="py-20" id="products">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-4xl font-extrabold tracking-tight">
          Our Products
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {productsData.map((product, i) => (
            <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">{product.title}</h3>
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </div>
              <div className="p-6 pt-0">
                <Button asChild>
                  <Link href={product.link}>Learn More</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
