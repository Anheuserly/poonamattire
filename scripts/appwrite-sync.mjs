import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();

function loadEnv(file) {
  const target = path.join(cwd, file);
  if (!fs.existsSync(target)) return {};
  return Object.fromEntries(
    fs
      .readFileSync(target, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const index = line.indexOf("=");
        const key = line.slice(0, index).trim();
        const value = line.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
        return [key, value];
      }),
  );
}

const env = {
  ...loadEnv(".env"),
  ...loadEnv(".env.local"),
  ...process.env,
};

const endpoint = (env.APPWRITE_ENDPOINT || env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "").replace(/\/$/, "");
const projectId = env.APPWRITE_PROJECT_ID || env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "";
const apiKey = env.APPWRITE_API_KEY || "";
const databaseId = env.APPWRITE_DATABASE_ID || env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "poonam_attire";
const productsCollectionId =
  env.APPWRITE_PRODUCTS_COLLECTION_ID || env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID || "products";
const ordersCollectionId =
  env.APPWRITE_ORDERS_COLLECTION_ID || env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID || "orders";
const customersCollectionId =
  env.APPWRITE_USERS_COLLECTION_ID || env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || "customers";
const bucketId = env.APPWRITE_BUCKET_ID || env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || "product_images";

const missing = [];
if (!endpoint) missing.push("APPWRITE_ENDPOINT");
if (!projectId) missing.push("APPWRITE_PROJECT_ID");
if (!apiKey) missing.push("APPWRITE_API_KEY");

if (missing.length) {
  console.log("Appwrite sync skipped. Missing:", missing.join(", "));
  console.log("Create .env.local from .env.example, then run npm run appwrite:sync again.");
  process.exit(0);
}

const headers = {
  "Content-Type": "application/json",
  "X-Appwrite-Project": projectId,
  "X-Appwrite-Key": apiKey,
};

async function request(pathname, options = {}) {
  const res = await fetch(`${endpoint}${pathname}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });
  const text = await res.text();
  const body = text ? JSON.parse(text) : null;
  if (!res.ok && res.status !== 409) {
    throw new Error(`${options.method || "GET"} ${pathname} failed: ${res.status} ${text}`);
  }
  return { status: res.status, body };
}

async function ensureDatabase() {
  const result = await request(`/databases`, {
    method: "POST",
    body: JSON.stringify({ databaseId, name: "Poonam Attire" }),
  });
  console.log(result.status === 409 ? "Database exists" : "Database created");
}

async function ensureCollection(collectionId, name) {
  const result = await request(`/databases/${databaseId}/collections`, {
    method: "POST",
    body: JSON.stringify({
      collectionId,
      name,
      permissions: ['read("any")'],
      documentSecurity: true,
    }),
  });
  console.log(result.status === 409 ? `${name} collection exists` : `${name} collection created`);
}

async function ensureString(collectionId, key, size, required = false) {
  const result = await request(
    `/databases/${databaseId}/collections/${collectionId}/attributes/string`,
    {
      method: "POST",
      body: JSON.stringify({ key, size, required }),
    },
  );
  console.log(result.status === 409 ? `Attribute ${collectionId}.${key} exists` : `Attribute ${collectionId}.${key} created`);
}

async function ensureInteger(collectionId, key, required = false) {
  const result = await request(
    `/databases/${databaseId}/collections/${collectionId}/attributes/integer`,
    {
      method: "POST",
      body: JSON.stringify({ key, required }),
    },
  );
  console.log(result.status === 409 ? `Attribute ${collectionId}.${key} exists` : `Attribute ${collectionId}.${key} created`);
}

async function ensureFloat(collectionId, key, required = false) {
  const result = await request(
    `/databases/${databaseId}/collections/${collectionId}/attributes/float`,
    {
      method: "POST",
      body: JSON.stringify({ key, required }),
    },
  );
  console.log(result.status === 409 ? `Attribute ${collectionId}.${key} exists` : `Attribute ${collectionId}.${key} created`);
}

async function ensureBucket() {
  const result = await request(`/storage/buckets`, {
    method: "POST",
    body: JSON.stringify({
      bucketId,
      name: "Product Images",
      permissions: ['read("any")'],
      fileSecurity: false,
      maximumFileSize: 8000000,
      allowedFileExtensions: ["jpg", "jpeg", "png", "webp"],
    }),
  });
  console.log(result.status === 409 ? "Storage bucket exists" : "Storage bucket created");
}

await ensureDatabase();
await ensureCollection(productsCollectionId, "Products");
await ensureString(productsCollectionId, "name", 160, true);
await ensureString(productsCollectionId, "slug", 160, true);
await ensureString(productsCollectionId, "category", 80, true);
await ensureString(productsCollectionId, "fabric", 80, false);
await ensureString(productsCollectionId, "color", 80, false);
await ensureString(productsCollectionId, "image", 800, false);
await ensureString(productsCollectionId, "description", 1200, false);
await ensureInteger(productsCollectionId, "price", true);
await ensureInteger(productsCollectionId, "mrp", false);
await ensureFloat(productsCollectionId, "rating", false);

await ensureCollection(ordersCollectionId, "Orders");
await ensureString(ordersCollectionId, "orderId", 80, true);
await ensureString(ordersCollectionId, "customerEmail", 160, true);
await ensureString(ordersCollectionId, "status", 80, true);
await ensureString(ordersCollectionId, "items", 1200, true);
await ensureString(ordersCollectionId, "eta", 120, false);
await ensureInteger(ordersCollectionId, "total", true);

await ensureCollection(customersCollectionId, "Customers");
await ensureString(customersCollectionId, "name", 160, true);
await ensureString(customersCollectionId, "email", 160, true);
await ensureString(customersCollectionId, "phone", 40, false);
await ensureString(customersCollectionId, "defaultAddress", 1200, false);

await ensureBucket();
console.log("Appwrite sync complete.");
