/** @jsxRuntime automatic */
import {
  Document,
  Link,
  Page,
  renderToBuffer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { cvEmail, resume, type Role } from "@/content/resume";
import { site } from "@/content/site";
import { tools } from "@/content/tools";
import { formatRange } from "@/lib/format";
import { getSiteUrl } from "@/lib/site-url";

const INK = "#10233f";
const SOFT = "#46586f";
const BLUE = "#1d4fd7";

const styles = StyleSheet.create({
  page: {
    paddingTop: 34,
    paddingBottom: 34,
    paddingHorizontal: 46,
    fontFamily: "Helvetica",
    fontSize: 9.5,
    lineHeight: 1.4,
    color: "#1f2933",
  },
  name: { fontFamily: "Helvetica-Bold", fontSize: 22, color: INK, lineHeight: 1.1 },
  headline: { fontSize: 11, color: INK, marginTop: 3 },
  contact: { fontSize: 9, color: SOFT, marginTop: 5 },
  link: { color: BLUE, textDecoration: "none" },
  heading: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: INK,
    marginTop: 10,
    marginBottom: 4,
    paddingBottom: 2,
    borderBottomWidth: 0.75,
    borderBottomColor: "#9fb0c3",
  },
  role: { marginBottom: 5 },
  roleLine: { flexDirection: "row", justifyContent: "space-between" },
  roleTitle: { fontFamily: "Helvetica-Bold", color: INK, flexShrink: 1, paddingRight: 10 },
  dates: { color: SOFT, flexShrink: 0 },
  company: { color: SOFT },
  bullet: { flexDirection: "row", marginTop: 1.5 },
  bulletMark: { width: 9 },
  bulletText: { flex: 1 },
  entry: { marginBottom: 3 },
  strong: { fontFamily: "Helvetica-Bold", color: INK },
});

function RoleEntry({ role }: { role: Role }) {
  return (
    <View style={styles.role}>
      <View style={styles.roleLine} wrap={false}>
        <Text style={styles.roleTitle}>{role.title}</Text>
        <Text style={styles.dates}>{formatRange(role.start, role.end)}</Text>
      </View>
      <Text style={styles.company}>
        {role.company}, {role.employment}
      </Text>
      {role.bullets.map((bullet) => (
        <View key={bullet} style={styles.bullet}>
          <Text style={styles.bulletMark}>•</Text>
          <Text style={styles.bulletText}>{bullet}</Text>
        </View>
      ))}
    </View>
  );
}

function CvDocument() {
  const siteUrl = getSiteUrl();
  return (
    <Document
      title={`${site.name} CV`}
      author={site.name}
      subject={resume.headline}
      keywords="AI full-stack developer, SaaS, Next.js, TypeScript, sales funnels"
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{site.name}</Text>
        <Text style={styles.headline}>{resume.headline}</Text>
        <Text style={styles.contact}>
          {cvEmail} | {site.location} ({site.timezone})
        </Text>
        <Text style={styles.contact}>
          <Link style={styles.link} src={siteUrl}>
            {siteUrl.replace("https://", "")}
          </Link>
          {" | "}
          <Link style={styles.link} src={site.links.linkedin}>
            LinkedIn
          </Link>
          {" | "}
          <Link style={styles.link} src={site.links.upwork}>
            Upwork profile
          </Link>
        </Text>

        <Text style={styles.heading}>Summary</Text>
        <Text>{resume.summary}</Text>

        <Text style={styles.heading}>Experience</Text>
        {resume.roles.map((role) => (
          <RoleEntry key={`${role.company}-${role.start}`} role={role} />
        ))}

        <Text style={styles.heading}>Engineering background</Text>
        {resume.engineering.map((role) => (
          <RoleEntry key={`${role.company}-${role.start}`} role={role} />
        ))}

        <Text style={styles.heading}>Education and certifications</Text>
        {resume.education.map((item) => (
          <View key={item.title} style={styles.entry} wrap={false}>
            <View style={styles.roleLine}>
              <Text style={styles.roleTitle}>{item.title}</Text>
              <Text style={styles.dates}>{item.dates}</Text>
            </View>
            <Text style={styles.company}>
              {item.school}
              {item.note ? `. ${item.note}` : ""}
            </Text>
          </View>
        ))}

        <Text style={styles.heading}>Tools</Text>
        {tools.map((tool) => (
          <Text key={tool.group} style={styles.entry}>
            <Text style={styles.strong}>{tool.group}: </Text>
            {tool.items.join(", ")}
          </Text>
        ))}

        <Text style={styles.heading}>Languages and references</Text>
        <Text>
          {resume.languages.join(", ")}. {resume.references}
        </Text>
      </Page>
    </Document>
  );
}

export function renderCv(): Promise<Buffer> {
  return renderToBuffer(<CvDocument />);
}
