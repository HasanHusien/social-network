import type { CSSProperties } from "react";
import Layout from "./layout.js";
import { Text, Button } from "@react-email/components";

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

type ResetPasswordProps = {
  firstName: string;
  url: string;
};

// purely presentation component
function ResetPassword({ firstName, url }: ResetPasswordProps) {
  return (
    <Layout preview="Welcome to Unknown, we're glad to have you!">
      <Text>Hi {firstName},</Text>

      <Text>
        Forget your password? Submit a patch request with new password and
        passwordConfirm to: {url};
      </Text>

      <Text>Website for this action not yet implemented</Text>

      <Button href={url} style={buttonStyle}>
        Start now?
      </Button>

      <Text>
        if you didn't forget your password please ignore this message.
      </Text>
    </Layout>
  );
}

module.exports = ResetPassword;
