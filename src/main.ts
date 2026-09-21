import './style.css'
const URL = "https://petrik-idojaras-default-rtdb.europe-west1.firebasedatabase.app/.json"
import 'bootstrap/dist/css/bootstrap.css'
import type { Temperature } from './temperature';
document.addEventListener("DOMContentLoaded", () => {
  let temperatureList: Temperature[] = []
  const tempForm = document.getElementById("temperatureForm") as HTMLFormElement
  const content = document.getElementById("content") as HTMLElement
  const exportBtn = document.getElementById("exportBtn") as HTMLButtonElement
  const exportArea = document.getElementById("exportArea") as HTMLTextAreaElement
  function renderTable() {
    content.innerHTML = ""
    temperatureList.forEach(item => {
      const row = document.createElement("tr")
      if (item.temperature < 10) {
        row.style.backgroundColor = "#ADD8E6"
      } else if (item.temperature >= 30) {
        row.style.backgroundColor = "#FF7F7F"
      }
      const dayCell = document.createElement("td")
      dayCell.textContent = item.day
      const tempCell = document.createElement("td")
      tempCell.textContent = `${item.temperature}`
      row.appendChild(dayCell)
      row.appendChild(tempCell)
      content.appendChild(row)
    })
  }
  async function LoadTemperature() {
    try {
      const response = await fetch(URL)
      if (!response.ok) {
        throw new Error("Hibás letöltés")
      }
      const data = await response.json()
      temperatureList = data
      renderTable()
    } catch (error) {
      console.error(error)
      alert("Nem lehetett betölteni az adatokat")
    }
  }
  tempForm.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault()
    const formData = new FormData(tempForm)
    const tempValue = formData.get("temp")?.toString()
      const temperature = Number(tempValue)
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
      const todayIndex = new Date().getDay()
      const day = days[todayIndex-1]
      const newTemp: Temperature = {day, temperature}
      temperatureList.push(newTemp)
      renderTable()
      tempForm.reset()
  });
  exportBtn.addEventListener("click", () => {
    exportArea.value = JSON.stringify(temperatureList, null, 2)
  })
  LoadTemperature()
});