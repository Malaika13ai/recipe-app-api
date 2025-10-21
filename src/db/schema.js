import {pgTable,serial,text, timestamp, integer } from "drizzle-orm/pg-core"

 // drizzle-orm : It’s a programming technique that allows developers to interact with a database using objects instead of writing raw SQL queries.

 export const favoritesTable = pgTable("favorites", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    recipeId: integer("recipe_id").notNull(),
    title: text("title").notNull(),
    image: text("image"),
    cookTime: text("cook_time"),
    servings: text("servings"),
    createdAt: timestamp("created_at").defaultNow()
 })