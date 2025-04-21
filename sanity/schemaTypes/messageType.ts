import { defineType } from "sanity";
import {EnvelopeIcon} from '@sanity/icons'

// schemas/message.ts
export const messageType = defineType ({
  name: "message",
  title: "Message",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "phone",
      title: "Phone Number",
      type: "string",
      validation: (Rule) => Rule.required(), // Remove regex validation
    },
    {
      name: "message",
      title: "Message",
      type: "text",
      validation: (Rule) => Rule.optional(), // Make message optional
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      options: {
        dateFormat: "YYYY-MM-DD",
        timeFormat: "HH:mm:ss",
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "userId",
      title: "User ID",
      type: "string",
      description: "The ID of the user who sent the message (optional)",
    },
  ],
});
  export default messageType;