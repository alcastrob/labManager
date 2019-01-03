using System;
using System.Collections.Generic;
using System.Linq;
using dataMigration.DTO;

namespace dataMigration
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Reading the Access file data");
            string accessDataDirectory = @"C:\Users\Angel\Documents\Trabajo\Antonio Aguilar - ORMA\Data\";
            string sqliteDataDirectory = @"D:\git\labManager\";
            DataLoader loader = new DataLoader($"Provider=Microsoft.Jet.OLEDB.4.0;Data source={accessDataDirectory}SOLO_DATOS.mdb");
            DataRecorder recorder = new DataRecorder($"Data Source={sqliteDataDirectory}labManager.sqlite;Version=3;");

            List<FichaTrabajoAccess> trabajosBruto = loader.GetFichaTrabajoData();
            List<PruebaAccess> pruebasBruto = loader.GetPruebaData();
            List<DentistaAccess> dentistasBruto = loader.GetDentistaData();
            List<FacturaAccess> facturasBruto = loader.GetFacturas();
            List<ProductosLotesAccess> productosBruto = loader.GetProductosLotes();
            List<DeclaracionConformidadAccess> declaracionesBruto = loader.GetDeclaracionConformidad();



            //var myData = from f in trabajosBruto
            //             where f.Dr == "CALLE" && f.FechaTerminacion <= new DateTime(2018, 01, 31)
            //             && f.FechaEntrada >= new DateTime(2018, 01, 01)
            //             select f;

            DataTransform transformer = new DataTransform();
            Tuple<List<TrabajoDetalle>, List<TrabajoTemp>> tuple = transformer.TransformFichas(trabajosBruto);

            List<TrabajoTemp> listFichasTemp = tuple.Item2;
            List<TrabajoDetalle> listTrabajoDetalles = tuple.Item1;
            List<Prueba> listPruebas = transformer.TransformPruebas(pruebasBruto);
            List<Dentista> listDentistas = transformer.TransformDentista(dentistasBruto);
            transformer.AddMissingDentistas(listFichasTemp, listDentistas);
            List<TipoTrabajo> listTiposTrabajo = transformer.GetTipoTrabajoDataObject();
            listFichasTemp = transformer.AdaptTipoTrabajoInFichaTrabajoTemp(listFichasTemp);

            Tuple<List<FacturaDetalle>, List<FacturaTemp>> tupleFact = transformer.TransformFacturas(facturasBruto, listDentistas);

            List<FacturaDetalle> listFacturasDetalle = tupleFact.Item1;
            List<FacturaTemp> listFactura = tupleFact.Item2;

            List<Trabajo> listTrabajos = transformer.TransformFichas2(listFichasTemp);

            List<ProductosLotes> listProductos = transformer.TransformProductos(productosBruto);
            Tuple<List<DeclaracionConformidad>, List<DeclaracionProductos>> tuple2 = transformer.TransformDeclaracionConformidad(declaracionesBruto);
            List<DeclaracionConformidad> declaraciones = tuple2.Item1;
            List<DeclaracionProductos> declaracionesProductos = tuple2.Item2;

            //var dentist = from d in listDentistas
            //              where d.NombreDentista == "CALLE"
            //              select d;

            //var otherData = from f in listTrabajos
            //                where f.IdDentista == dentist.First().IdDentista && f.FechaTerminacion <= new DateTime(2018, 01, 31)
            //                && f.FechaEntrada >= new DateTime(2018, 01, 01)
            //                select f;

            //var anotherOne = from f in listTrabajos
            //                where f.IdDentista == dentist.First().IdDentista && f.FechaTerminacion <= new DateTime(2018, 01, 31)
            //                && f.FechaEntrada >= new DateTime(2018, 01, 01)
            //                select f;

            //------
            Console.WriteLine("Writing the data to the SQLite file");
            recorder.WriteDentistas(listDentistas);
            recorder.WriteTrabajos(listTrabajos);
            recorder.WritePruebas(listPruebas);
            recorder.WriteTrabajosDetalle(listTrabajoDetalles);
            recorder.WriteFacturas(listFactura);
            recorder.WriteFacturasDetalles(listFacturasDetalle);
            recorder.WriteProductosLotes(listProductos);
            recorder.WriteDeclaracionConformidad(declaraciones);
            recorder.WriteDeclaracionProductos(declaracionesProductos);

            //var result = from c in listFichasTemp
            //             where c.TipoTrabajo != "5" &&
            //             c.TipoTrabajo != "1" &&
            //             c.TipoTrabajo != "2" &&
            //             c.TipoTrabajo != "3" &&
            //             c.TipoTrabajo != "4"
            //             select c;

        }
    }
}
