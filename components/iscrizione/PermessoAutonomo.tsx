import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { MapPin } from "lucide-react"

export const PermessoAutonomo = ({ permessoAutonomo, setPermessoAutonomo }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <MapPin className="h-5 w-5" />
        Permesso Autonomo
      </CardTitle>
      <CardDescription>Autorizzazione per il rientro a casa</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="autonomous-permission"
          checked={permessoAutonomo}
          onCheckedChange={(checked) => setPermessoAutonomo(checked as boolean)}
        />
        <Label
          htmlFor="autonomous-permission"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Permesso a tornare a casa in autonomia - Autorizzo il minore a rientrare autonomamente a casa al
          termine delle attività
        </Label>
      </div>
    </CardContent>
  </Card>
);