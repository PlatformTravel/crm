// import { config as cfg } from "https://deno.land/std/dotenv/mod.ts"; 
// export const config = cfg();

// // export const config = {
// //   MONGODB_URI: Deno.env.get("MONGODB_URI"),
// //   FRONTEND_URL: Deno.env.get("FRONTEND_URL"),
// // };

export const config = {
  MONGODB_URI: Deno.env.get("MONGODB_URI"),
  MONGODB_DB: Deno.env.get("MONGODB_DB"),
  BACKEND_URL: Deno.env.get("FRONTEND_URL"),
};

// import { load } from "https://deno.land/std/dotenv/mod.ts";

// export const config = await load({
//   envPath: new URL('./.env', import.meta.url),
//   export: true,
// });