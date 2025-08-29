import { useState } from 'react';
import { Person, MAX_PEOPLE } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PersonCard } from '@/components/PersonCard';
import { AddPersonDialog } from '@/components/AddPersonDialog';
import { TaskStats } from '@/components/TaskStats';
import { Input } from '@/components/ui/input';
import { Search, Users } from 'lucide-react';

export default function Index() {
  const [people, setPeople] = useLocalStorage<Person[]>('task-manager-people', []);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPerson = (newPerson: Person) => {
    setPeople([...people, newPerson]);
  };

  const handleUpdatePerson = (updatedPerson: Person) => {
    setPeople(people.map(person => 
      person.id === updatedPerson.id ? updatedPerson : person
    ));
  };

  const handleDeletePerson = (personId: string) => {
    setPeople(people.filter(person => person.id !== personId));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Users className="h-8 w-8 text-blue-600" />
            Gestor de Tareas
          </h1>
          <p className="text-gray-600">
            Organiza las tareas de hasta {MAX_PEOPLE} personas
          </p>
        </div>

        {/* Stats */}
        <TaskStats people={people} />

        {/* Add Person Button */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <AddPersonDialog 
              onAddPerson={handleAddPerson}
              disabled={people.length >= MAX_PEOPLE}
            />
          </div>
        </div>

        {/* Search */}
        {people.length > 0 && (
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar personas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {/* People Grid */}
        {filteredPeople.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPeople.map((person) => (
              <PersonCard
                key={person.id}
                person={person}
                onUpdatePerson={handleUpdatePerson}
                onDeletePerson={handleDeletePerson}
              />
            ))}
          </div>
        ) : people.length > 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">
              No se encontraron personas que coincidan con "{searchTerm}"
            </div>
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <div className="text-gray-500 text-lg">
              ¡Empieza agregando tu primera persona!
            </div>
            <div className="text-sm text-gray-400">
              Puedes gestionar hasta {MAX_PEOPLE} personas con 5 tareas cada una
            </div>
          </div>
        )}
      </div>
    </div>
  );
}