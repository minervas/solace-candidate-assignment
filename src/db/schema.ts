import { InferSelectModel, sql } from "drizzle-orm";
import {
  pgTable,
  integer,
  text,
  jsonb,
  serial,
  timestamp,
  bigint,
} from "drizzle-orm/pg-core";

const advocates = pgTable("advocates", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  city: text("city").notNull(),
  degree: text("degree").notNull(),
  specialties: jsonb("payload").default([]).notNull(),
  yearsOfExperience: integer("years_of_experience").notNull(),
  phoneNumber: bigint("phone_number", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// extending to make db.execute template type work
export interface SqlAdvocate extends Record<string, unknown> {
  id: number;
  first_name: string;
  last_name: string;
  city: string;
  degree: string;
  payload: string; // JSONB column
  years_of_experience: number;
  phone_number: number;
  created_at: Date;
}

export interface Advocate extends Omit<InferSelectModel<typeof advocates>, 'specialties'> { specialties: string[] };

export { advocates };
