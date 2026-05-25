import type { PageProps } from "./types";
import { TopicPage } from "./TopicPage";

export function SupplyChain(props: PageProps) {
  return <TopicPage props={props} titleKey="supplyChain" descriptionKey="supplyDescription" category="Supply Chain" keywords={["dependency", "npm", "pypi", "github actions", "ci/cd", "package compromise", "build pipeline", "supply chain"]} />;
}
