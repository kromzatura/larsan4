import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Tailwind,
} from "@react-email/components";

interface ContactFormEmailProps {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

const ContactFormEmail = ({
  firstName,
  lastName,
  email,
  message,
}: ContactFormEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        New contact form submission from {firstName} {lastName}
      </Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                primary: "#111827",
              },
            },
          },
        }}
      >
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-[40px] p-[20px] max-w-[600px]">
            <Section className="bg-white">
              {/* Header */}
              <Section className="bg-white p-[32px] text-center">
                <Heading className="text-primary text-[24px] font-bold m-0">
                  New Contact Form Submission
                </Heading>
              </Section>
              <Hr className="my-0" />

              {/* Content */}
              <Section>
                {/* Name Block */}
                <Section className="bg-white pl-[16px]">
                  <Text className="text-[16px] font-bold text-primary m-0">
                    Name
                  </Text>
                </Section>
                <Hr className="my-0" />
                <Section className="bg-white p-[12px]">
                  <Text className="text-[16px] text-gray-700 m-0">
                    {firstName} {lastName}
                  </Text>
                </Section>
                <Hr className="my-0" />

                {/* Email Block */}
                <Section className="bg-white pl-[16px]">
                  <Text className="text-[16px] font-bold text-primary m-0">
                    Email Address
                  </Text>
                </Section>
                <Hr className="my-0" />
                <Section className="bg-white p-[12px]">
                  <Text className="text-[16px] text-gray-700 m-0">{email}</Text>
                </Section>
                <Hr className="my-0" />

                {/* Message Block */}
                <Section className="bg-white pl-[16px]">
                  <Text className="text-[16px] font-bold text-primary m-0">
                    Message
                  </Text>
                </Section>
                <Hr className="my-0" />
                <Section className="bg-white p-[12px]">
                  <Text className="text-[16px] text-gray-700">{message}</Text>
                </Section>
                <Hr className="my-0" />

                <Section className="text-center bg-gray-50">
                  <Text className="text-[14px] text-gray-500 m-0">
                    This is an automated email sent from your contact form.
                  </Text>
                </Section>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ContactFormEmail.PreviewProps = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  message:
    "Hello,\n\nI'm interested in learning more about your services. Could you please provide additional information?\n\nThank you,\nJohn",
};

export default ContactFormEmail;
