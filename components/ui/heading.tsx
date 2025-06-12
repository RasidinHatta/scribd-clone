import { TypographyH2, TypographyP } from "./typography";


interface HeadingProps {
  title: string;
  description?: string;
}

export function Heading({ title, description }: HeadingProps) {
  return (
    <div className="space-y-1">
      <TypographyH2>{title}</TypographyH2>
      {description && (
        <TypographyP className="text-muted-foreground">{description}</TypographyP>
      )}
    </div>
  );
}