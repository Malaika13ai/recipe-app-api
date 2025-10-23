import express from "express";
import { ENV } from "./src/config/env.js";
import { db } from "./src/config/db.js";
import { favoritesTable } from "./src/db/schema.js";
import bodyParser from "body-parser";
import { and, eq } from "drizzle-orm";
import cors from "cors"

const app = express();
const PORT = ENV.PORT || 5001;

app.use(express.json()); //if we dont use this the object variables in api is gonna be undefined
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true });
});

app.post("/api/favorites", async (req, res) => {
  try {
    const { userId, recipeId, title, image, cookTime, servings } = req.body;
    if (!userId || !recipeId || !title) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newFavorite = await db
      .insert(favoritesTable)
      .values({ userId, recipeId, title, image, cookTime, servings })
      .returning();

    res.status(201).json(newFavorite[0]);
  } catch (error) {
    console.log("Error while adding favorite");
    res.status(500).json({ error: "Something went wrong" });
  }
});



app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
  try {
    const { userId, recipeId } = req.params;

    await db
      .delete(favoritesTable)
      .where(
        and(
          eq(favoritesTable.userId, userId),
          eq(favoritesTable.recipeId, parseInt(recipeId))
        )
      );

      res.status(200).json({message: "Favorite removed successfully"});

  } catch (error) {
    console.log("Error while deleting favorite");
    res.status(500).json({ error: "Something went wrong" });
  }
});



app.get("/api/favorites/:userId", async(req,res)=>{
    try {
        const {userId} = req.params;
     const userFavorites =   await db.select().from(favoritesTable).where(eq(favoritesTable.userId, userId))
   
     res.status(200).json(userFavorites);

    } catch (error) {
        
    console.log("Error fetching favorite");
    res.status(500).json({error:"Something went wrong"})

    }
})



app.listen(5001, () => {
  console.log(`server is running on PORT ${PORT}`);
});
