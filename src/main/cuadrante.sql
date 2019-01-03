SELECT d.NombreDentista,
  sum(t.PrecioFinal) AS SumaPrecioFinal,
  ifnull(sum(t.PrecioMetal), 0) AS SumaAditamentos,
  sum(CASE WHEN t.IdTipoTrabajo = '1' THEN t.PrecioFinal ELSE 0 END) AS SumaCeramica,
  sum(CASE WHEN t.IdTipoTrabajo = '2' THEN t.PrecioFinal ELSE 0 END) AS SumaResina,
  sum(CASE WHEN t.IdTipoTrabajo = '3' THEN t.PrecioFinal ELSE 0 END) AS SumaOrtodoncia,
  sum(CASE WHEN t.IdTipoTrabajo = '4' THEN t.PrecioFinal ELSE 0 END) AS SumaEsqueletico,
  sum(CASE WHEN t.IdTipoTrabajo = '5' THEN t.PrecioFinal ELSE 0 END) AS SumaZirconio,
  sum(CASE WHEN t.IdTipoTrabajo = '1' THEN t.PrecioFinal ELSE 0 END) +
  sum(CASE WHEN t.IdTipoTrabajo = '7' THEN t.PrecioFinal ELSE 0 END) -
  sum(t.PrecioMetal) AS SumaFija,

  sum(CASE WHEN t.IdTipoTrabajo = '1' THEN t.PrecioFinal ELSE 0 END) +
  sum(CASE WHEN t.IdTipoTrabajo = '2' THEN t.PrecioFinal ELSE 0 END) +
  sum(CASE WHEN t.IdTipoTrabajo = '3' THEN t.PrecioFinal ELSE 0 END) +
  sum(CASE WHEN t.IdTipoTrabajo = '4' THEN t.PrecioFinal ELSE 0 END) +
  sum(CASE WHEN t.IdTipoTrabajo = '5' THEN t.PrecioFinal ELSE 0 END) +
  sum(CASE WHEN t.IdTipoTrabajo = '7' THEN t.PrecioFinal ELSE 0 END) -
  sum(t.PrecioMetal) AS SumaTotalMetal
  --sum(CASE WHEN t.IdTipoTrabajo = '7' THEN t.PrecioFinal ELSE 0 END) AS SumaImplante,
FROM Trabajos t
INNER JOIN Dentistas d ON d.IdDentista = t.IdDentista
WHERE t.FechaTerminacion BETWEEN date("2018-01-01") AND date("2018-01-01", "+1 month")
GROUP BY t.IdDentista, d.NombreDentista
ORDER BY d.NombreDentista