import { app } from "./app";
import dotenv from "dotenv";
import { sequelize } from "./infra/database/sequelize";
import "./infra/database/sequelize/models/user";

dotenv.config();

const port = process.env.PORT || 3000;

async function bootstrap() {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    await sequelize.sync();
    console.log("Database synchronized");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
}

bootstrap();
