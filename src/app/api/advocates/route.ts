import db from "../../../db";
import { advocates } from "../../../db/schema";
// uncomment to use static data
// import { advocateData } from "../../../db/seed/advocates";

export async function GET() {
  // Uncomment this line to use a database
  const data = await db.select().from(advocates);
  // uncomment to use static data
  // const data = advocateData;

  return Response.json({ data });
}
