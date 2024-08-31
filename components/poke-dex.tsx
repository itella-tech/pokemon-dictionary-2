'use client'

import { useState, useEffect } from "react"
import { Search, X, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// ポケモンのタイプに応じた背景色を定義
const typeColors: { [key: string]: string } = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-blue-200",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-green-400",
  rock: "bg-yellow-700",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-700",
  dark: "bg-gray-700",
  steel: "bg-gray-400",
  fairy: "bg-pink-300",
}

interface Pokemon {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  sprites: { front_default: string };
}

export function PokeDex() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  const [allTypes, setAllTypes] = useState<string[]>([])

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
        const data = await response.json()
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon: { url: string }) => {
            const res = await fetch(pokemon.url)
            return res.json()
          })
        )
        setPokemons(pokemonDetails)

        const types = new Set(pokemonDetails.flatMap((pokemon: Pokemon) => 
          pokemon.types.map(type => type.type.name)
        ))
        setAllTypes(['all', ...Array.from(types)])
      } catch (error) {
        console.error('Error fetching Pokemon:', error)
      }
    }

    fetchPokemons()
  }, [])

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedType === "all" || pokemon.types.some(t => t.type.name === selectedType))
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">ポケモン図鑑</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="ポケモンを検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              {selectedType} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {allTypes.map((type) => (
              <DropdownMenuItem key={type} onSelect={() => setSelectedType(type)}>
                {type}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPokemons.map((pokemon) => (
          <Card key={pokemon.id} className="cursor-pointer hover:shadow-lg transition-shadow duration-200" onClick={() => setSelectedPokemon(pokemon)}>
            <CardContent className="p-4 flex flex-col items-center">
              <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-24 h-24 mb-2" />
              <h2 className="text-lg font-semibold mb-2">{pokemon.name}</h2>
              <div className="flex gap-2">
                {pokemon.types.map((type) => (
                  <span
                    key={type.type.name}
                    className={`${typeColors[type.type.name]} text-white text-xs font-semibold px-2 py-1 rounded`}
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={!!selectedPokemon} onOpenChange={() => setSelectedPokemon(null)}>
        {selectedPokemon && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedPokemon.name}</DialogTitle>
              <DialogDescription>ポケモン詳細情報</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center">
              <img src={selectedPokemon.sprites.front_default} alt={selectedPokemon.name} className="w-40 h-40 mb-4" />
              <div className="flex gap-2 mb-4">
                {selectedPokemon.types.map((type) => (
                  <span
                    key={type.type.name}
                    className={`${typeColors[type.type.name]} text-white text-sm font-semibold px-3 py-1 rounded`}
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
              <p className="text-center text-gray-600">
                ここに追加のポケモン情報を表示できます。例：身長、体重、能力値など
              </p>
            </div>
            <DialogFooter>
              <Button onClick={() => setSelectedPokemon(null)}>閉じる</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}