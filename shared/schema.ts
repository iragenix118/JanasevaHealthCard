import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  email: text("email"),
});

export const healthCards = pgTable("health_cards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  tier: text("tier").notNull(),
  monthlyPremium: integer("monthly_premium").notNull(),
  benefits: json("benefits").$type<string[]>().notNull(),
  coverageLimit: integer("coverage_limit").notNull(),
  description: text("description").notNull(),
});

export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  services: json("services").$type<string[]>().notNull(),
});

export const userCards = pgTable("user_cards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  cardId: integer("card_id").notNull(),
  status: text("status").notNull(),
  appliedAt: text("applied_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users);
export const insertHealthCardSchema = createInsertSchema(healthCards);
export const insertPartnerSchema = createInsertSchema(partners);
export const insertUserCardSchema = createInsertSchema(userCards);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type HealthCard = typeof healthCards.$inferSelect;
export type Partner = typeof partners.$inferSelect;
export type UserCard = typeof userCards.$inferSelect;
