import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import awsExports from '@/aws-exports';

Amplify.configure(awsExports);

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