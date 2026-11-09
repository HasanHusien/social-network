import { Text, Button } from "@react-email/components";
import Layout from "./layout.js";
import type { CSSProperties } from "react";

const buttonStyle = {
  backgroundColor: "#55c57a",
  borderRadius: "5px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: "bold",
  padding: "12px 25px",
  textDecoration: "none",
  textTransform: "capitalize",
} satisfies CSSProperties;

type WelcomeProps = {
  firstName: string;
  url?: string;
};

// purely presentation component
function Welcome({ firstName, url }: WelcomeProps) {
  return (
    <Layout preview="Welcome to Unknown, we're glad to have you!">
      <Text>Hi {firstName},</Text>

      <Text>Welcome to Unknown, we're glad to have you 🎉🙏</Text>

      <Text>
        We're all a big family here, so make sure to upload your user photo so
        we get to know you a bit better!
      </Text>

      <Button href={url} style={buttonStyle}>
        See your profile
      </Button>

      <Text>
        If you need any help with booking your next tour, please don't hesitate
        to contact me!
      </Text>

      <Text>- Hassan Hussien, CEO</Text>
    </Layout>
  );
}

export default Welcome;
