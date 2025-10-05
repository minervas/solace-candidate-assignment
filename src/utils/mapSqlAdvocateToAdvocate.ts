import { Advocate, SqlAdvocate } from "@/db/schema";

/**
 * Maps raw SQL column names to Advocate interface property names
 */
export function mapSqlAdvocateToAdvocate(sqlAdvocate: SqlAdvocate): Advocate {
  return {
    id: sqlAdvocate.id,
    firstName: sqlAdvocate.first_name,
    lastName: sqlAdvocate.last_name,
    city: sqlAdvocate.city,
    degree: sqlAdvocate.degree,
    specialties: JSON.parse(sqlAdvocate.payload) ?? [],
    yearsOfExperience: sqlAdvocate.years_of_experience,
    phoneNumber: sqlAdvocate.phone_number,
    createdAt: sqlAdvocate.created_at,
  };
}
