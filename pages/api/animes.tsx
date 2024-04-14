import clientPromise from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => 
{
try{
    const client = await clientPromise;
    const db = client.db("test");
    const animes = await db
        .collection("animes")
        .find({})
        .toArray();
    res.json(animes);
} catch (e) {
    console.error(e);
    res.status(500).json({ error: "Unable to fetch animes" });
}
if (req.method === "POST") {
    try{
        const client = await clientPromise;
        const db = client.db("test");
        const animes = await db
            .collection("animes")
            .insertOne(req.body);
        res.json(animes);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: "Unable to insert anime" });
    }
}
const animeId = req.query.id;
if (req.method === 'PUT') {
    try {
      const client = await clientPromise;
      const db = client.db("test");

      // Pobierz dane zaktualizowanego anime z ciała żądania
      const { title, studio, release } = req.body;

      // Zaktualizuj anime w bazie danych na podstawie jego identyfikatora
      const result = await db.collection("animes").updateOne(
        { _id: animeId },
        { $set: { title, studio, release } }
      );
      res.status(200).json({ success: true, info: result });

} catch (e) {
    console.error(e);
    res.status(500).json({ error: "Unable to update anime" });
}
}
const { id } = req.query;
if (req.method === "DELETE") {
    try {
        const client = await clientPromise;
        const db = client.db("test");
        const result = await db.collection("animes").deleteOne({ _id: id });
        res.status(200).json({ success: true, info: result });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Unable to delete anime" });
    }
}
};