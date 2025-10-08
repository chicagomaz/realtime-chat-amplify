import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';

// Gen 2: amplify_outputs.json is auto-generated during deployment
// For local dev, you can run `npx ampx sandbox` to generate it
let outputs = {};
try {
  outputs = require('../../amplify_outputs.json');
} catch (e) {
  console.warn('amplify_outputs.json not found - Amplify backend may not be configured');
}

Amplify.configure(outputs);

export const client = generateClient();

export const getCurrentAuthenticatedUser = async () => {
  try {
    const user = await getCurrentUser();
    return user;
  } catch (error) {
    return null;
  }
};

export { Amplify };