"use client";

import { Account, Client, Databases, ID, Storage } from "appwrite";

export const appwriteConfig = {
  endpoint:
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "https://cloud.appwrite.io/v1",
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "",
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "poonam_attire",
  productsCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID ?? "products",
  ordersCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID ?? "orders",
  usersCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID ?? "customers",
  bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID ?? "product_images",
};

export const appwriteClient = new Client().setEndpoint(appwriteConfig.endpoint);

if (appwriteConfig.projectId) {
  appwriteClient.setProject(appwriteConfig.projectId);
}

export const account = new Account(appwriteClient);
export const databases = new Databases(appwriteClient);
export const storage = new Storage(appwriteClient);
export { ID };

export function isAppwriteConfigured() {
  return Boolean(appwriteConfig.projectId);
}
