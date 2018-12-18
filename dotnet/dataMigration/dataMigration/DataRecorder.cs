using dataMigration.DTO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SQLite;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dataMigration
{
    class DataRecorder
    {
        SQLiteConnection connection;

        public DataRecorder(string connectionString)
        {
            connection = new SQLiteConnection(connectionString);
        }

        public void WriteTrabajos(List<Trabajo> trabajos)
        {
            Console.WriteLine("Inserting on Trabajos table");
            try
            {
                connection.Open();
                foreach (Trabajo trabajo in trabajos)
                {
                    var query = new System.Text.StringBuilder();
                    query.AppendLine(@"INSERT INTO Trabajos (");
                    query.AppendLine(@"	IdTrabajo, IdDentista, IdTipoTrabajo,");
                    query.AppendLine(@"	Paciente, Color, FechaTerminacion,");
                    query.AppendLine(@"	FechaEntrada, FechaPrevista, PrecioFinal,");
                    query.AppendLine(@"	PrecioMetal,");
                    query.AppendLine(@"	Nombre");
                    query.AppendLine(@")");
                    query.AppendLine(@"VALUES (");
                    query.AppendLine(@"	@IdTrabajo,	@IdDentista, @IdTipoTrabajo,");
                    query.AppendLine(@"	@Paciente, @Color, @FechaTerminacion,");
                    query.AppendLine(@"	@FechaEntrada, @FechaPrevista, @PrecioFinal,");
                    query.AppendLine(@"	@PrecioMetal,");
                    query.AppendLine(@"	@Nombre");
                    query.AppendLine(@");");

                    SQLiteCommand command = new SQLiteCommand(query.ToString(), connection);
                    command.CommandType = CommandType.Text;
                    command.Parameters.Add(new SQLiteParameter("@IdTrabajo", trabajo.IdTrabajo));
                    command.Parameters.Add(new SQLiteParameter("IdDentista", trabajo.IdDentista));
                    command.Parameters.Add(new SQLiteParameter("IdTipoTrabajo", trabajo.IdTipoTrabajo));
                    command.Parameters.Add(new SQLiteParameter("Paciente", trabajo.Paciente));
                    command.Parameters.Add(new SQLiteParameter("Color", trabajo.Color));
                    command.Parameters.Add(new SQLiteParameter("FechaTerminacion", trabajo.FechaTerminacion));
                    command.Parameters.Add(new SQLiteParameter("FechaEntrada", trabajo.FechaEntrada));
                    command.Parameters.Add(new SQLiteParameter("FechaPrevista", trabajo.FechaPrevista));
                    command.Parameters.Add(new SQLiteParameter("PrecioFinal", trabajo.PrecioFinal));
                    command.Parameters.Add(new SQLiteParameter("PrecioMetal", trabajo.PrecioMetal));
                    command.Parameters.Add(new SQLiteParameter("Nombre", trabajo.Nombre));
                    command.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex.Message);
            }
            finally
            {
                connection.Close();
            }
        }

        public void WriteDentistas(List<Dentista> dentistas)
        {
            Console.WriteLine("Inserting on Dentistas table");
            try
            {
                connection.Open();
                foreach(Dentista dentista in dentistas)
                {
                    var query = new System.Text.StringBuilder();
                    query.AppendLine(@"INSERT INTO Dentistas (");
                    query.AppendLine(@"IdDentista, NombreDentista, NombreClinica,");
                    query.AppendLine(@"DatosFiscales, Direccion, DatosBancarios,");
                    query.AppendLine(@"DatosInteres, CorreoElectronico, CP,");
                    query.AppendLine(@"Poblacion, Telefono, Telefono2");
                    query.AppendLine(@")");
                    query.AppendLine(@"VALUES (");
                    query.AppendLine(@"@IdDentista, @NombreDentista, @NombreClinica,");
                    query.AppendLine(@"@DatosFiscales, @Direccion, @DatosBancarios,");
                    query.AppendLine(@"@DatosInteres, @CorreoElectronico, @CP,");
                    query.AppendLine(@"@Poblacion, @Telefono, @Telefono2");
                    query.AppendLine(@");");

                    SQLiteCommand command = new SQLiteCommand(query.ToString(), connection);
                    command.CommandType = CommandType.Text;
                    command.Parameters.Add(new SQLiteParameter("@IdDentista", dentista.IdDentista));
                    command.Parameters.Add(new SQLiteParameter("@NombreDentista", dentista.NombreDentista));
                    command.Parameters.Add(new SQLiteParameter("@NombreClinica", dentista.NombreClinica));
                    command.Parameters.Add(new SQLiteParameter("@DatosFiscales", dentista.DatosFiscales));
                    command.Parameters.Add(new SQLiteParameter("@Direccion", dentista.Direccion));
                    command.Parameters.Add(new SQLiteParameter("@DatosBancarios", dentista.DatosBancarios));
                    command.Parameters.Add(new SQLiteParameter("@DatosInteres", dentista.DatosInteres));
                    command.Parameters.Add(new SQLiteParameter("@CorreoElectronico", dentista.CorreoElectronico));
                    command.Parameters.Add(new SQLiteParameter("@CP", dentista.CP));
                    command.Parameters.Add(new SQLiteParameter("@Poblacion", dentista.Poblacion));
                    command.Parameters.Add(new SQLiteParameter("@Telefono", dentista.Telefono));
                    command.Parameters.Add(new SQLiteParameter("@Telefono2", dentista.Telefono2));
                    command.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex.Message);
            }
            finally
            {
                connection.Close();
            }
        }

        public void WritePruebas(List<Prueba> pruebas)
        {
            Console.WriteLine("Inserting on Pruebas table");
            try
            {
                connection.Open();
                foreach(Prueba prueba in pruebas)
                {
                    var query = new System.Text.StringBuilder();
                    query.AppendLine(@"INSERT INTO Pruebas (");
                    query.AppendLine(@"IdPrueba, IdTrabajo, Descripcion,");
                    query.AppendLine(@"FechaSalida, FechaEntrada, Comentario");
                    query.AppendLine(@")");
                    query.AppendLine(@"VALUES (");
                    query.AppendLine(@"@IdPrueba, @IdTrabajo, @Descripcion,");
                    query.AppendLine(@"@FechaSalida, @FechaEntrada, @Comentario");
                    query.AppendLine(@");");

                    SQLiteCommand command = new SQLiteCommand(query.ToString(), connection);
                    command.CommandType = CommandType.Text;
                    command.Parameters.Add(new SQLiteParameter("@IdPrueba", prueba.IdPrueba));                    
                    command.Parameters.Add(new SQLiteParameter("@IdTrabajo", prueba.IdTrabajo));
                    command.Parameters.Add(new SQLiteParameter("@Descripcion", prueba.Descripcion));
                    command.Parameters.Add(new SQLiteParameter("@FechaSalida", prueba.FechaSalida));
                    command.Parameters.Add(new SQLiteParameter("@FechaEntrada", prueba.FechaEntrada));
                    command.Parameters.Add(new SQLiteParameter("@Comentario", prueba.Comentario));
                    command.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex.Message);
            }
            finally
            {
                connection.Close();
            }
        }

        public void WriteTrabajosDetalle(List<TrabajoDetalle> detalles)
        {
            Console.WriteLine("Inserting on TrabajosDetalle table");
            try
            {
                connection.Open();
                foreach (TrabajoDetalle detalle in detalles)
                {
                    var query = new System.Text.StringBuilder();
                    query.AppendLine(@"INSERT INTO TrabajosDetalle (");
                    query.AppendLine(@"IdTrabajoDetalle, IdTrabajo, Descripcion,");
                    query.AppendLine(@"Precio)");
                    query.AppendLine(@"VALUES (");
                    query.AppendLine(@"@IdTrabajoDetalle, @IdTrabajo, @Descripcion, @Precio");
                    query.AppendLine(@");");

                    SQLiteCommand command = new SQLiteCommand(query.ToString(), connection);
                    command.CommandType = CommandType.Text;
                    command.Parameters.Add(new SQLiteParameter("@IdTrabajoDetalle", detalle.IdTrabajoDetalle));
                    command.Parameters.Add(new SQLiteParameter("@IdTrabajo", detalle.IdTrabajo));
                    command.Parameters.Add(new SQLiteParameter("@Descripcion", detalle.Descripcion));
                    command.Parameters.Add(new SQLiteParameter("@Precio", detalle.Precio));
                    command.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex.Message);
            }
            finally
            {
                connection.Close();
            }
        }

        public void WriteFacturas(List<FacturaTemp> facturas)
        {
            Console.WriteLine("Inserting on Facturas table");
            try
            {
                connection.Open();
                foreach (FacturaTemp factura in facturas)
                {
                    var query = new System.Text.StringBuilder();
                    query.AppendLine(@"INSERT INTO Facturas (");
                    query.AppendLine(@"IdFactura, IdColegiado, Fecha, Total, ");
                    query.AppendLine(@"Descuento, Banco, Efectivo)");
                    query.AppendLine(@"VALUES (");
                    query.AppendLine(@"@IdFactura, @IdColegiado, @Fecha, @Total,");
                    query.AppendLine(@"@Descuento, @Banco, @Efectivo");
                    query.AppendLine(@");");

                    SQLiteCommand command = new SQLiteCommand(query.ToString(), connection);
                    command.CommandType = CommandType.Text;
                    command.Parameters.Add(new SQLiteParameter("@IdFactura", factura.IdFactura));
                    command.Parameters.Add(new SQLiteParameter("@IdColegiado", factura.IdColegiado));
                    command.Parameters.Add(new SQLiteParameter("@Fecha", factura.Fecha));
                    command.Parameters.Add(new SQLiteParameter("@Total", factura.Total));
                    command.Parameters.Add(new SQLiteParameter("@Descuento", factura.Descuento));
                    command.Parameters.Add(new SQLiteParameter("@Banco", factura.Banco));
                    command.Parameters.Add(new SQLiteParameter("@Efectivo", factura.Efectivo));                    
                    command.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex.Message);
            }
            finally
            {
                connection.Close();
            }
        }

        public void WriteFacturasDetalles(List<FacturaDetalle> facturasDetalle)
        {
            Console.WriteLine("Inserting on FacturasDetalle table");
            try
            {
                connection.Open();
                foreach (FacturaDetalle factura in facturasDetalle)
                {
                    var query = new System.Text.StringBuilder();
                    query.AppendLine(@"INSERT INTO FacturasDetalle (");
                    query.AppendLine(@"IdFacturaDetalle, IdFactura, Descripcion, Precio)");
                    query.AppendLine(@"VALUES (");
                    query.AppendLine(@"@IdFacturaDetalle, @IdFactura, @Descripcion, @Precio");
                    query.AppendLine(@");");

                    SQLiteCommand command = new SQLiteCommand(query.ToString(), connection);
                    command.CommandType = CommandType.Text;
                    command.Parameters.Add(new SQLiteParameter("@IdFacturaDetalle", factura.IdFacturaDetalle));
                    command.Parameters.Add(new SQLiteParameter("@IdFactura", factura.IdFactura));
                    command.Parameters.Add(new SQLiteParameter("@Descripcion", factura.Descripcion));
                    command.Parameters.Add(new SQLiteParameter("@Precio", factura.Precio));
                    command.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex.Message);
            }
            finally
            {
                connection.Close();
            }
        }
    }
}



