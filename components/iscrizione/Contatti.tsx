
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { User, Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export const Contatti = ({ contatti, updateContact, removeContact, addContact }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <User className="h-5 w-5" />
        Contatti
      </CardTitle>
      <CardDescription>Contatti di riferimento per il minore</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-3">
        {contatti.map((contact, index) => (
          <div key={index} className="grid gap-4 md:grid-cols-2 items-end p-4 border rounded-lg bg-gray-50">
            <div className="space-y-4">
              <Label htmlFor={`contact-relationship-${index}`}>Grado di Parentela</Label>
              <Input
                id={`contact-relationship-${index}`}
                placeholder="Inserisci grado di parentela"
                value={contact.relationship}
                onChange={(e) => updateContact(index, "relationship", e.target.value)}
                required
              />
            </div>
            <div className="space-y-4">
              <Label htmlFor={`contact-name-${index}`}>Nome e Cognome</Label>
              <Input
                id={`contact-name-${index}`}
                placeholder="Inserisci nome e cognome"
                value={contact.name}
                onChange={(e) => updateContact(index, "name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-4">
              <Label htmlFor={`contact-phone-${index}`}>Recapito Telefonico</Label>
              <Input
                id={`contact-phone-${index}`}
                type="tel"
                placeholder="Inserisci telefono"
                value={contact.phone}
                onChange={(e) => updateContact(index, "phone", e.target.value)}
                required
              />
            </div>
            <div className="space-y-4">
              <Label htmlFor={`contact-email-${index}`}>Email</Label>
              <Input
                id={`contact-email-${index}`}
                type="email"
                placeholder="Inserisci email"
                value={contact.email}
                onChange={(e) => updateContact(index, "email", e.target.value)}
                required
              />
            </div>
            <div>
              {contatti.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeContact(index)}
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
      <Button type="button" variant="outline" onClick={addContact} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Aggiungi Contatto
      </Button>
    </CardContent>
  </Card>
);
