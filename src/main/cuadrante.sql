SELECT d.NombreDentista,
  sum(t.PrecioFinal) AS SumaPrecioFinal,
  sum(CASE WHEN t.IdTipoTrabajo = '2' THEN t.PrecioFinal ELSE 0 END) AS SumaResina,
  sum(CASE WHEN t.IdTipoTrabajo = '3' THEN t.PrecioFinal ELSE 0 END) AS SumaOrtodoncia,
  sum(CASE WHEN t.IdTipoTrabajo = '4' THEN t.PrecioFinal ELSE 0 END) AS SumaEsqueletico,
  sum(CASE WHEN t.IdTipoTrabajo = '1' THEN t.PrecioFinal ELSE 0 END) AS SumaCeramica,
  sum(CASE WHEN t.IdTipoTrabajo = '7' THEN t.PrecioFinal ELSE 0 END) AS SumaImplante,
  sum(CASE WHEN t.IdTipoTrabajo = '5' THEN t.PrecioFinal ELSE 0 END) AS SumaZirconio,
  sum(t.PrecioMetal) AS SumaAditamentos,
  sum(CASE WHEN t.IdTipoTrabajo = '1' THEN t.PrecioFinal ELSE 0 END) +
  sum(CASE WHEN t.IdTipoTrabajo = '7' THEN t.PrecioFinal ELSE 0 END) -
  sum(t.PrecioMetal) AS SumaFija 
FROM Trabajos t
INNER JOIN Dentistas d ON d.IdDentista = t.IdDentista
WHERE t.FechaTerminacion >= date("2018-04-01")
AND t.FechaTerminacion < date("2018-05-01")
GROUP BY t.IdDentista, d.NombreDentista
ORDER BY d.NombreDentista