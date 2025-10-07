import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'chatAppStorage',
  access: (allow) => ({
    'profile-pictures/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.guest.to(['read'])
    ],
    'chat-attachments/*': [
      allow.authenticated.to(['read', 'write', 'delete'])
    ],
  })
});
