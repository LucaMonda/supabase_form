import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { User } from "lucide-react"

export const ParentInfo = ({ nomeGenitore, setNomeGenitore, cognomeGenitore, setCognomeGenitore }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <User className="h-5 w-5" />
        Dati Genitore
      </CardTitle>
      <CardDescription>Inserisci i dati del genitore o tutore legale</CardDescription>
    </CardHeader>
    <CardContent className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="parent-name">Nome Genitore</Label>
        <Input id="parent-name" placeholder="Inserisci il nome" value={nomeGenitore} onChange={(e) => setNomeGenitore(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="parent-surname">Cognome Genitore</Label>
        <Input id="parent-surname" placeholder="Inserisci il cognome" value={cognomeGenitore} onChange={(e) => setCognomeGenitore(e.target.value)} required />
      </div>
    </CardContent>
  </Card>
);