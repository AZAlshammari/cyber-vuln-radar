import type { PageProps } from "./types";
import { TopicPage } from "./TopicPage";

export function ZeroDay(props: PageProps) {
  return <TopicPage props={props} titleKey="zeroDay" descriptionKey="zeroDayDescription" category="Zero-Day" keywords={["zero-day", "0-day", "actively exploited", "exploited in the wild", "emergency patch"]} />;
}
