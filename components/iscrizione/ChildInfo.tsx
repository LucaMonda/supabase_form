import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { User } from "lucide-react"
import { it } from "date-fns/locale"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

export const ChildInfo = ({ nome, setNome, cognome, setCognome, natoA, setNatoA, dataNascita, setDataNascita, cittaResidenza, setCittaResidenza,
  viaResidenza, setViaResidenza, numeroResidenza, setNumeroResidenza, codiceFiscale, setCodiceFiscale
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <User className="h-5 w-5" />
        Dati Ragazzo/a
      </CardTitle>
      <CardDescription>Inserisci i dati del ragazzo da iscrivere</CardDescription>
    </CardHeader>
    <CardContent className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="child-name">Nome Ragazzo/a</Label>
        <Input id="child-name" placeholder="Inserisci il nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="child-surname">Cognome Ragazzo/a</Label>
        <Input id="child-surname" placeholder="Inserisci il cognome" value={cognome} onChange={(e) => setCognome(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="birth-place">Nato/a a</Label>
        <Input id="birth-place" placeholder="Città di nascita" value={natoA} onChange={(e) => setNatoA(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label>Data di nascita</Label>
        <DatePicker
          id="data-nascita"
          selected={dataNascita}
          onChange={(date: Date | null) => setDataNascita(date)}
          locale={it}
          dateFormat="dd/MM/yyyy"
          showMonthDropdown
          showYearDropdown
          maxDate={new Date()}
          minDate={new Date("1900-01-01")}
          placeholderText="Seleziona data"
          className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
          popperClassName="shadow-lg rounded-md border border-gray-200"
          calendarClassName="rounded-md"
          showPopperArrow={false}
          dropdownMode="select"
        />
      </div>
    </CardContent>
    <CardContent className="grid gap-4 md:grid-cols-3">
      <div className="space-y-2 md:col-span-3">
        <Label htmlFor="city">Città</Label>
        <Input id="city" placeholder="Inserisci la città" value={cittaResidenza} onChange={(e) => setCittaResidenza(e.target.value)} required />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="street">In</Label>
        <Input id="street" placeholder="Inserisci via/piazza" value={viaResidenza} onChange={(e) => setViaResidenza(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="street-number">Numero</Label>
        <Input id="street-number" type="number" placeholder="N°" value={numeroResidenza} onChange={(e) => setNumeroResidenza(e.target.value)} required />
      </div>
    </CardContent>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tax-code">Codice Fiscale</Label>
        <Input id="tax-code" placeholder="Inserisci il codice fiscale" className="uppercase-text" value={codiceFiscale} onChange={(e) => setCodiceFiscale(e.target.value)} maxLength={16} required />
      </div>
    </CardContent>
  </Card>
);