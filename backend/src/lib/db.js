import mongoose from "mongoose";
import dns from "node:dns";
import { ENV } from "./env.js";

const configureMongoDns = () => {
  if (!ENV.MONGO_URI?.startsWith("mongodb+srv://")) return;

  dns.setDefaultResultOrder("ipv4first");

  const dnsServers = (ENV.MONGO_DNS_SERVERS || "8.8.8.8,1.1.1.1")
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  if (dnsServers.length > 0) {
    dns.setServers(dnsServers);
  }
};

export const connectDB = async () => {
  try {
    const { MONGO_URI } = ENV;
    if (!MONGO_URI) throw new Error("MONGO_URI is not set");

    configureMongoDns();

    const conn = await mongoose.connect(ENV.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });
    console.log("MONGODB CONNECTED:", conn.connection.host);
  } catch (error) {
    console.error("Error connection to MONGODB:", error);
    process.exit(1); // 1 status code means fail, 0 means success
  }
};
