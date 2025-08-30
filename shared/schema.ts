import { pgTable, text, serial, integer, boolean, decimal, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderId: text("order_id").notNull().unique(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  merchantName: text("merchant_name").notNull(),
  description: text("description"),
  customerEmail: text("customer_email").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  transactionId: text("transaction_id").notNull().unique(),
  orderId: text("order_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  upiApp: text("upi_app"),
  paymentMethod: text("payment_method").notNull().default("UPI"),
  customerEmail: text("customer_email"),
  merchantName: text("merchant_name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  keyId: text("key_id").notNull().unique(),
  name: text("name").notNull(),
  status: text("status").notNull().default("active"),
  permissions: text("permissions").array().notNull().default(['read']),
  lastUsed: timestamp("last_used"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// User schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Order schemas  
export const insertOrderSchema = createInsertSchema(orders).pick({
  orderId: true,
  amount: true,
  merchantName: true,
  description: true,
  customerEmail: true,
});

// Transaction schemas
export const insertTransactionSchema = createInsertSchema(transactions).pick({
  transactionId: true,
  orderId: true,
  amount: true,
  upiApp: true,
  customerEmail: true,
  merchantName: true,
});

// API Key schemas
export const insertApiKeySchema = createInsertSchema(apiKeys).pick({
  keyId: true,
  name: true,
  permissions: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

export type InsertApiKey = z.infer<typeof insertApiKeySchema>;
export type ApiKey = typeof apiKeys.$inferSelect;
