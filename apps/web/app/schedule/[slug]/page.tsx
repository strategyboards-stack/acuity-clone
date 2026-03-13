import { redirect } from "next/navigation";

export default function DirectServiceLinkPage({ params }: { params: { slug: string } }) {
  redirect(`/schedule?service=${params.slug}`);
}
