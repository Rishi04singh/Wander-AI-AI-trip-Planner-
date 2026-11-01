import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const CreateNewUser = mutation({
  args: {
    name: v.string(),
    imageUrl: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("UserTable")
      .filter((q) => q.eq("email", args.email))
      .collect();

    if (user.length === 0) {
      const userData = {
        name: args.name,
        imageUrl: args.imageUrl,
        email: args.email,
        subscribed: false,
      };
      // if not exist then create new user
      const id = await ctx.db.insert("UserTable", userData);
      return { ...userData, _id: id };
    }
    return user[0];
  },
});

export const UpdateUserSubscription = mutation({
  args: {
    email: v.string(),
    subscribed: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("UserTable")
      .filter((q) => q.eq("email", args.email))
      .first();

    if (user) {
      await ctx.db.patch(user._id, {
        subscribed: args.subscribed,
      });
      return { ...user, subscribed: args.subscribed };
    }
    return null;
  },
});

export const GetUserDetail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("UserTable")
      .filter((q) => q.eq("email", args.email))
      .first();
    return user;
  },
});
