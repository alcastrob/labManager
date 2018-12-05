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
            DataLoader loader = new DataLoader(@"Provider=Microsoft.Jet.OLEDB.4.0;" +
                @"Data source= C:\Users\Angel\Documents\Trabajo\Antonio Aguilar - ORMA\Data\SOLO_DATOS.mdb");

            List<FichaTrabajoAccess> trabajosBruto = loader.GetFichaTrabajoData();
            List<PruebaAccess> pruebasBruto = loader.GetPruebaData();
            List<DentistaAccess> dentistasBruto = loader.GetDentistaData();

            DataTransform transformer = new DataTransform();
            Tuple<List<Detalle>, List<FichaTrabajoTemp>> tuple = transformer.TransformFichas(trabajosBruto);

            List<FichaTrabajoTemp> listFichasTemp = tuple.Item2;
            List<Detalle> listDetalles = tuple.Item1;
            List<PruebaDetalle> listPruebas = transformer.TransformPruebas(pruebasBruto);
            List<Dentista> listDentistas = transformer.TransformDentista(dentistasBruto);
            transformer.AddMissingDentistas(listFichasTemp, listDentistas);
            List<TipoTrabajo> listaTiposTrabajo = transformer.GetTipoTrabajoDataObject();
            listFichasTemp = transformer.AdaptTipoTrabajoInFichaTrabajoTemp(listFichasTemp);

            List<FichaTrabajo> listaFichas = transformer.TransformFichas2(listFichasTemp);


            var result = from c in listFichasTemp
                         where c.TipoTrabajo != "5" &&
                         c.TipoTrabajo != "1" &&
                         c.TipoTrabajo != "2" &&
                         c.TipoTrabajo != "3" &&
                         c.TipoTrabajo != "4"
                         select c;
            
        }
    }
}
