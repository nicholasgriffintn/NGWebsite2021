import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Link } from "@/components/Link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Heading } from "@/types/blog"

interface TableOfContentsProps {
  headings: Heading[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {

  if (!headings.length) return null

  return (
    <div className="rounded-lg border bg-background/50 text-foreground">
      <div className="flex items-center p-4">
        <h3 className="text-sm font-semibold">Table of Contents</h3>
      </div>
      <ScrollArea className="pb-4">
        <nav>
          <ul className="space-y-3 text-sm">
            {headings.map((heading) => (
              <li
                key={heading.slug}
                style={{ paddingLeft: `${(heading.level - 2) * 1}rem` }}
              >
                <Link
                  href={`#${heading.slug}`}
                  className={cn(
                    "group flex items-center gap-2 py-1 pl-4 pr-4 text-muted-foreground no-underline transition-colors hover:text-foreground",
                  )}
                  underline={false}
                >
                  {heading.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>
    </div>
  )
}

