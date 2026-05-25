import type { PageProps } from "./types";
import { TopicPage } from "./TopicPage";

export function Ransomware(props: PageProps) {
  return <TopicPage props={props} titleKey="ransomware" descriptionKey="ransomwareDescription" category="Ransomware" keywords={["ransomware", "extortion", "encryptor", "leak site", "double extortion", "known ransomware campaign use"]} />;
}
