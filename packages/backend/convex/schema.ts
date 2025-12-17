import { defineSchema,defineTable } from "convex/server";
import { v } from "convex/values";

//defining the schema

export default defineSchema({
    users:defineTable({
        name:v.string(),
    }),
});