import { Query } from "mongoose";

export interface ApiQueryString {
  page?: string;
  limit?: string;
  sort?: string;
  fields?: string;
  [key: string]: unknown; // likes[gte]=5
}

const EXCLUDED_FIELDS = ["page", "limit", "sort", "fields"] as const;

export const apiFeatures = <T>(
  query: Query<T[], T>,
  queryString: ApiQueryString,
): Query<T[], T> => {
  // 1. Filter
  const filters: Record<string, unknown> = { ...queryString };
  EXCLUDED_FIELDS.forEach((field) => delete filters[field]);

  const filterStr = JSON.stringify(filters).replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`,
  );
  query = query.find(JSON.parse(filterStr));

  // 2. Sort
  const sortBy = queryString.sort
    ? queryString.sort.split(",").join(" ")
    : "-createdAt";
  query = query.sort(sortBy);

  // 3. Fields
  const fields = queryString.fields
    ? queryString.fields.split(",").join(" ")
    : "-__v";
  query = query.select(fields);

  // 4. Pagination
  const page = Number(queryString.page) || 1;
  const limit = Number(queryString.limit) || 100;
  query = query.skip((page - 1) * limit).limit(limit);

  return query;
};

/*

GET http://localhost:3000/api/posts
GET http://localhost:3000/api/posts?likes[gte]=10
GET http://localhost:3000/api/posts?sort=-likes,createdAt
GET http://localhost:3000/api/posts?fields=title,likes
GET http://localhost:3000/api/posts?page=2&limit=5
GET http://localhost:3000/api/posts?likes[gte]=10&sort=-likes&fields=title,likes&page=1&limit=3

*/
