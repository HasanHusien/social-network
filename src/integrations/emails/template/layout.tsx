import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Link,
} from "@react-email/components";
import type { CSSProperties, ReactNode } from "react";

// fast css
const colors = {
  bg: "#f6f6f6",
  white: "#ffffff",
  text: "#000000",
  muted: "#999999",
  brand: "#55c57a",
} as const;

const styles = {
  body: {
    backgroundColor: colors.bg,
    fontFamily: "sans-serif",
    fontSize: "14px",
    lineHeight: "1.4",
    margin: 0,
    padding: 0,
  },
  container: {
    display: "block",
    margin: "0 auto",
    maxWidth: "580px",
    padding: "10px",
    width: "580px",
  },
  main: {
    backgroundColor: colors.white,
    borderRadius: "3px",
    width: "100%",
    padding: "20px",
  },
  footer: {
    clear: "both",
    marginTop: "10px",
    textAlign: "center",
    width: "100%",
  },
  footerText: {
    color: colors.muted,
    fontSize: "12px",
    textAlign: "center",
  },
  link: {
    color: colors.brand,
    textDecoration: "underline",
  },
} satisfies Record<string, CSSProperties>;

type LayoutProp = {
  preview?: string;
  children: ReactNode;
};

// purely presentation component for email msg
function Layout({ preview, children }: LayoutProp) {
  return (
    <Html>
      <Head />
      {preview ? <Preview>{preview}</Preview> : null}

      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.main}>{children}</Section>

          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Unknown Inc, 123 Nowhere Road, San Francisco CA 99999
            </Text>
            <Text style={styles.footerText}>
              Don't like these emails?{" "}
              <Link href="#" style={styles.link}>
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
export default Layout;
