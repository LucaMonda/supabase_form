
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock } from "lucide-react"

export const TablePresenze = ({ assicurazionePagata, setAssicurazionePagata, periodo, handlePeriodChange }) => {
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

  return (<Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Clock className="h-5 w-5" />
        Per il periodo (barrare le caselle di interesse)
      </CardTitle>
      <CardDescription className="flex flex-wrap items-center justify-between">
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

      {/* Lista card per mobile */}
      <div className="md:hidden space-y-4">
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
  );
}
