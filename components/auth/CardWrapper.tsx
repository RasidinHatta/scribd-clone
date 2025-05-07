import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { BackButton } from "./BackButton";
import Header from "./Header";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  title: string;
  showSocial?: boolean;
  backButtonHref: string;
  className?: string;
}

const CardWrapper = ({ children, headerLabel, backButtonLabel, backButtonHref, title, showSocial, className }: CardWrapperProps) => {
  return (
    <Card className={className ?? "xl:w-1/4 md:w-1/2 shadow-md"}>
      <CardHeader>
        <Header label={headerLabel} title={title} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;