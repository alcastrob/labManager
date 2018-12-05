using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dataMigration.DTO
{
    class PruebaDetalle
    {
        public int IdPrueba { get; set; }
        public int IdFicha { get; set; }
        public string Prueba { get; set; }
        public DateTime? FechaSalida { get; set; }
        public DateTime? FechaEntrada { get; set; }
        public string Comentario { get; set; }
    }
}
