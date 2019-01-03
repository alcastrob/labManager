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
        private int counterTrabajoDetalle = 1;
        private int counterPruebas = 1;
        private int counterDentistas = 1;
        private int counterFacturasDetalle = 1;
        private int counterDeclaracion = 1;
        private Dictionary<int, int> transformProductoLoteId = new Dictionary<int, int>();

        #region "Trabajos"
        public Tuple<List<TrabajoDetalle>, List<TrabajoTemp>> TransformFichas(List<FichaTrabajoAccess> fichas)
        {
            List<TrabajoDetalle> detallesFichas = new List<TrabajoDetalle>();
            List<TrabajoTemp> fichasTrabajo = new List<TrabajoTemp>();

            foreach (FichaTrabajoAccess ficha in fichas)
            {
                //Creamos los correspondientes detalles de esta ficha
                ProcessIndicaciones(detallesFichas, ficha);
                fichasTrabajo.Add(MapFichaTrabajoAccess(ficha));
            }
            return new Tuple<List<TrabajoDetalle>, List<TrabajoTemp>>(detallesFichas, fichasTrabajo);
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
        
        private void ProcessIndicaciones(List<TrabajoDetalle> detalles, FichaTrabajoAccess ficha)
        {
            if (!string.IsNullOrEmpty(ficha.Indicaciones1))
            {
                detalles.Add(new TrabajoDetalle
                {
                    IdTrabajoDetalle = counterTrabajoDetalle++,
                    IdTrabajo = ficha.Id,
                    Descripcion = ficha.Indicaciones1,
                    Precio = Convert.ToDecimal(ficha.Precio1)
                });
            }
            if (!string.IsNullOrEmpty(ficha.Indicaciones2))
            {
                detalles.Add(new TrabajoDetalle
                {
                    IdTrabajoDetalle = counterTrabajoDetalle++,
                    IdTrabajo = ficha.Id,
                    Descripcion = ficha.Indicaciones2,
                    Precio = Convert.ToDecimal(ficha.Precio2)
                });
            }
            if (!string.IsNullOrEmpty(ficha.Indicaciones3))
            {
                detalles.Add(new TrabajoDetalle
                {
                    IdTrabajoDetalle = counterTrabajoDetalle++,
                    IdTrabajo = ficha.Id,
                    Descripcion = ficha.Indicaciones3,
                    Precio = Convert.ToDecimal(ficha.Precio3)
                });
            }
            if (!string.IsNullOrEmpty(ficha.Indicaciones4))
            {
                detalles.Add(new TrabajoDetalle
                {
                    IdTrabajoDetalle = counterTrabajoDetalle++,
                    IdTrabajo = ficha.Id,
                    Descripcion = ficha.Indicaciones4,
                    Precio = Convert.ToDecimal(ficha.Precio4)
                });
            }
            if (!string.IsNullOrEmpty(ficha.Indicaciones5))
            {
                detalles.Add(new TrabajoDetalle
                {
                    IdTrabajoDetalle = counterTrabajoDetalle++,
                    IdTrabajo = ficha.Id,
                    Descripcion = ficha.Indicaciones5,
                    Precio = Convert.ToDecimal(ficha.Precio5)
                });
            }
            if (!string.IsNullOrEmpty(ficha.Indicaciones6))
            {
                detalles.Add(new TrabajoDetalle
                {
                    IdTrabajoDetalle = counterTrabajoDetalle++,
                    IdTrabajo = ficha.Id,
                    Descripcion = ficha.Indicaciones6,
                    Precio = Convert.ToDecimal(ficha.Precio6)
                });
            }
            if (!string.IsNullOrEmpty(ficha.Indicaciones7))
            {
                detalles.Add(new TrabajoDetalle
                {
                    IdTrabajoDetalle = counterTrabajoDetalle++,
                    IdTrabajo = ficha.Id,
                    Descripcion = ficha.Indicaciones7,
                    Precio = Convert.ToDecimal(ficha.Precio7)
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

        #region "Facturas"
        public Tuple<List<FacturaDetalle>, List<FacturaTemp>> TransformFacturas(List<FacturaAccess> facturasBruto, List<Dentista> dentistas)
        {
            List<FacturaDetalle> detallesFacturas = new List<FacturaDetalle>();
            List<FacturaTemp> facturas = new List<FacturaTemp>();

            foreach (FacturaAccess factura in facturasBruto)
            {
                //Creamos los correspondientes detalles de esta factura
                ProcessFactura(detallesFacturas, factura);
                var query = dentistas.Where(d => d.NombreDentista == factura.Nombre && d.Direccion == factura.Direccion);
                if (query.Count() != 1)
                {
                    query = dentistas.Where(d => d.NombreDentista == factura.Nombre);
                    if (query.Count() != 1)
                    {
                        throw new ApplicationException();
                    }                    
                }
                facturas.Add(MapFacturaAccess(factura, query.First().IdDentista));
            }

            return new Tuple<List<FacturaDetalle>, List<FacturaTemp>>(detallesFacturas, facturas);
        }

        private void ProcessFactura(List<FacturaDetalle> detalles, FacturaAccess factura)
        {
            if (!string.IsNullOrEmpty(factura.Concepto0))
            {
                detalles.Add(new FacturaDetalle
                {
                    IdFacturaDetalle = counterFacturasDetalle++,
                    IdFactura = factura.IdFactura,
                    Descripcion = factura.Concepto0,
                    Precio = Convert.ToDecimal(factura.Importe0)
                });
            }
            if (!string.IsNullOrEmpty(factura.Concepto1))
            {
                detalles.Add(new FacturaDetalle
                {
                    IdFacturaDetalle = counterFacturasDetalle++,
                    IdFactura = factura.IdFactura,
                    Descripcion = factura.Concepto1,
                    Precio = Convert.ToDecimal(factura.Importe1)
                });
            }
            if (!string.IsNullOrEmpty(factura.Concepto2))
            {
                detalles.Add(new FacturaDetalle
                {
                    IdFacturaDetalle = counterFacturasDetalle++,
                    IdFactura = factura.IdFactura,
                    Descripcion = factura.Concepto2,
                    Precio = Convert.ToDecimal(factura.Importe2)
                });
            }
            if (!string.IsNullOrEmpty(factura.Concepto3))
            {
                detalles.Add(new FacturaDetalle
                {
                    IdFacturaDetalle = counterFacturasDetalle++,
                    IdFactura = factura.IdFactura,
                    Descripcion = factura.Concepto3,
                    Precio = Convert.ToDecimal(factura.Importe3)
                });
            }
            if (!string.IsNullOrEmpty(factura.Concepto4))
            {
                detalles.Add(new FacturaDetalle
                {
                    IdFacturaDetalle = counterFacturasDetalle++,
                    IdFactura = factura.IdFactura,
                    Descripcion = factura.Concepto4,
                    Precio = Convert.ToDecimal(factura.Importe4)
                });
            }
            if (!string.IsNullOrEmpty(factura.Concepto5))
            {
                detalles.Add(new FacturaDetalle
                {
                    IdFacturaDetalle = counterFacturasDetalle++,
                    IdFactura = factura.IdFactura,
                    Descripcion = factura.Concepto5,
                    Precio = Convert.ToDecimal(factura.Importe5)
                });
            }
            if (!string.IsNullOrEmpty(factura.Concepto6))
            {
                detalles.Add(new FacturaDetalle
                {
                    IdFacturaDetalle = counterFacturasDetalle++,
                    IdFactura = factura.IdFactura,
                    Descripcion = factura.Concepto6,
                    Precio = Convert.ToDecimal(factura.Importe6)
                });
            }
            if (!string.IsNullOrEmpty(factura.Concepto7))
            {
                detalles.Add(new FacturaDetalle
                {
                    IdFacturaDetalle = counterFacturasDetalle++,
                    IdFactura = factura.IdFactura,
                    Descripcion = factura.Concepto7,
                    Precio = Convert.ToDecimal(factura.Importe7)
                });
            }
            if (!string.IsNullOrEmpty(factura.Concepto8))
            {
                detalles.Add(new FacturaDetalle
                {
                    IdFacturaDetalle = counterFacturasDetalle++,
                    IdFactura = factura.IdFactura,
                    Descripcion = factura.Concepto8,
                    Precio = Convert.ToDecimal(factura.Importe8)
                });
            }
        }

        private FacturaTemp MapFacturaAccess(FacturaAccess factura, int IdDentista)
        {
            // Probably using automapper would be a better idea. But this
            // implementation is good enough for this tiny case.
            FacturaTemp returnedValue = new FacturaTemp
            {
                IdFactura = factura.IdFactura,
                IdDentista = IdDentista,
                Fecha = Convert.ToDateTime(factura.Fecha),
                Total = Convert.ToDecimal(factura.Total),
                Descuento = Convert.ToDecimal(factura.Descuento),
                Banco = factura.Banco,
                Efectivo = factura.Efectivo
            };            

            return returnedValue;
        }
        #endregion

        #region "Productos y Lotes"
        public List<ProductosLotes> TransformProductos(List<ProductosLotesAccess> productosBruto)
        {
            List<ProductosLotes> returnedValue = new List<ProductosLotes>();
            int newId = 1;
            foreach(ProductosLotesAccess p in productosBruto)
            {
                if (!string.IsNullOrEmpty(p.Campo1))
                {
                    returnedValue.Add(new ProductosLotes
                    {
                        IdProductoLote = newId,
                        Descripcion = p.Campo1
                    });
                    transformProductoLoteId.Add(p.id, newId++);                    
                }
            }
            return returnedValue;
        }
        #endregion

        #region "Declaracion de Conformidad"
        public Tuple<List<DeclaracionConformidad>, List<DeclaracionProductos>> TransformDeclaracionConformidad(List<DeclaracionConformidadAccess> declaracionesBruto)
        {
            List<DeclaracionConformidad> returnedValue = new List<DeclaracionConformidad>();
            List<DeclaracionProductos> join = new List<DeclaracionProductos>();
            foreach(DeclaracionConformidadAccess declaracion in declaracionesBruto)
            {
                returnedValue.Add(new DeclaracionConformidad
                {
                    IdDeclaracion = counterDeclaracion,
                    IdTrabajo = declaracion.Albaran,
                    Fecha = declaracion.Fecha,
                    Meses = (declaracion.Meses == 12)?12:0

                });
                if (!string.IsNullOrEmpty(declaracion.ProductoLote))
                {
                    join.Add(new DeclaracionProductos
                    {
                        IdDeclaracion = counterDeclaracion,
                        IdProductoLote = transformProductoLoteId[Convert.ToInt32(declaracion.ProductoLote)]
                    });
                }
                if (!string.IsNullOrEmpty(declaracion.ProductoLote2))
                {
                    join.Add(new DeclaracionProductos
                    {
                        IdDeclaracion = counterDeclaracion,
                        IdProductoLote = transformProductoLoteId[Convert.ToInt32(declaracion.ProductoLote2)]
                    });
                }
                if (!string.IsNullOrEmpty(declaracion.ProductoLote3))
                {
                    join.Add(new DeclaracionProductos
                    {
                        IdDeclaracion = counterDeclaracion,
                        IdProductoLote = transformProductoLoteId[Convert.ToInt32(declaracion.ProductoLote3)]
                    });
                }
                if (!string.IsNullOrEmpty(declaracion.ProductoLote4))
                {
                    join.Add(new DeclaracionProductos
                    {
                        IdDeclaracion = counterDeclaracion,
                        IdProductoLote = transformProductoLoteId[Convert.ToInt32(declaracion.ProductoLote4)]
                    });
                }
                counterDeclaracion++;
            }
            return new Tuple<List<DeclaracionConformidad>, List<DeclaracionProductos>>(returnedValue, join);
        }
        #endregion

    }
}
