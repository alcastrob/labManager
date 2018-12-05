using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.OleDb;
using System.Data;
using dataMigration.DTO;

namespace dataMigration
{
    class DataLoader
    {
        OleDbConnection conn;
        OleDbDataReader reader;

        public DataLoader(string connectionString)
        {
            conn = new System.Data.OleDb.OleDbConnection
            {
                ConnectionString = connectionString
            };
        }

        public List<FichaTrabajoAccess> GetFichaTrabajoData()
        {
            List<FichaTrabajoAccess> fichasTrabajo = new List<FichaTrabajoAccess>();
            try
            {
                conn.Open();
                string query = "SELECT * FROM [FICHAS DE TRABAJO]";
                OleDbCommand command = new OleDbCommand(query, conn);
                reader = command.ExecuteReader();

                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        FichaTrabajoAccess f = new FichaTrabajoAccess();
                        f.Id = Convert.ToInt32(reader["Nº de trabajo"]);
                        f.Dr = CleanUpString(reader, "DR");
                        f.Colegiado = CleanUpInt(reader, "Colegiado nº");
                        f.Domicilio = CleanUpString(reader, "Domicilio");
                        f.Telefono = CleanUpString(reader, "Tlf");
                        f.Paciente = CleanUpString(reader, "Paciente");
                        f.Varon = Convert.ToBoolean(reader["Varón"]);
                        f.Hembra = Convert.ToBoolean(reader["Hembra"]);
                        f.Edad = CleanUpInt(reader, "Edad");
                        f.Indicaciones1 = CleanUpString(reader, "Indicaciónes de trabajo");
                        f.Fija = Convert.ToBoolean(reader["Fija"]);
                        f.Implantes = Convert.ToBoolean(reader["Implantes"]);
                        f.Aditamentos = Convert.ToBoolean(reader["Aditamentos"]);
                        f.Resina = Convert.ToBoolean(reader["Resina"]);
                        f.Esqueletico = Convert.ToBoolean(reader["Esquelético"]);
                        f.Ortodoncia = Convert.ToBoolean(reader["Ortodoncia"]);
                        f.Oclusion = Convert.ToBoolean(reader["Oclusión"]);
                        f.Metal = Convert.ToBoolean(reader["Metal"]);

                        f.Color = CleanUpString(reader, "Color");
                        //Foto 1
                        //Foto 2
                        f.FechaTerminacion = CleanUpDateTime(reader, "Terminacion del trabajo");
                        f.PrecioFinal = CleanUpString(reader, "Precio final del trabajo");
                        f.FechaEntrada = CleanUpDateTime(reader, "Fecha de entrada trabajo");
                        f.FechaPrevista = CleanUpDateTime(reader, "Fecha prevista trabajo");
                        f.Nombre = CleanUpString(reader, "Nombre");
                        f.CP = CleanUpString(reader, "CP");
                        f.Ciudad = CleanUpString(reader, "Ciudad");
                        f.Indicaciones2 = CleanUpString(reader, "Indicaciónes de trabajo2");
                        f.Indicaciones3 = CleanUpString(reader, "Indicaciónes de trabajo3");
                        f.Indicaciones4 = CleanUpString(reader, "Indicaciónes de trabajo4");
                        f.Indicaciones5 = CleanUpString(reader, "Indicaciónes de trabajo5");
                        f.Indicaciones6 = CleanUpString(reader, "Indicaciónes de trabajo6");
                        f.Indicaciones7 = CleanUpString(reader, "Indicaciónes de trabajo7");

                        f.Precio1 = CleanUpDecimal(reader, "Precio");
                        f.Precio2 = CleanUpDecimal(reader, "Precio2");
                        f.Precio3 = CleanUpDecimal(reader, "Precio3");
                        f.Precio4 = CleanUpDecimal(reader, "Precio4");
                        f.Precio5 = CleanUpDecimal(reader, "Precio5");
                        f.Precio6 = CleanUpDecimal(reader, "Precio6");
                        f.Precio7 = CleanUpDecimal(reader, "Precio7");
                        f.PrecioMetal = CleanUpDecimal(reader, "Precio metal");
                        f.PrecioTotal = CleanUpDecimal(reader, "Precio total");
                        f.PrecioFija = CleanUpDecimal(reader, "Precio fija");
                        f.TipoTrabajo = CleanUpString(reader, "Tipo de trabajo");

                        fichasTrabajo.Add(f);
                    }
                    reader.Close();
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex.Message);
            }
            finally
            {
                conn.Close();
            }
            return fichasTrabajo;
        }

        public List<PruebaAccess> GetPruebaData()
        {
            List<PruebaAccess> pruebas = new List<PruebaAccess>();
            try
            {
                conn.Open();
                string query = "SELECT * FROM [FECHAS TRABAJOS]";
                OleDbCommand command = new OleDbCommand(query, conn);
                reader = command.ExecuteReader();

                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        PruebaAccess p = new PruebaAccess();
                        p.Id = Convert.ToInt32(reader["Nº trabajo"]);
                        p.Prueba = CleanUpString(reader, "Prueba");
                        p.FechaSalida = CleanUpDateTime(reader, "Fecha salida");
                        p.FechaEntrada = CleanUpDateTime(reader, "Fecha entrada");
                        p.Comentario = CleanUpString(reader, "Comentario");
                        p.Manana = Convert.ToBoolean(reader["Mañana"]);
                        p.Tarde = Convert.ToBoolean(reader["Tarde"]);
                        p.Manana2 = Convert.ToBoolean(reader["Mañana 2"]);
                        p.Tarde2 = Convert.ToBoolean(reader["Tarde 2"]);

                        pruebas.Add(p);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex.Message);
            }
            finally
            {
                conn.Close();
            }
            return pruebas;
        }

        public List<DentistaAccess> GetDentistaData()
        {
            List<DentistaAccess> dentistas = new List<DentistaAccess>();
            try
            {
                conn.Open();
                string query = "SELECT * FROM [FICHAS DENTISTAS]";
                OleDbCommand command = new OleDbCommand(query, conn);
                reader = command.ExecuteReader();

                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        if (reader["Dentista"].GetType().Name != "DBNull")
                        {
                            DentistaAccess p = new DentistaAccess();
                            p.Colegiado = CleanUpInt(reader, "Colegiado nº");
                            p.Dentista = CleanUpString(reader, "Dentista");
                            p.NombreClinica = CleanUpString(reader, "Nombre de clínica");
                            p.DatosFiscales = CleanUpString(reader, "Datos fiscales");
                            p.Direccion = CleanUpString(reader, "Direccion");
                            p.DatosBancarios = CleanUpString(reader, "Datos bancarios");
                            p.DatosInteres = CleanUpString(reader, "Datos de interés");
                            p.CorreoElectronico = CleanUpString(reader, "Correo electronico");
                            p.CP = CleanUpString(reader, "CP");
                            p.Poblacion = CleanUpString(reader, "Población");
                            p.Tlf = CleanUpString(reader, "Tlf");
                            p.OtroTlf = CleanUpString(reader, "Otro tlf");                            

                            dentistas.Add(p);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex.Message);
            }
            finally
            {
                conn.Close();
            }
            return dentistas;
        }

        protected static int? CleanUpInt(OleDbDataReader reader, string columnName)
        {
            if (reader[columnName].GetType().Name == "DBNull")
                return null;
            else
                return Convert.ToInt32(reader[columnName]);
        }

        protected static DateTime? CleanUpDateTime(OleDbDataReader reader, string columnName)
        {
            if (reader[columnName].GetType().Name == "DBNull")
                return null;
            else
                return Convert.ToDateTime(reader[columnName]);
        }

        protected static Decimal? CleanUpDecimal(OleDbDataReader reader, string columnName)
        {
            if (reader[columnName].GetType().Name == "DBNull")
                return null;
            else
                return Convert.ToDecimal(reader[columnName]);
        }

        protected static string CleanUpString(OleDbDataReader reader, string columnName)
        {
            if (reader[columnName].GetType().Name == "DBNull")
                return null;
            else
                return reader[columnName].ToString();
        }
    }
}
