"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabaseClient"
import "react-datepicker/dist/react-datepicker.css"

import { ParentInfo } from '@/components/iscrizione/ParentInfo'
import { ChildInfo } from '@/components/iscrizione/ChildInfo'
import { TablePresenze } from '@/components/iscrizione/TablePresenze'
import { Contatti } from "@/components/iscrizione/Contatti"
import { Delega } from "@/components/iscrizione/Delega"
import { PermessoAutonomo } from "@/components/iscrizione/PermessoAutonomo"

export default function Component() {
  const [nomeGenitore, setNomeGenitore] = useState("Nome Genitore")
  const [cognomeGenitore, setCognomeGenitore] = useState("Cognome Genitore")
  const [nome, setNome] = useState("Nome Ragazzo")
  const [cognome, setCognome] = useState("Cognome Ragazzo")
  const [natoA, setNatoA] = useState("Cesena")
  const [dataNascita, setDataNascita] = useState<Date>(new Date())
  const [cittaResidenza, setCittaResidenza] = useState("Cesena")
  const [viaResidenza, setViaResidenza] = useState("Via Prova")
  const [numeroResidenza, setNumeroResidenza] = useState("11")
  const [codiceFiscale, setCodiceFiscale] = useState("AAAAAA00A00A000A")
  const [permessoAutonomo, setPermessoAutonomo] = useState(true)
  const [deleghe, setDeleghe] = useState([{ name: "Nome Delegato", phone: "123" }])
  const [messaggio, setMessaggio] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [contatti, setContatti] = useState([{ relationship: "Nome Relazione", name: "Nome Contatto", phone: "123456", email: "contatto@email.it" }])
  const [assicurazionePagata, setAssicurazionePagata] = useState(true)
  const [periodo, setPeriodo] = useState<{ [key: string]: boolean }>({})

  /*const [nomeGenitore, setNomeGenitore] = useState("")
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
  const [periodo, setPeriodo] = useState<{ [key: string]: boolean }>({})*/

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
          <ParentInfo
            nomeGenitore={nomeGenitore}
            setNomeGenitore={setNomeGenitore}
            cognomeGenitore={cognomeGenitore}
            setCognomeGenitore={setCognomeGenitore}
          />

          {/* Dati Ragazzo */}
          <ChildInfo
            nome={nome}
            setNome={setNome}
            cognome={cognome}
            setCognome={setCognome}
            natoA={natoA}
            setNatoA={setNatoA}
            dataNascita={dataNascita}
            setDataNascita={setDataNascita}
            cittaResidenza={cittaResidenza}
            setCittaResidenza={setCittaResidenza}
            viaResidenza={viaResidenza}
            setViaResidenza={setViaResidenza}
            numeroResidenza={numeroResidenza}
            setNumeroResidenza={setNumeroResidenza}
            codiceFiscale={codiceFiscale}
            setCodiceFiscale={setCodiceFiscale}
          />

          {/* Selezione Periodi */}
          <TablePresenze
            assicurazionePagata={assicurazionePagata}
            setAssicurazionePagata={setAssicurazionePagata}
            periodo={periodo}
            handlePeriodChange={handlePeriodChange}
          />

          {/* Contatti */}
          <Contatti
            contatti={contatti}
            updateContact={updateContact}
            removeContact={removeContact}
            addContact={addContact}
          />

          {/* Deleghe per il ritiro */}
          <Delega 
            deleghe={deleghe}
            updateDelegate={updateDelegate}
            removeDelegate={removeDelegate}
            addDelegate={addDelegate} 
          />

          {/* Permesso Autonomo */}
          <PermessoAutonomo
            permessoAutonomo={permessoAutonomo}
            setPermessoAutonomo={setPermessoAutonomo}
          />

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
