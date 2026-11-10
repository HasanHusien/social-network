import type { Server } from "node:http";

export const handleUncaughtException = () => {
  process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception!, Shutting down....");
    console.log(err.name, err.message);
    process.exit(1);
  });
};
export const handleUnhandledRejection = (server: Server) => {
  process.on("unhandledRejection", (err: any) => {
    console.log("Unhandled Rejection!, Shutting down....");
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
};
