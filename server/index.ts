import cors from "cors"
import express from "express";

import router from "./routes";



const app = express();
app.use(cors({
  origin: '*'
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const PORT = 8080
app.use(router);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
