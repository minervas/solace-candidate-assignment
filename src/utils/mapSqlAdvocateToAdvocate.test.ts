import { describe, it, expect } from "vitest";
import { mapSqlAdvocateToAdvocate } from "./mapSqlAdvocateToAdvocate";
import { SqlAdvocate } from "@/db/schema";

describe("mapSqlAdvocateToAdvocate", () => {
  it("maps SQL column names to Advocate property names", () => {
    const sqlAdvocate: SqlAdvocate = {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      city: "San Francisco",
      degree: "JD",
      payload: `["Family Law", "Criminal Law"]`,
      years_of_experience: 5,
      phone_number: 4155551234,
      created_at: new Date("2024-01-01"),
    };

    const result = mapSqlAdvocateToAdvocate(sqlAdvocate);

    expect(result).toEqual({
      id: 1,
      firstName: "John",
      lastName: "Doe",
      city: "San Francisco",
      degree: "JD",
      specialties: ["Family Law", "Criminal Law"],
      yearsOfExperience: 5,
      phoneNumber: 4155551234,
      createdAt: new Date("2024-01-01"),
    });
  });

  it("converts non-array payload to empty array", () => {
    const sqlAdvocate: SqlAdvocate = {
      id: 5,
      first_name: "Charlie",
      last_name: "Brown",
      city: "Seattle",
      degree: "JD",
      payload: null as any,
      years_of_experience: 7,
      phone_number: 2065551234,
      created_at: new Date("2023-01-10"),
    };

    const result = mapSqlAdvocateToAdvocate(sqlAdvocate);

    expect(result.specialties).toEqual([]);
    expect(Array.isArray(result.specialties)).toBe(true);
  });
});
