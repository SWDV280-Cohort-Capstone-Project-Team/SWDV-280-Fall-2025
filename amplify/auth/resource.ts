import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: 'CODE',
      verificationEmailSubject: 'Verify your email for appointment booking',
      verificationEmailBody: (createCode) => 
        `Your verification code is: ${createCode()}. Use this code to verify your email and book appointments.`,
    },
  },
  userAttributes: {
    email: {
      required: true,
      mutable: true,
    },
  },
});
