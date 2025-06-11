"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, User, MapPin, Plus, Trash2, Clock } from "lucide-react"
import { format } from "date-fns"
import { it } from "date-fns/locale"
import { supabase } from "@/lib/supabaseClient"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"


export default function Component() {
  /*const [nomeGenitore, setNomeGenitore] = useState("Luca")
  const [cognomeGenitore, setCognomeGenitore] = useState("Mondaini")
  const [nome, setNome] = useState("Luca")
  const [cognome, setCognome] = useState("Mondaini")
  const [natoA, setNatoA] = useState("Cesena")
  const [dataNascita, setDataNascita] = useState<Date>(new Date())
  const [cittaResidenza, setCittaResidenza] = useState("Cesena")
  const [viaResidenza, setViaResidenza] = useState("Via Fiorenzuola")
  const [numeroResidenza, setNumeroResidenza] = useState("1107")
  const [codiceFiscale, setCodiceFiscale] = useState("MNDLCU96P23C573M")
  const [permessoAutonomo, setPermessoAutonomo] = useState(true)
  const [deleghe, setDeleghe] = useState([{ name: "Delegato", phone: "123" }])
  const [messaggio, setMessaggio] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [contatti, setContatti] = useState([{ relationship: "Mamma", name: "Contatto", phone: "123456", email: "mamma@email.it" }])
  const [assicurazionePagata, setAssicurazionePagata] = useState(true)
  const [periodo, setPeriodo] = useState<{ [key: string]: boolean }>({})*/

  const [nomeGenitore, setNomeGenitore] = useState("")
  const [cognomeGenitore, setCognomeGenitore] = useState("")
  const [nome, setNome] = useState("")
  const [cognome, setCognome] = useState("")
  const [natoA, setNatoA] = useState("")
  const [dataNascita, setDataNascita] = useState<Date>()
  const [cittaResidenza, setCittaResidenza] = useState("")
  const [viaResidenza, setViaResidenza] = useState("")
  const [numeroResidenza, setNumeroResidenza] = useState("")
  const [codiceFiscale, setCodiceFiscale] = useState("")
  const [permessoAutonomo, setPermessoAutonomo] = useState(false)
  const [deleghe, setDeleghe] = useState([{ name: "", phone: "" }])
  const [messaggio, setMessaggio] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [contatti, setContatti] = useState([{ relationship: "", name: "", phone: "", email: "" }])
  const [assicurazionePagata, setAssicurazionePagata] = useState(false)
  const [periodo, setPeriodo] = useState<{ [key: string]: boolean }>({})

  const periods = [
    { week: 1, dates: "09/06 - 13/06" },
    { week: 2, dates: "16/06 - 20/06" },
    { week: 3, dates: "23/06 - 27/06" },
    { week: 4, dates: "30/06 - 04/07" },
    { week: 5, dates: "07/07 - 11/07" },
    { week: 6, dates: "14/07 - 18/07" },
    { week: 7, dates: "21/07 - 25/07" },
    { week: 8, dates: "28/07 - 01/08" },
    { week: 9, dates: "04/08 - 08/08" },
    { week: 10, dates: "25/08 - 29/08" },
    { week: 11, dates: "01/09 - 05/09" },
  ]

  const handlePeriodChange = (weekId: string, period: string, checked: boolean) => {
    const key = `${weekId}-${period}`
    setPeriodo((prev) => ({
      ...prev,
      [key]: checked,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessaggio(null)

    const form = e.currentTarget

    try {
      const { data: iscrizione, error: iscrizioneError } = await supabase.from("iscrizioni").insert([
        {
          nome_genitore: nomeGenitore,
          cognome_genitore: cognomeGenitore,
          nome: nome,
          cognome: cognome,
          nato_a: natoA,
          data_nascita: dataNascita.toISOString().split("T")[0],
          residenza_città: cittaResidenza,
          residenza_via: viaResidenza,
          residenza_numero: numeroResidenza,
          codice_fiscale: codiceFiscale,
          permesso_autonomo: permessoAutonomo,
          assicurazione_pagata: assicurazionePagata
        },
      ]).select().single()

      if (iscrizioneError) throw iscrizioneError

      const iscrizione_id = iscrizione.id

      const delegheToInsert = deleghe.map(d => ({
        iscrizione_id,
        nome_cognome: d.name,
        recapito: d.phone,
      }))

      const { error: delegheError } = await supabase.from('deleghe').insert(delegheToInsert)

      if (delegheError) throw delegheError

      const contattiToInsert = contatti.map(d => ({
        iscrizione_id,
        grado_parentela: d.relationship,
        nome_cognome: d.name,
        recapito: d.phone,
        email: d.email
      }))

      const { error: contattiError } = await supabase.from('contatti').insert(contattiToInsert)

      if (contattiError) throw contattiError

      const settimane: Record<string, any> = {}

      for (const [key, value] of Object.entries(periodo)) {
        if (!value) continue

        const dashIndex = key.indexOf('-')
        const weekKey = key.slice(0, dashIndex)
        const periodType = key.slice(dashIndex + 1)

        if (!settimane[weekKey]) {
          settimane[weekKey] = {
            mattina: false,
            mattina_con_pranzo: false,
            pomeriggio: false,
            pomeriggio_con_pranzo: false,
            giornata_intera: false,
          }
        }

        switch (periodType) {
          case "morning":
            settimane[weekKey].mattina = true
            break
          case "morning-lunch":
            settimane[weekKey].mattina_con_pranzo = true
            break
          case "afternoon":
            settimane[weekKey].pomeriggio = true
            break
          case "afternoon-lunch":
            settimane[weekKey].pomeriggio_con_pranzo = true
            break
          case "full-day":
            settimane[weekKey].giornata_intera = true
            break
        }
      }

      for (const [weekKey, periodi] of Object.entries(settimane)) {
        const settimana = Number(weekKey.replace("week", ""))
        const { error } = await supabase.from('periodi').insert({
          iscrizione_id,
          settimana,
          ...periodi
        })
        if (error) throw error
      }



      setMessaggio({ type: "success", text: "Iscrizione completata con successo!" })
      form.reset()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      setMessaggio({ type: "error", text: `Errore durante l'iscrizione: ${error.message}` })
    }
  }

  const addDelegate = () => {
    setDeleghe([...deleghe, { name: "", phone: "" }])
  }

  const removeDelegate = (index: number) => {
    if (deleghe.length > 1) {
      setDeleghe(deleghe.filter((_, i) => i !== index))
    }
  }

  const updateDelegate = (index: number, field: "name" | "phone", value: string) => {
    const updatedDelegates = deleghe.map((delegate, i) => (i === index ? { ...delegate, [field]: value } : delegate))
    setDeleghe(updatedDelegates)
  }

  const addContact = () => {
    setContatti([...contatti, { relationship: "", name: "", phone: "", email: "" }])
  }

  const removeContact = (index: number) => {
    if (contatti.length > 1) {
      setContatti(contatti.filter((_, i) => i !== index))
    }
  }

  const updateContact = (index: number, field: "relationship" | "name" | "phone" | "email", value: string) => {
    const updatedContacts = contatti.map((contact, i) => (i === index ? { ...contact, [field]: value } : contact))
    setContatti(updatedContacts)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Iscrizione Utente</h1>
          <p className="text-lg text-gray-600">Compila tutti i campi per completare l&apos;iscrizione</p>
        </div>

        {/* Messaggio */}
        {messaggio && (
          <div
            className={`mb-4 p-4 rounded ${messaggio.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
          >
            {messaggio.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dati Genitore */}
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

          {/* Dati Ragazzo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Dati Ragazzo/a
              </CardTitle>
              <CardDescription>Inserisci i dati del minore da iscrivere</CardDescription>
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
                <Label htmlFor="street">Via</Label>
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
          {/* Selezione Periodi */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Per il periodo (barrare le caselle di interesse)
              </CardTitle>
              <CardDescription className="flex items-center justify-between">
                <span>Seleziona i periodi e gli orari desiderati</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">ASSICURAZIONE 20€</span>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="insurance-paid"
                      checked={assicurazionePagata}
                      onCheckedChange={(checked) => setAssicurazionePagata(checked as boolean)}
                    />
                    <Label htmlFor="insurance-paid" className="text-sm">
                      PAGATA
                    </Label>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="md:block hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 text-sm font-medium">SETT.</th>
                        <th className="border border-gray-300 p-2 text-sm font-medium">DATE</th>
                        <th className="border border-gray-300 p-2 text-sm font-medium">
                          MATTINA
                          <br />
                          <span className="text-xs">7:30/12:30</span>
                        </th>
                        <th className="border border-gray-300 p-2 text-sm font-medium">
                          MATTINA CON
                          <br />
                          PRANZO
                          <br />
                          <span className="text-xs">7:30/14:00</span>
                        </th>
                        <th className="border border-gray-300 p-2 text-sm font-medium">
                          POMERIGGIO
                          <br />
                          <span className="text-xs">14:00/18:00</span>
                        </th>
                        <th className="border border-gray-300 p-2 text-sm font-medium">
                          POMERIGGIO CON
                          <br />
                          PRANZO
                          <br />
                          <span className="text-xs">12:30/18:00</span>
                        </th>
                        <th className="border border-gray-300 p-2 text-sm font-medium">
                          GIORNATA
                          <br />
                          INTERA
                          <br />
                          <span className="text-xs">7:30/18:00</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {periods.map((period) => (
                        <tr key={period.week} className="hover:bg-gray-50">
                          <td className="border border-gray-300 p-2 text-center font-medium">{period.week}</td>
                          <td className="border border-gray-300 p-2 text-center text-sm">{period.dates}</td>
                          <td className="border border-gray-300 p-2 text-center">
                            <Checkbox
                              checked={periodo[`week${period.week}-morning`] || false}
                              onCheckedChange={(checked) =>
                                handlePeriodChange(`week${period.week}`, "morning", checked as boolean)
                              }
                            />
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            <Checkbox
                              checked={periodo[`week${period.week}-morning-lunch`] || false}
                              onCheckedChange={(checked) =>
                                handlePeriodChange(`week${period.week}`, "morning-lunch", checked as boolean)
                              }
                            />
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            <Checkbox
                              checked={periodo[`week${period.week}-afternoon`] || false}
                              onCheckedChange={(checked) =>
                                handlePeriodChange(`week${period.week}`, "afternoon", checked as boolean)
                              }
                            />
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            <Checkbox
                              checked={periodo[`week${period.week}-afternoon-lunch`] || false}
                              onCheckedChange={(checked) =>
                                handlePeriodChange(`week${period.week}`, "afternoon-lunch", checked as boolean)
                              }
                            />
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            <Checkbox
                              checked={periodo[`week${period.week}-full-day`] || false}
                              onCheckedChange={(checked) =>
                                handlePeriodChange(`week${period.week}`, "full-day", checked as boolean)
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="md:hidden space-y-4">
                {/* Lista card per mobile */}
                {periods.map((period) => (
                  <div key={period.week} className="border border-gray-300 rounded-md p-4 shadow-sm bg-white">
                    <div><strong>Settimana:</strong> {period.week}</div>
                    <div><strong>Date:</strong> {period.dates}</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <label className="flex items-center space-x-2">
                        <Checkbox
                          checked={periodo[`week${period.week}-morning`] || false}
                          onCheckedChange={(checked) =>
                            handlePeriodChange(`week${period.week}`, "morning", checked as boolean)
                          }
                        />
                        <span>MATTINA (7:30/12:30)</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <Checkbox
                          checked={periodo[`week${period.week}-morning-lunch`] || false}
                          onCheckedChange={(checked) =>
                            handlePeriodChange(`week${period.week}`, "morning-lunch", checked as boolean)
                          }
                        />
                        <span>MATTINA CON PRANZO (7:30/14:00)</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <Checkbox
                          checked={periodo[`week${period.week}-afternoon`] || false}
                          onCheckedChange={(checked) =>
                            handlePeriodChange(`week${period.week}`, "afternoon", checked as boolean)
                          }
                        />
                        <span>POMERIGGIO (14:00/18:00)</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <Checkbox
                          checked={periodo[`week${period.week}-afternoon-lunch`] || false}
                          onCheckedChange={(checked) =>
                            handlePeriodChange(`week${period.week}`, "afternoon-lunch", checked as boolean)
                          }
                        />
                        <span>POMERIGGIO CON PRANZO (12:30/18:00)</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <Checkbox
                          checked={periodo[`week${period.week}-full-day`] || false}
                          onCheckedChange={(checked) =>
                            handlePeriodChange(`week${period.week}`, "full-day", checked as boolean)
                          }
                        />
                        <span>GIORNATA INTERA (7:30/18:00)</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contatti */}
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
          {/* Deleghe per il ritiro */}
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

          {/* Permesso Autonomo */}
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

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button type="submit" size="lg" className="w-full md:w-auto px-8">
              Completa Iscrizione
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
