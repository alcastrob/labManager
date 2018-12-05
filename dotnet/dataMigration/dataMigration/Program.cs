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
            string sqliteDataDirectory = accessDataDirectory;
            DataLoader loader = new DataLoader($"Provider=Microsoft.Jet.OLEDB.4.0;Data source={accessDataDirectory}SOLO_DATOS.mdb");
            DataRecorder recorder = new DataRecorder($"Data Source={sqliteDataDirectory}labManager.sqlite;Version=3;");

            List<FichaTrabajoAccess> trabajosBruto = loader.GetFichaTrabajoData();
            List<PruebaAccess> pruebasBruto = loader.GetPruebaData();
            List<DentistaAccess> dentistasBruto = loader.GetDentistaData();

            DataTransform transformer = new DataTransform();
            Tuple<List<Detalle>, List<TrabajoTemp>> tuple = transformer.TransformFichas(trabajosBruto);

            List<TrabajoTemp> listFichasTemp = tuple.Item2;
            List<Detalle> listDetalles = tuple.Item1;
            List<Prueba> listPruebas = transformer.TransformPruebas(pruebasBruto);
            List<Dentista> listDentistas = transformer.TransformDentista(dentistasBruto);
            transformer.AddMissingDentistas(listFichasTemp, listDentistas);
            List<TipoTrabajo> listTiposTrabajo = transformer.GetTipoTrabajoDataObject();
            listFichasTemp = transformer.AdaptTipoTrabajoInFichaTrabajoTemp(listFichasTemp);

            List<Trabajo> listFichas = transformer.TransformFichas2(listFichasTemp);

            //------
            Console.WriteLine("Writing the data to the SQLite file");
            //recorder.WriteTrabajos(listFichas);
            //recorder.WriteDentistas(listDentistas);
            recorder.WritePruebas(listPruebas);

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
