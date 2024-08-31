"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface Pokemon {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  sprites: { front_default: string };
}

export function Component() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
        const data = await response.json();
        const results = await Promise.all(data.results.map(async (pokemon: { url: string }) => {
          const res = await fetch(pokemon.url);
          return res.json();
        }));
        setPokemonList(results);
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
      }
    };

    fetchPokemon();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <nav className="flex items-center justify-between">
          <Link href="#" className="text-xl font-bold" prefetch={false}>
            Pokédex
          </Link>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-accent" prefetch={false}>
              Grass
            </Link>
            <Link href="#" className="hover:text-accent" prefetch={false}>
              Fire
            </Link>
            <Link href="#" className="hover:text-accent" prefetch={false}>
              Water
            </Link>
            <Link href="#" className="hover:text-accent" prefetch={false}>
              Electric
            </Link>
            <Link href="#" className="hover:text-accent" prefetch={false}>
              Bug
            </Link>
            <Link href="#" className="hover:text-accent" prefetch={false}>
              Poison
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-1 overflow-auto bg-background p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {pokemonList.map((pokemon) => (
            <Card key={pokemon.id} className="bg-card text-card-foreground rounded-lg overflow-hidden shadow-lg">
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                width="200"
                height="200"
                className="w-full h-48 object-cover"
                style={{ aspectRatio: "200/200", objectFit: "cover" }}
              />
              <CardContent className="p-4">
                <h3 className="text-xl font-bold capitalize">{pokemon.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  {pokemon.types.map((type) => (
                    <span key={type.type.name} className={`bg-${type.type.name} text-${type.type.name}-foreground px-2 py-1 rounded-full text-sm`}>
                      {type.type.name}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
