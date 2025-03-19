import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import dbConnection from "./utils/index.js";
import { errorHandler, routenotfound } from "./middlewares/errorMiddleware.js";
import routes from "./routes/index.js";
import path from "path";



dotenv.config();

dbConnection();


 const PORT = process.env.PORT || 5000;

 const app = express();

 const _dirname = path.resolve();
 

 app.use(cors({
    origin: ["http://localhost:3000" , "http://localhost:3001", 'https://full-stack-taskmanager-application-2.onrender.com' , ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
 }));
 app.use(express.json());
 app.use(express.urlencoded(({extended: true})));
 app.use(cookieParser());
 app.use(morgan("dev"));

 app.use("/api", routes);
  
 app.use(express.static(path.join(_dirname, "/Client/dist")));
 app.get("*", (req, res) => {
        res.sendFile(path.resolve(_dirname, "Client" , "dist" , "index.html"));

 })

 app.use(routenotfound);
 app.use(errorHandler);




 app.listen(PORT, () => {
     console.log(`Server is running on port ${PORT}`);
 });