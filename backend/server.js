import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import productRoutes from "./routes/productRouters.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
const port = process.env.PORT || 5000;

connectDB(); // Connect to MongoDB

const app = express();

//Body parser middelware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Cookie parser middleware
app.use(cookieParser());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

const _dirname = path.resolve(); //Set _dirname to current directory
app.use("/uploads", express.static(path.join(_dirname, "/uploads")));

if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static(path.join(_dirname, "/frontend/build")));

  // any route that is not api will be redirected to index.html
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(_dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is runnig...");
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));