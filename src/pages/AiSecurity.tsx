import type { PageProps } from "./types";
import { TopicPage } from "./TopicPage";

export function AiSecurity(props: PageProps) {
  return <TopicPage props={props} titleKey="aiSecurity" descriptionKey="aiDescription" category="AI Security" keywords={["ai", "llm", "prompt injection", "model security", "copilot", "generative ai", "data leakage", "ai supply chain"]} />;
}
