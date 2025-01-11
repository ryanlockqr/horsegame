import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: 'horseSkins',  // Define the bucket name here
  access: (allow) => ({
    'horseSkins/*': [
      allow.guest.to(['read']), // Allow guests to read horse images
    ],
  }),
});
