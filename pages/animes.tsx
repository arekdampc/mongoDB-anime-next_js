import React, { useState, useEffect } from "react";
import clientPromise from "../lib/mongodb";
import { GetServerSideProps } from 'next';
import { ObjectId } from "mongodb";

interface Anime {
  _id: string;
  title: string;
  studio: string;
  release: number;
}

interface AnimesProps {
  animes: Anime[];
}

const Animes: React.FC<AnimesProps> = ({ animes }) => {
  const [newAnime, setNewAnime] = useState({
    _id: '',
    title: '',
    studio: '',
    release: 0,
  });

  const handleUpdateAnime = async (id: string) => {
    // Implementacja aktualizacji anime
  };

  const handleDeleteAnime = async (id: string) => {
    try {
      const response = await fetch(`/api/animes/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Anime deleted successfully');
        // Tutaj możesz zaktualizować stan animes, aby odświeżyć listę anime
      } else {
        console.error('Failed to delete anime:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting anime:', error);
    }
  };

  return (
    <div>
      <h1>Animes</h1>
      <ul>
        {animes.map((anime) => (
          <li key={anime._id}>
            <h2>{anime.title}</h2>
            <p>Studio: {anime.studio}</p>
            <p>Release: {anime.release}</p>
            <button onClick={() => handleUpdateAnime(anime._id)}>Edit</button>
            <button onClick={() => handleDeleteAnime(anime._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Animes;

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    const animes = await db
      .collection("animes")
      .find({})
      .toArray();
    return { props: { animes: JSON.parse(JSON.stringify(animes)) } };
  } catch (e) {
    console.error(e);
    return {
      props: { animes: [] }
    }
  }
};
