import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const restaurants = sqliteTable("restaurants", {
  id: text("id").primaryKey(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  pinSalt: text("pin_salt").notNull(),
  pinHash: text("pin_hash").notNull(),
  createdAt: text("created_at").notNull(),
}, (table) => [uniqueIndex("restaurants_code_unique").on(table.code)]);

export const cycles = sqliteTable("cycles", {
  id: text("id").primaryKey(),
  restaurantId: text("restaurant_id").notNull(),
  number: integer("number").notNull(),
  status: text("status").notNull(),
  startedAt: text("started_at").notNull(),
  endedAt: text("ended_at"),
}, (table) => [
  uniqueIndex("cycles_restaurant_number_unique").on(table.restaurantId, table.number),
  index("cycles_restaurant_status_idx").on(table.restaurantId, table.status),
]);

export const pickupRecords = sqliteTable("pickup_records", {
  id: text("id").primaryKey(),
  restaurantId: text("restaurant_id").notNull(),
  cycleId: text("cycle_id").notNull(),
  pickupNumber: integer("pickup_number").notNull(),
  status: text("status").notNull(),
  recordedAt: text("recorded_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  collectedAt: text("collected_at"),
}, (table) => [
  uniqueIndex("pickup_records_cycle_number_unique").on(table.cycleId, table.pickupNumber),
  index("pickup_records_restaurant_idx").on(table.restaurantId),
]);

export const sessions = sqliteTable("sessions", {
  token: text("token").primaryKey(),
  restaurantId: text("restaurant_id").notNull(),
  expiresAt: text("expires_at").notNull(),
});

export const loginAttempts = sqliteTable("login_attempts", {
  key: text("key").primaryKey(),
  failedCount: integer("failed_count").notNull(),
  windowStartedAt: text("window_started_at").notNull(),
  lockedUntil: text("locked_until"),
});

export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey(),
  restaurantId: text("restaurant_id").notNull(),
  cycleId: text("cycle_id"),
  pickupNumber: integer("pickup_number"),
  action: text("action").notNull(),
  oldStatus: text("old_status"),
  newStatus: text("new_status"),
  createdAt: text("created_at").notNull(),
}, (table) => [index("audit_logs_restaurant_idx").on(table.restaurantId)]);
