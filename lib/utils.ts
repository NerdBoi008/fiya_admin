import { QueryParams } from "@/types";
import { clsx, type ClassValue } from "clsx"
import { createHash } from "crypto";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Builds a URL with query parameters appended to it.
 *
 * @template T - A type extending a record of key-value pairs where the value can be
 *               a string, number, boolean, null, or undefined.
 * @param url - The base URL to which query parameters should be appended.
 * @param queryParams - An object representing query parameters as key-value pairs.
 *                      Keys are parameter names, and values are parameter values.
 *                      Values that are `null` or `undefined` are ignored.
 * @returns The complete URL with query parameters appended as a query string.
 *
 * @example
 * // Basic usage with valid query parameters
 * const baseUrl = 'https://api.example.com/resource';
 * const params = { search: 'test', page: 2, showAll: true, filter: null };
 * const fullUrl = buildUrl(baseUrl, params);
 * // fullUrl: "https://api.example.com/resource?search=test&page=2&showAll=true"
 *
 * @example
 * // Handling undefined values
 * const baseUrl = 'https://api.example.com/resource';
 * const params = { search: undefined, page: 1 };
 * const fullUrl = buildUrl(baseUrl, params);
 * // fullUrl: "https://api.example.com/resource?page=1"
 *
 * @throws {TypeError} If the provided URL is not a valid string or cannot be parsed.
 */
export function buildUrl<T extends QueryParams>(url: string, queryParams: T): string {
  const urlObject = new URL(url, window.location.origin); // Ensures base URL is valid

  Object.entries(queryParams)
    .filter(([, value]) => value !== undefined && value !== null) // Removes `undefined` or `null` values
    .forEach(([key, value]) => {
      urlObject.searchParams.append(key, String(value)); // Converts to string
    });

  return urlObject.toString();
}

/**
 * Generates a deterministic SHA-256 hash for a given string.
 * @param value - The input string to hash.
 * @returns The SHA-256 hash in hexadecimal format.
 */
export const generateHash = (value: string): string => {
  if (typeof value !== 'string') {
    throw new TypeError('Input must be a string');
  }

  return createHash('sha256').update(value).digest('hex');
};