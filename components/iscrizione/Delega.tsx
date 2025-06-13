import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Trash2, Plus } from "lucide-react"
import "react-datepicker/dist/react-datepicker.css"

export const Delega = ({ deleghe, updateDelegate, removeDelegate, addDelegate }) => (

  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <User className="h-5 w-5" />
        Deleghe per il ritiro del/la figlio/a
      </CardTitle>
      <CardDescription>Persone autorizzate al ritiro del minore</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-3">
        {deleghe.map((delegate, index) => (
          <div key={index} className="grid gap-4 md:grid-cols-3 items-end p-4 border rounded-lg bg-gray-50">
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor={`delegate-name-${index}`}>Nome e Cognome</Label>
              <Input
                id={`delegate-name-${index}`}
                placeholder="Inserisci nome e cognome"
                value={delegate.name}
                onChange={(e) => updateDelegate(index, "name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor={`delegate-phone-${index}`}>Recapito Telefonico</Label>
              <Input
                id={`delegate-phone-${index}`}
                type="tel"
                placeholder="Inserisci numero di telefono"
                value={delegate.phone}
                onChange={(e) => updateDelegate(index, "phone", e.target.value)}
                required
              />
            </div>
            <div className="md:col-span-1">
              {deleghe.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeDelegate(index)}
                  className="w-full md:w-auto"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Rimuovi
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" onClick={addDelegate} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Aggiungi Delegato
      </Button>
    </CardContent>
  </Card>
);