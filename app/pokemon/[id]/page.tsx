"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Pokemon {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  sprites: { front_default: string };
}

interface PokemonDetails extends Pokemon {
  height: number;
  weight: number;
  abilities: { ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
}

export default function PokemonDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null)

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${params.id}`)
        const data = await response.json()
        setPokemon(data)
      } catch (error) {
        console.error('Error fetching Pokemon details:', error)
      }
    }

    if (params.id) {
      fetchPokemonDetails()
    }
  }, [params.id])

  if (!pokemon) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Button onClick={() => router.back()} className="mb-4">
        Back to Pokédex
      </Button>
      <Card className="bg-card text-card-foreground">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row">
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              width="200"
              height="200"
              className="w-48 h-48 object-contain mx-auto md:mx-0"
            />
            <div className="md:ml-6 mt-4 md:mt-0">
              <h1 className="text-3xl font-bold capitalize mb-2">{pokemon.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                {pokemon.types.map((type) => (
                  <span key={type.type.name} className={`bg-${type.type.name} text-${type.type.name}-foreground px-2 py-1 rounded-full text-sm`}>
                    {type.type.name}
                  </span>
                ))}
              </div>
              <p>Height: {pokemon.height / 10} m</p>
              <p>Weight: {pokemon.weight / 10} kg</p>
              <h2 className="text-xl font-semibold mt-4 mb-2">Abilities:</h2>
              <ul>
                {pokemon.abilities.map((ability) => (
                  <li key={ability.ability.name} className="capitalize">
                    {ability.ability.name}
                  </li>
                ))}
              </ul>
              <h2 className="text-xl font-semibold mt-4 mb-2">Stats:</h2>
              <ul>
                {pokemon.stats.map((stat) => (
                  <li key={stat.stat.name}>
                    <span className="capitalize">{stat.stat.name}:</span> {stat.base_stat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}