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

        #region "FichasTrabajo"
        public Tuple<List<Detalle>, List<FichaTrabajoTemp>> TransformFichas(List<FichaTrabajoAccess> fichas)
        {            
            List<Detalle> detallesFichas = new List<Detalle>();
            List<FichaTrabajoTemp> fichasTrabajo = new List<FichaTrabajoTemp>();

            foreach (FichaTrabajoAccess ficha in fichas)
            {
                //Creamos los correspondientes detalles de esta ficha
                ProcessIndicaciones(detallesFichas, ficha);
                fichasTrabajo.Add(MapFichaTrabajoAccess(ficha));
            }
            return new Tuple<List<Detalle>, List<FichaTrabajoTemp>>(detallesFichas, fichasTrabajo);
        }

        private FichaTrabajoTemp MapFichaTrabajoAccess(FichaTrabajoAccess ficha)
        {
            // Probably using automapper would be a better idea. But this
            // implementation is good enough for this tiny case.
            FichaTrabajoTemp returnedValue = new FichaTrabajoTemp
            {
                IdFicha = ficha.Id,
                Dr = ficha.Dr,
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
                TipoTrabajo = ficha.TipoTrabajo
            };
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

        public List<FichaTrabajo> TransformFichas2(List<FichaTrabajoTemp> fichas)
        {
            List<FichaTrabajo> returnedValue = new List<FichaTrabajo>();
            foreach(FichaTrabajoTemp ficha in fichas)
            {
                returnedValue.Add(MapFichaTrabajo(ficha));
            }
            return returnedValue;
        }

        private FichaTrabajo MapFichaTrabajo(FichaTrabajoTemp ficha)
        {
            FichaTrabajo returnedValue = new FichaTrabajo
            {
                IdFicha = ficha.IdFicha,
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
        public List<PruebaDetalle> TransformPruebas(List<PruebaAccess> pruebas)
        {
            List<PruebaDetalle> returnedValue = new List<PruebaDetalle>();

            foreach (PruebaAccess prueba in pruebas)
            {
                returnedValue.Add(MapPruebaAccess(prueba));
            }

            return returnedValue;
        }

        private PruebaDetalle MapPruebaAccess(PruebaAccess prueba)
        {
            PruebaDetalle returnedValue = new PruebaDetalle
            {
                IdPrueba = counterPruebas++,
                IdFicha = prueba.Id,
                Prueba = prueba.Prueba,
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

            foreach(DentistaAccess dentista in dentistas)
            {
                returnedValue.Add(MapDentistasAccess(dentista));
            }

            return returnedValue;
        }

        public List<Dentista> AddMissingDentistas(List<FichaTrabajoTemp> fichasTrabajo, List<Dentista> dentistas)
        {
            foreach(FichaTrabajoTemp ficha in fichasTrabajo)
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
                Tlf = dentista.Tlf,
                OtroTlf = dentista.OtroTlf
            };
            return returnedValue;
    }
        #endregion
    }
}
