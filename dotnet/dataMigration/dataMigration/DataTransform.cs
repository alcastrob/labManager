using dataMigration.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dataMigration
{
    class DataTransform
    {
        private int counterFichas = 1;
        private int counterPruebas = 1;
        private int counterDentistas = 1;

        #region "Trabajos"
        public Tuple<List<Detalle>, List<TrabajoTemp>> TransformFichas(List<FichaTrabajoAccess> fichas)
        {
            List<Detalle> detallesFichas = new List<Detalle>();
            List<TrabajoTemp> fichasTrabajo = new List<TrabajoTemp>();

            foreach (FichaTrabajoAccess ficha in fichas)
            {
                //Creamos los correspondientes detalles de esta ficha
                ProcessIndicaciones(detallesFichas, ficha);
                fichasTrabajo.Add(MapFichaTrabajoAccess(ficha));
            }
            return new Tuple<List<Detalle>, List<TrabajoTemp>>(detallesFichas, fichasTrabajo);
        }

        private TrabajoTemp MapFichaTrabajoAccess(FichaTrabajoAccess ficha)
        {
            // Probably using automapper would be a better idea. But this
            // implementation is good enough for this tiny case.
            TrabajoTemp returnedValue = new TrabajoTemp
            {
                IdFicha = ficha.Id,
                Dr = ficha.Dr,
                Paciente = ficha.Paciente,
                Color = ficha.Color,
                FechaTerminacion = ficha.FechaTerminacion,
                FechaEntrada = ficha.FechaEntrada,
                FechaPrevista = ficha.FechaPrevista,
                Nombre = ficha.Nombre,
                PrecioMetal = ficha.PrecioMetal,
                PrecioTotal = ficha.PrecioTotal,
                PrecioFija = ficha.PrecioFija,
                TipoTrabajo = ficha.TipoTrabajo
            };
            if (ficha.PrecioFinal == null)
            {
                returnedValue.PrecioFinal = null;
            }
            else
            {
                decimal temp;
                if (decimal.TryParse(ficha.PrecioFinal, out temp))
                {
                    returnedValue.PrecioFinal = temp;
                }
                else
                {
                    throw new ApplicationException();
                }
            }

            return returnedValue;
        }

        private void ProcessIndicaciones(List<Detalle> detalles, FichaTrabajoAccess ficha)
        {
            if (!string.IsNullOrEmpty(ficha.Indicaciones1))
            {
                detalles.Add(new Detalle
                {
                    IdDetalle = counterFichas++,
                    IdNota = ficha.Id,
                    Descripcion = ficha.Indicaciones1,
                    Precio = ficha.Precio1
                });
            }
            if (!string.IsNullOrEmpty(ficha.Indicaciones2))
            {
                detalles.Add(new Detalle
                {
                    IdDetalle = counterFichas++,
                    IdNota = ficha.Id,
                    Descripcion = ficha.Indicaciones2,
                    Precio = ficha.Precio1
                });
            }
            if (!string.IsNullOrEmpty(ficha.Indicaciones3))
            {
                detalles.Add(new Detalle
                {
                    IdDetalle = counterFichas++,
                    IdNota = ficha.Id,
                    Descripcion = ficha.Indicaciones3,
                    Precio = ficha.Precio1
                });
            }
            if (!string.IsNullOrEmpty(ficha.Indicaciones4))
            {
                detalles.Add(new Detalle
                {
                    IdDetalle = counterFichas++,
                    IdNota = ficha.Id,
                    Descripcion = ficha.Indicaciones4,
                    Precio = ficha.Precio1
                });
            }
            if (!string.IsNullOrEmpty(ficha.Indicaciones5))
            {
                detalles.Add(new Detalle
                {
                    IdDetalle = counterFichas++,
                    IdNota = ficha.Id,
                    Descripcion = ficha.Indicaciones5,
                    Precio = ficha.Precio1
                });
            }
            if (!string.IsNullOrEmpty(ficha.Indicaciones6))
            {
                detalles.Add(new Detalle
                {
                    IdDetalle = counterFichas++,
                    IdNota = ficha.Id,
                    Descripcion = ficha.Indicaciones6,
                    Precio = ficha.Precio1
                });
            }
            if (!string.IsNullOrEmpty(ficha.Indicaciones7))
            {
                detalles.Add(new Detalle
                {
                    IdDetalle = counterFichas++,
                    IdNota = ficha.Id,
                    Descripcion = ficha.Indicaciones7,
                    Precio = ficha.Precio1
                });
            }
        }

        public List<Trabajo> TransformFichas2(List<TrabajoTemp> fichas)
        {
            List<Trabajo> returnedValue = new List<Trabajo>();
            foreach (TrabajoTemp ficha in fichas)
            {
                returnedValue.Add(MapFichaTrabajo(ficha));
            }
            return returnedValue;
        }

        private Trabajo MapFichaTrabajo(TrabajoTemp ficha)
        {
            Trabajo returnedValue = new Trabajo
            {
                IdTrabajo = ficha.IdFicha,
                IdDentista = ficha.IdDentista,
                Paciente = ficha.Paciente,
                Color = ficha.Color,
                FechaTerminacion = ficha.FechaTerminacion,
                PrecioFinal = ficha.PrecioFinal,
                FechaEntrada = ficha.FechaEntrada,
                FechaPrevista = ficha.FechaPrevista,
                Nombre = ficha.Nombre,
                PrecioMetal = ficha.PrecioMetal,
                PrecioTotal = ficha.PrecioTotal,
                PrecioFija = ficha.PrecioFija,
                IdTipoTrabajo = ficha.IdTipoTrabajo
            };
            return returnedValue;
        }

        #endregion

        #region "Pruebas"
        public List<Prueba> TransformPruebas(List<PruebaAccess> pruebas)
        {
            List<Prueba> returnedValue = new List<Prueba>();

            foreach (PruebaAccess prueba in pruebas)
            {
                returnedValue.Add(MapPruebaAccess(prueba));
            }

            return returnedValue;
        }

        private Prueba MapPruebaAccess(PruebaAccess prueba)
        {
            Prueba returnedValue = new Prueba
            {
                IdPrueba = counterPruebas++,
                IdTrabajo = prueba.Id,
                Descripcion = prueba.Prueba,
                FechaSalida = prueba.FechaSalida,
                FechaEntrada = prueba.FechaEntrada,
                Comentario = prueba.Comentario
            };
            return returnedValue;
        }
        #endregion

        #region "Dentistas"
        public List<Dentista> TransformDentista(List<DentistaAccess> dentistas)
        {
            List<Dentista> returnedValue = new List<Dentista>();

            foreach (DentistaAccess dentista in dentistas)
            {
                returnedValue.Add(MapDentistasAccess(dentista));
            }

            return returnedValue;
        }

        public List<Dentista> AddMissingDentistas(List<TrabajoTemp> fichasTrabajo, List<Dentista> dentistas)
        {
            foreach (TrabajoTemp ficha in fichasTrabajo)
            {
                var query = dentistas.Where(dentista => ficha.Dr == dentista.NombreDentista);
                if (query.Count() >= 1)
                {
                    ficha.IdDentista = query.First().IdDentista;
                }
                else
                {
                    Dentista newDentista = new Dentista
                    {
                        IdDentista = counterDentistas++,
                        NombreDentista = ficha.Dr
                    };
                    dentistas.Add(newDentista);
                    ficha.IdDentista = newDentista.IdDentista;
                }
            }
            return dentistas;
        }

        private Dentista MapDentistasAccess(DentistaAccess dentista)
        {
            Dentista returnedValue = new Dentista
            {
                IdDentista = counterDentistas++,
                NombreDentista = dentista.Dentista,
                NombreClinica = dentista.NombreClinica,
                DatosFiscales = dentista.DatosFiscales,
                Direccion = dentista.Direccion,
                DatosBancarios = dentista.DatosBancarios,
                DatosInteres = dentista.DatosInteres,
                CorreoElectronico = dentista.CorreoElectronico,
                CP = dentista.CP,
                Poblacion = dentista.Poblacion,
                Telefono = dentista.Tlf,
                Telefono2 = dentista.OtroTlf
            };
            return returnedValue;
        }
        #endregion

        #region "Tipo Trabajo"
        public List<TipoTrabajo> GetTipoTrabajoDataObject()
        {
            List<TipoTrabajo> returnedValue = new List<TipoTrabajo>();
            returnedValue.Add(new TipoTrabajo
            {
                idTipoTrabajo = 1,
                Descripcion = "Fija"
            });
            returnedValue.Add(new TipoTrabajo
            {
                idTipoTrabajo = 2,
                Descripcion = "Resina"
            });
            returnedValue.Add(new TipoTrabajo
            {
                idTipoTrabajo = 3,
                Descripcion = "Ortodoncia"
            });
            returnedValue.Add(new TipoTrabajo
            {
                idTipoTrabajo = 4,
                Descripcion = "Esquelético"
            });
            returnedValue.Add(new TipoTrabajo
            {
                idTipoTrabajo = 5,
                Descripcion = "Zirconio"
            });
            returnedValue.Add(new TipoTrabajo
            {
                idTipoTrabajo = 6,
                Descripcion = "Compostura"
            });
            returnedValue.Add(new TipoTrabajo
            {
                idTipoTrabajo = 7,
                Descripcion = "Implante"
            });
            return returnedValue;
        }

        public List<TrabajoTemp> AdaptTipoTrabajoInFichaTrabajoTemp(List<TrabajoTemp> fichas)
        {
            foreach (TrabajoTemp ficha in fichas)
            {
                switch (ficha.TipoTrabajo)
                {
                    case "1":
                        ficha.IdTipoTrabajo = 1;
                        break;
                    case "2":
                        ficha.IdTipoTrabajo = 2;
                        break;
                    case "3":
                        ficha.IdTipoTrabajo = 3;
                        break;
                    case "4":
                        ficha.IdTipoTrabajo = 4;
                        break;
                    case "5":
                        ficha.IdTipoTrabajo = 5;
                        break;
                    case "1049987891":
                        ficha.IdTipoTrabajo = 6;
                        break;
                    case "1763265016":
                        ficha.IdTipoTrabajo = 7;
                        break;
                    default: throw new ArgumentException("Unknown value: " + ficha.TipoTrabajo);
                }
            }
            return fichas;
        }
        #endregion

    }
}
