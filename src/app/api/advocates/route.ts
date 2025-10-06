import { mapSqlAdvocateToAdvocate } from "@/utils/mapSqlAdvocateToAdvocate";
import db from "../../../db";
import { advocates, SqlAdvocate, Advocate } from "../../../db/schema";
import { sql } from "drizzle-orm";

export interface SqlAdvocateWithCount extends SqlAdvocate {
  total_count: bigint;
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface AdvocatesResponse {
  data: Advocate[];
  pagination: PaginationMetadata;
}

const MAX_LIMIT = 100;

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  if (isNaN(page) || page < 1) {
    return Response.json(
      { 
        error: "Invalid page parameter",
        message: "Page must be a positive integer"
      },
      { status: 400 }
    );
  }
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  // limit must be between 1 and 100
  if (isNaN(limit) || limit < 1 || limit > MAX_LIMIT) {
    return Response.json(
      { error: `Invalid limit parameter. Must be between 1 and ${MAX_LIMIT}` },
      { status: 400 }
    );
  }
  
  const offset = (page - 1) * limit;

  try {
    const results = await db.execute<SqlAdvocateWithCount>(sql`
      SELECT 
        *,
        COUNT(*) OVER() as total_count
      FROM ${advocates}
      ORDER BY last_name, first_name
      LIMIT ${limit}
      OFFSET ${offset}
    `);

    const pageOfData = results.map(({ total_count, ...row }) => mapSqlAdvocateToAdvocate(row));
    const total = results.length > 0 ? Number(results[0].total_count) : 0;
    const totalPages = Math.ceil(total / limit);

    const responseData: AdvocatesResponse = {
      data: pageOfData,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };

    return Response.json(responseData);
  } catch (error) {
    console.error('Database error:', error);
    return Response.json(
      { error: 'Failed to fetch advocates' },
      { status: 500 }
    );
  }
}
