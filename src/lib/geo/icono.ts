// Ícono neutro (círculo blanco 32×32) que va embebido en cada KMZ generado y se
// tiñe por etapa con <IconStyle><color> en el KML. Se inlinea como base64 para no
// depender del sistema de archivos en serverless (public/ no está disponible en las
// funciones de Vercel). Generado con sharp en F0 (docs/PLAN_MAPA_KMZ.md); regenerar
// con tests/fixtures/geo/generar-fixtures.py no aplica: este PNG lo produce sharp.
export const ICONO_PUNTO_B64 =
  'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAABn0lEQVR4nO2XQU4CQRBFJ2zVA4i6gTMAFwCvAXoVgjsxrsQEIol6DnAHegdZKyZoZDO4eKbDJ5mQMNPNTMeY8JLeTGqqqqurq6qDYMd/A8gBBaACVLUq+pbzafgEOAPawO2G1ZbMcZaGD4BzoAP0gSEwAWbAj9ZM34aS6ciR/bTGj4AW0AOegZBkQsn29G8+jfFr4B54x50P4FE68tuE/QJ4AOZsz1w6Wk7HwfLMTQinpMdErws0XLK9A7yQHWPpTL4dLLO3b5lwtoTS2bApMm3giewZSPfmYgUUVVDMnc6aiXQX4hwoS+jLgwMz6S7FOXAqoYUHBxbSXYtzoObRgVC6q3EOlCT0+VdHUPSYhK82SZjTVTFdzcc1vEycGfBXiO6AeqxxgymXKpumpWbFCLgxHTawgWUUulu24XXepCt59ytM61QLTduOvzVPNIG9wAUgHxlIzC5cmWoguQIOnYyvOdFSCMcOI9lI/zS3Nr7ChM600chQOogMpQut1VA6ULabhKs7h93idjQsxvK6dbanfJiUIw+TkveHyY7AE7809AhCfjIMmgAAAABJRU5ErkJggg==';
