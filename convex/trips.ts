import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveTrip = mutation({
  args: {
    tripId: v.string(),
    userEmail: v.string(),
    tripData: v.any(),
    userSelection: v.any(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("TripTable")
      .withIndex("by_user", (q) => q.eq("userEmail", args.userEmail))
      .filter((q) => q.eq(q.field("tripId"), args.tripId))
      .first();

    if (existing) {
      return await ctx.db.patch(existing._id, args);
    }
    return await ctx.db.insert("TripTable", args);
  },
});

export const getTrip = query({
  args: { tripId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("TripTable")
      .filter((q) => q.eq(q.field("tripId"), args.tripId))
      .first();
  },
});
export const getUserTrips = query({
  args: { userEmail: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("TripTable")
      .withIndex("by_user", (q) => q.eq("userEmail", args.userEmail))
      .collect();
  },
});
