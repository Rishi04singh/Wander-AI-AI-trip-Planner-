import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  UserTable: defineTable({
    name: v.string(),
    imageUrl: v.string(),
    email: v.string(),
    subscribed:v.optional(v.boolean()),
  }),
  TripTable: defineTable({
    tripId: v.string(),
    userEmail: v.string(),
    tripData: v.any(), // JSON from AI
    userSelection: v.any(), // Origin, destination, travelers, etc.
  }).index("by_user", ["userEmail"]),
});