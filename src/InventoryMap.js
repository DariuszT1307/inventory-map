import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { format, addDays, getISOWeek, isWeekend } from "date-fns";
import { pl } from "date-fns/locale";

const factoryIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2991/2991132.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const initialData = [
  { id: 1, plant: "Lubliniec", name: "Lubliniec - Produkt Gotowy 1", position: [50.6692, 18.6913], inventory: 80, limits: { mid: 60, high: 70 }, type: "produkt" },
  { id: 2, plant: "Lubliniec", name: "Lubliniec - Produkt Gotowy 2", position: [50.6694, 18.6915], inventory: 75, limits: { mid: 60, high: 70 }, type: "produkt" },
  { id: 3, plant: "Lubliniec", name: "Lubliniec - Produkt Gotowy 3", position: [50.6696, 18.6917], inventory: 60, limits: { mid: 60, high: 70 }, type: "produkt" },
  { id: 4, plant: "Lubliniec", name: "Lubliniec - Produkt Gotowy 4", position: [50.6698, 18.6919], inventory: 90, limits: { mid: 60, high: 70 }, type: "produkt" },
  { id: 5, plant: "Lubliniec", name: "Lubliniec - Odpad 1", position: [50.6700, 18.6921], inventory: 30, limits: { mid: 20, high: 40 }, type: "odpad" },
  { id: 6, plant: "Lubliniec", name: "Lubliniec - Odpad 2", position: [50.6702, 18.6923], inventory: 20, limits: { mid: 20, high: 40 }, type: "odpad" },
  { id: 7, plant: "Lubliniec", name: "Lubliniec - Odpad 3", position: [50.6704, 18.6925], inventory: 10, limits: { mid: 20, high: 40 }, type: "odpad" },
  { id: 8, plant: "Wyszków", name: "Wyszków - Produkt Gotowy 1", position: [52.5928, 21.4581], inventory: 70, limits: { mid: 60, high: 75 }, type: "produkt" },
  { id: 9, plant: "Wyszków", name: "Wyszków - Produkt Gotowy 2", position: [52.5930, 21.4583], inventory: 65, limits: { mid: 60, high: 75 }, type: "produkt" },
  { id: 10, plant: "Wyszków", name: "Wyszków - Produkt Gotowy 3", position: [52.5932, 21.4585], inventory: 85, limits: { mid: 60, high: 75 }, type: "produkt" },
  { id: 11, plant: "Wyszków", name: "Wyszków - Produkt Gotowy 4", position: [52.5934, 21.4587], inventory: 55, limits: { mid: 60, high: 75 }, type: "produkt" },
  { id: 12, plant: "Wyszków", name: "Wyszków - Odpad 1", position: [52.5936, 21.4589], inventory: 25, limits: { mid: 20, high: 40 }, type: "odpad" },
  { id: 13, plant: "Wyszków", name: "Wyszków - Odpad 2", position: [52.5938, 21.4591], inventory: 15, limits: { mid: 20, high: 40 }, type: "odpad" },
  { id: 14, plant: "Wyszków", name: "Wyszków - Odpad 3", position: [52.5940, 21.4593], inventory: 5, limits: { mid: 20, high: 40 }, type: "odpad" },
  { id: 15, plant: "Czarnków", name: "Czarnków - Produkt Gotowy 1", position: [52.9055, 16.5644], inventory: 60, limits: { mid: 55, high: 70 }, type: "produkt" },
  { id: 16, plant: "Czarnków", name: "Czarnków - Produkt Gotowy 2", position: [52.9057, 16.5646], inventory: 78, limits: { mid: 55, high: 70 }, type: "produkt" },
  { id: 17, plant: "Czarnków", name: "Czarnków - Produkt Gotowy 3", position: [52.9059, 16.5648], inventory: 82, limits: { mid: 55, high: 70 }, type: "produkt" },
  { id: 18, plant: "Czarnków", name: "Czarnków - Produkt Gotowy 4", position: [52.9061, 16.5650], inventory: 67, limits: { mid: 55, high: 70 }, type: "produkt" },
  { id: 19, plant: "Czarnków", name: "Czarnków - Odpad 1", position: [52.9063, 16.5652], inventory: 18, limits: { mid: 20, high: 35 }, type: "odpad" },
  { id: 20, plant: "Czarnków", name: "Czarnków - Odpad 2", position: [52.9065, 16.5654], inventory: 22, limits: { mid: 20, high: 35 }, type: "odpad" },
  { id: 21, plant: "Czarnków", name: "Czarnków - Odpad 3", position: [52.9067, 16.5656], inventory: 9, limits: { mid: 20, high: 35 }, type: "odpad" },
  { id: 22, plant: "Järvakandi", name: "Järvakandi - Produkt Gotowy 1", position: [58.7965, 24.8186], inventory: 88, limits: { mid: 65, high: 80 }, type: "produkt" },
  { id: 23, plant: "Järvakandi", name: "Järvakandi - Produkt Gotowy 2", position: [58.7967, 24.8188], inventory: 77, limits: { mid: 65, high: 80 }, type: "produkt" },
  { id: 24, plant: "Järvakandi", name: "Järvakandi - Produkt Gotowy 3", position: [58.7969, 24.8190], inventory: 66, limits: { mid: 65, high: 80 }, type: "produkt" },
  { id: 25, plant: "Järvakandi", name: "Järvakandi - Produkt Gotowy 4", position: [58.7971, 24.8192], inventory: 59, limits: { mid: 65, high: 80 }, type: "produkt" },
  { id: 26, plant: "Järvakandi", name: "Järvakandi - Odpad 1", position: [58.7973, 24.8194], inventory: 28, limits: { mid: 25, high: 40 }, type: "odpad" },
  { id: 27, plant: "Järvakandi", name: "Järvakandi - Odpad 2", position: [58.7975, 24.8196], inventory: 19, limits: { mid: 25, high: 40 }, type: "odpad" },
  { id: 28, plant: "Järvakandi", name: "Järvakandi - Odpad 3", position: [58.7977, 24.8198], inventory: 12, limits: { mid: 25, high: 40 }, type: "odpad" },
  { id: 29, plant: "Pełkinie", name: "Pełkinie - Produkt Gotowy 1", position: [50.0303, 22.5286], inventory: 72, limits: { mid: 60, high: 80 }, type: "produkt" },
  { id: 30, plant: "Pełkinie", name: "Pełkinie - Produkt Gotowy 2", position: [50.0305, 22.5288], inventory: 64, limits: { mid: 60, high: 80 }, type: "produkt" },
  { id: 31, plant: "Pełkinie", name: "Pełkinie - Produkt Gotowy 3", position: [50.0307, 22.5290], inventory: 76, limits: { mid: 60, high: 80 }, type: "produkt" },
  { id: 32, plant: "Pełkinie", name: "Pełkinie - Produkt Gotowy 4", position: [50.0309, 22.5292], inventory: 81, limits: { mid: 60, high: 80 }, type: "produkt" },
  { id: 33, plant: "Pełkinie", name: "Pełkinie - Odpad 1", position: [50.0311, 22.6832], inventory: 30, limits: { mid: 25, high: 40 }, type: "odpad" },
  { id: 34, plant: "Pełkinie", name: "Pełkinie - Odpad 2", position: [50.0312, 22.6834], inventory: 19, limits: { mid: 25, high: 40 }, type: "odpad" },
  { id: 35, plant: "Pełkinie", name: "Pełkinie - Odpad 3", position: [50.0313, 22.6836], inventory: 12, limits: { mid: 25, high: 40 }, type: "odpad" }
];
const InventoryMap = () => {
  const [data, setData] = useState(initialData);
  const [filter, setFilter] = useState("wszystkie");

  const filteredData = filter === "wszystkie" ? data : data.filter(item => item.type === filter);

  const groupedByPlant = data.reduce((acc, item) => {
    if (!acc[item.plant]) acc[item.plant] = [];
    acc[item.plant].push(item);
    return acc;
  }, {});

  const plantCoordinates = Object.entries(groupedByPlant).map(([plant, entries]) => {
    const avgLat = entries.reduce((sum, cur) => sum + cur.position[0], 0) / entries.length;
    const avgLng = entries.reduce((sum, cur) => sum + cur.position[1], 0) / entries.length;
    return { plant, lat: avgLat, lng: avgLng, items: entries };
  });

  const handleLimitChange = (id, field, value) => {
    setData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, limits: { ...item.limits, [field]: Number(value) } } : item
      )
    );
  };

  const handleInventoryChange = (id, value) => {
    setData(prev =>
      prev.map(item => (item.id === id ? { ...item, inventory: Number(value) } : item))
    );
  };

  const avgLat = data.reduce((sum, cur) => sum + cur.position[0], 0) / data.length;
  const avgLng = data.reduce((sum, cur) => sum + cur.position[1], 0) / data.length;

  const getNextWeekday = (startDate, daysToAdd) => {
    let date = addDays(startDate, daysToAdd);
    while (isWeekend(date)) {
      date = addDays(date, 1);
    }
    return date;
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", marginTop: "10px" }}>Mapa zakładów</h2>

      <MapContainer center={[avgLat, avgLng]} zoom={6} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
        />
        {plantCoordinates.map(({ plant, lat, lng, items }) => (
          <Marker key={plant} position={[lat, lng]} icon={factoryIcon}>
            <Popup>
              <strong>{plant}</strong>
              <ul>
                {items.map(item => (
                  <li key={item.id} style={{ marginTop: 8 }}>
                    {item.name}<br />
                    <label>Zapas: <input type="number" value={item.inventory} onChange={e => handleInventoryChange(item.id, e.target.value)} style={{ width: 60 }} /></label><br />
                    <label>Mid: <input type="number" value={item.limits.mid} onChange={e => handleLimitChange(item.id, 'mid', e.target.value)} style={{ width: 60 }} /></label><br />
                    <label>High: <input type="number" value={item.limits.high} onChange={e => handleLimitChange(item.id, 'high', e.target.value)} style={{ width: 60 }} /></label>
                  </li>
                ))}
              </ul>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <button onClick={() => setFilter("wszystkie")}>Wszystkie</button>
        <button onClick={() => setFilter("produkt")}>Produkt Gotowy</button>
        <button onClick={() => setFilter("odpad")}>Odpad</button>
      </div>

      <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }} border="1">
        <thead>
          <tr>
            <th>Magazyn</th>
            <th>Typ</th>
            <th>Zapas</th>
            <th>Prognoza</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(item => {
            let forecastText = "";
            let highlight = false;
            let inventoryBgColor = "white";

            if (item.type === "odpad") {
              if (item.inventory >= item.limits.high) {
                forecastText = "gotowy do odbioru";
                highlight = true;
              } else {
                const days = Math.ceil(Math.log(item.limits.high / item.inventory) / Math.log(1.1));
                const reachDate = getNextWeekday(new Date(), days);
                const reachDateStr = format(reachDate, "dd.MM.yyyy", { locale: pl });
                const weekNumber = getISOWeek(reachDate);
                forecastText = `${days} dni, ${reachDateStr} (tydzień ${weekNumber})`;
              }
            }

            if (item.type === "produkt") {
              if (item.inventory > item.limits.high) inventoryBgColor = "#f8d7da"; // red
              else if (item.inventory > item.limits.mid) inventoryBgColor = "#fff3cd"; // yellow
              else inventoryBgColor = "#d4edda"; // green
            }

            return (
              <tr key={item.id} style={{ backgroundColor: highlight ? '#f8d7da' : 'white' }}>
                <td>{item.name}</td>
                <td>{item.type}</td>
                <td style={{ backgroundColor: item.type === 'produkt' ? inventoryBgColor : undefined }}>{item.inventory}</td>
                <td>{item.type === "odpad" ? forecastText : ""}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryMap;