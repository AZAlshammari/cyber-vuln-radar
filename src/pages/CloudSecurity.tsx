import type { PageProps } from "./types";
import { TopicPage } from "./TopicPage";

export function CloudSecurity(props: PageProps) {
  return <TopicPage props={props} titleKey="cloudSecurity" descriptionKey="cloudDescription" category="Cloud Security" keywords={["aws", "azure", "gcp", "cloud", "kubernetes", "docker", "container", "iam", "misconfiguration"]} />;
}
