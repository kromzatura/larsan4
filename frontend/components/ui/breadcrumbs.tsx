import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Home } from "lucide-react";

type BreadcrumbLinkType = {
  label: string;
  href: string;
};

const BreadcrumbCustomItem = ({
  label,
  href,
  isCurrent,
}: BreadcrumbLinkType & { isCurrent?: boolean }) => {
  return (
    <>
      <BreadcrumbItem>
        {!isCurrent ? (
          <BreadcrumbLink asChild>
            <Link href={href}>{label}</Link>
          </BreadcrumbLink>
        ) : (
          <BreadcrumbPage>{label}</BreadcrumbPage>
        )}
      </BreadcrumbItem>
      {!isCurrent && <BreadcrumbSeparator />}
    </>
  );
};

export default function Breadcrumbs({
  links,
}: {
  links: BreadcrumbLinkType[];
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/" title="Home">
              <Home className="h-4 w-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {links.map((link, index) => (
          <BreadcrumbCustomItem
            key={link.label}
            {...link}
            isCurrent={index === links.length - 1}
          />
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
