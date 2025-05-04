import { pgTable, text, serial, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from 'zod';

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Müttefikler (Allies) table
export const muteffikler = pgTable("muteffikler", {
  id: serial("id").primaryKey(),
  isim: text("isim").notNull().unique(),
  tur: text("tur").notNull(), // "Klan" or "Oyuncu"
  bilgi: text("bilgi"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const muteffiklerInsertSchema = createInsertSchema(muteffikler, {
  isim: (schema) => schema.min(1, "İsim belirtilmelidir"),
  tur: (schema) => schema.min(1, "Tür belirtilmelidir")
});

export type MuteffikInsert = z.infer<typeof muteffiklerInsertSchema>;
export type Muteffikler = typeof muteffikler.$inferSelect;

// Düşmanlar (Enemies) table
export const dusmanlar = pgTable("dusmanlar", {
  id: serial("id").primaryKey(),
  isim: text("isim").notNull().unique(),
  tur: text("tur").notNull(), // "Klan" or "Oyuncu"
  neden: text("neden"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const dusmanlarInsertSchema = createInsertSchema(dusmanlar, {
  isim: (schema) => schema.min(1, "İsim belirtilmelidir"),
  tur: (schema) => schema.min(1, "Tür belirtilmelidir")
});

export type DusmanInsert = z.infer<typeof dusmanlarInsertSchema>;
export type Dusmanlar = typeof dusmanlar.$inferSelect;

// AS Kadro (Team Members) table
export const asKadro = pgTable("as_kadro", {
  id: serial("id").primaryKey(),
  isim: text("isim").notNull().unique(),
  rol: text("rol").notNull(),
  girisTarihi: text("giris_tarihi").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const asKadroInsertSchema = createInsertSchema(asKadro, {
  isim: (schema) => schema.min(1, "İsim belirtilmelidir"),
  rol: (schema) => schema.min(1, "Rol belirtilmelidir"),
  girisTarihi: (schema) => schema.min(1, "Giriş tarihi belirtilmelidir")
});

export type AsKadroInsert = z.infer<typeof asKadroInsertSchema>;
export type AsKadro = typeof asKadro.$inferSelect;

// KS Bilgi (Clan Info) table
export const ksBilgi = pgTable("ks_bilgi", {
  id: serial("id").primaryKey(),
  baslik: text("baslik").notNull().unique(),
  bilgi: text("bilgi").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const ksBilgiInsertSchema = createInsertSchema(ksBilgi, {
  baslik: (schema) => schema.min(1, "Başlık belirtilmelidir"),
  bilgi: (schema) => schema.min(1, "Bilgi belirtilmelidir")
});

export type KsBilgiInsert = z.infer<typeof ksBilgiInsertSchema>;
export type KsBilgi = typeof ksBilgi.$inferSelect;

// Sunucular (Servers) table
export const sunucular = pgTable("sunucular", {
  id: serial("id").primaryKey(),
  isim: text("isim").notNull().unique(),
  ip: text("ip").notNull(),
  port: text("port"),
  bilgi: text("bilgi"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const sunucularInsertSchema = createInsertSchema(sunucular, {
  isim: (schema) => schema.min(1, "İsim belirtilmelidir"),
  ip: (schema) => schema.min(1, "IP belirtilmelidir")
});

export type SunucuInsert = z.infer<typeof sunucularInsertSchema>;
export type Sunucular = typeof sunucular.$inferSelect;
