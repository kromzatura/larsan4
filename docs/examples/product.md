import {
CheckCircle2,
Facebook,
Home,
Instagram,
Linkedin,
Twitter,
} from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
Breadcrumb,
BreadcrumbItem,
BreadcrumbLink,
BreadcrumbList,
BreadcrumbPage,
BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Product1 = () => {
return (
<section className="py-32">
<div className="container">
<Breadcrumb>
<BreadcrumbList>
<BreadcrumbItem>
<BreadcrumbLink href="/">
<Home className="h-4 w-4" />
</BreadcrumbLink>
</BreadcrumbItem>
<BreadcrumbSeparator />
<BreadcrumbItem>
<BreadcrumbLink href="/">Components</BreadcrumbLink>
</BreadcrumbItem>
<BreadcrumbSeparator />
<BreadcrumbItem>
<BreadcrumbPage>Products</BreadcrumbPage>
</BreadcrumbItem>
</BreadcrumbList>
</Breadcrumb>
<h1 className="mt-7 text-3xl font-semibold md:text-5xl">
Professional Service Agreement
</h1>
<div className="relative mt-12 grid gap-16 md:grid-cols-2">
<article className="prose dark:prose-invert order-2 mx-auto md:order-1">
<div>
<img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg"
                alt="placeholder"
                className="mb-8 mt-0 aspect-video w-full rounded-lg object-cover"
              />
</div>
<h1>The Joke Tax Chronicles</h1>
<p>
Once upon a time, in a far-off land, there was a very lazy king
who spent all day lounging on his throne. One day, his advisors
came to him with a problem: the kingdom was running out of money.
</p>
<h2>The King&apos;s Plan</h2>
<p>
The king thought long and hard, and finally came up with{" "}
<a href="#">a brilliant plan</a>: he would tax the jokes in the
kingdom.
</p>
<blockquote>
&ldquo;After all,&rdquo; he said, &ldquo;everyone enjoys a good
joke, so it&apos;s only fair that they should pay for the
privilege.&rdquo;
</blockquote>
<h3>The Joke Tax</h3>
<p>
The king&apos;s subjects were not amused. They grumbled and
complained, but the king was firm:
</p>
<ul>
<li>1st level of puns: 5 gold coins</li>
<li>2nd level of jokes: 10 gold coins</li>
<li>3rd level of one-liners : 20 gold coins</li>
</ul>
<p>
As a result, people stopped telling jokes, and the kingdom fell
into a gloom. But there was one person who refused to let the
king&apos;s foolishness get him down: a court jester named
Jokester.
</p>
<h3>Jokester&apos;s Revolt</h3>
<p>
Jokester began sneaking into the castle in the middle of the night
and leaving jokes all over the place: under the king&apos;s
pillow, in his soup, even in the royal toilet. The king was
furious, but he couldn&apos;t seem to stop Jokester.
</p>
<p>
And then, one day, the people of the kingdom discovered that the
jokes left by Jokester were so funny that they couldn&apos;t help
but laugh. And once they started laughing, they couldn&apos;t
stop.
</p>
<h3>The People&apos;s Rebellion</h3>
<p>
The people of the kingdom, feeling uplifted by the laughter,
started to tell jokes and puns again, and soon the entire kingdom
was in on the joke.
</p>
<div>
<table>
<thead>
<tr>
<th>King&apos;s Treasury</th>
<th>People&apos;s happiness</th>
</tr>
</thead>
<tbody>
<tr>
<td>Empty</td>
<td>Overflowing</td>
</tr>
<tr className="even:bg-muted m-0 border-t p-0">
<td>Modest</td>
<td>Satisfied</td>
</tr>
<tr className="even:bg-muted m-0 border-t p-0">
<td>Full</td>
<td>Ecstatic</td>
</tr>
</tbody>
</table>
</div>
<p>
The king, seeing how much happier his subjects were, realized the
error of his ways and repealed the joke tax. Jokester was declared
a hero, and the kingdom lived happily ever after.
</p>
<p>
The moral of the story is: never underestimate the power of a good
laugh and always be careful of bad ideas.
</p>
</article>
<div className="order-1 h-fit md:sticky md:top-20 md:order-2">
<p className="mb-2 text-lg font-semibold">
Excerpt from the document
</p>
<p className="text-muted-foreground">
A comprehensive service agreement template designed for
professional service providers and their clients. This document
outlines the scope of work, deliverables, timelines, and terms of
service to ensure clear expectations and protect both
parties&apos; interests.
</p>
<Button size="lg" className="mt-6">
Download the document
</Button>
<Separator className="my-6" />
<div className="flex gap-3">
<Avatar className="size-10 rounded-full border">
<AvatarImage
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp"
                  alt="placeholder"
                />
</Avatar>
<div>
<h2 className="text-sm font-medium">Reviewed by John Doe</h2>
<p className="text-muted-foreground text-sm">
Legal Consultant
</p>
</div>
</div>
<Separator className="my-6" />
<p className="mb-4 text-sm font-medium">Key Features</p>
<ul className="flex flex-col gap-2">
<li className="flex items-center gap-2">
<CheckCircle2 className="h-4 w-4" />
<p>Customizable Terms</p>
</li>
<li className="flex items-center gap-2">
<CheckCircle2 className="h-4 w-4" />
<p>Digital Signatures</p>
</li>
<li className="flex items-center gap-2">
<CheckCircle2 className="h-4 w-4" />
<p>Document Tracking</p>
</li>
</ul>
<Separator className="my-6" />
<div className="flex items-center justify-between">
<p className="text-sm font-medium">Share this template</p>
<ul className="flex gap-2">
<li>
<a
                    href="#"
                    className="hover:bg-muted inline-flex rounded-full border p-2 transition-colors"
                  >
<Facebook className="h-4 w-4" />
</a>
</li>
<li>
<a
                    href="#"
                    className="hover:bg-muted inline-flex rounded-full border p-2 transition-colors"
                  >
<Twitter className="h-4 w-4" />
</a>
</li>
<li>
<a
                    href="#"
                    className="hover:bg-muted inline-flex rounded-full border p-2 transition-colors"
                  >
<Linkedin className="h-4 w-4" />
</a>
</li>
<li>
<a
                    href="#"
                    className="hover:bg-muted inline-flex rounded-full border p-2 transition-colors"
                  >
<Instagram className="h-4 w-4" />
</a>
</li>
</ul>
</div>
</div>
</div>
</div>
</section>
);
};

export { Product1 };
