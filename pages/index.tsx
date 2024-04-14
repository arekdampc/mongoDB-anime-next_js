import React, { useState } from "react";
import clientPromise from "../lib/mongodb";
import { GetServerSideProps } from 'next';
import Link from "next/link";

import '../bulma/css/bulma.min.css'; // Import Bulma CSS

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
        title: '',
        studio: '',
        release: 0,
    });

    const handleAddAnime = async () => {
        try {
            const response = await fetch('/api/animes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAnime),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Anime added successfully:', data);
                // Dodaj nowe anime do listy animes na stronie
                // Jeśli chcesz odświeżyć listę, możesz dodać kod do pobierania animes i aktualizacji stanu
            } else {
                console.error('Failed to add anime:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding anime:', error);
        }
    };

    return (
        <div className="container">
            <h2>Add New Anime</h2>
            <input
                className="input"
                type="text"
                placeholder="Title"
                value={newAnime.title}
                onChange={(e) => setNewAnime({ ...newAnime, title: e.target.value })}
            />
            <input
                className="input"
                type="text"
                placeholder="Studio"
                value={newAnime.studio}
                onChange={(e) => setNewAnime({ ...newAnime, studio: e.target.value })}
            />
            <input
                className="input"
                type="number"
                placeholder="Release Year"
                value={newAnime.release}
                onChange={(e) => setNewAnime({ ...newAnime, release: Number(e.target.value) })}
            />
            <button className="button is-primary" onClick={handleAddAnime}>Add Anime</button>
            <br />
            <Link href="/animes">
                Display Animes with GET Method
            </Link>
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
